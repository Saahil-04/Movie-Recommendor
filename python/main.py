from fastapi import FastAPI, HTTPException, Depends, status
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Query
from pydantic import BaseModel, Field, field_validator
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from language_map import LANGUAGE_COUNTRY_MAP
import httpx
import os
from dotenv import load_dotenv
import asyncio
import logging

import security
import database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()


# Database initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    database.create_db_tables()
    await initialize_genre_mapping()
    logger.info("Application startup complete")
    yield

app = FastAPI(
    title="Movie Recommendation API",
    description="API for movie recommendations with user authentication",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Environment Variables
TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_BASE_URL = os.getenv('TMDB_BASE_URL', 'https://api.themoviedb.org/3')

if not TMDB_API_KEY:
    raise ValueError("TMDB_API_KEY environment variable is required")

# Global Cache
GENRE_MAPPING: Dict[int, str] = {}

# Auth Setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# ============= PYDANTIC MODELS =============

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    password: str = Field(..., min_length=6, max_length=72)
    
    @field_validator('password')
    @classmethod
    def validate_password_bytes(cls, v):
        """Ensure password doesn't exceed bcrypt's 72 byte limit"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password cannot exceed 72 bytes when encoded')
        return v


class User(BaseModel):
    username: str
    email: str

    model_config = {
    "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class WishlistMovieBase(BaseModel):
    movie_id: int = Field(..., gt=0)

class WishlistMovie(WishlistMovieBase):
    id: int
    user_id: int

    model_config = {
    "from_attributes": True
    }

class Filters(BaseModel):
    mood: Optional[str] = Field(None, pattern='^(happy|neutral|sad)$')  # Changed regex to pattern
    genre: int = Field(..., gt=0)
    movieAge: Optional[str] = Field(None, pattern='^(new|classic|all)$')  # Changed regex to pattern
    ageRating: Optional[str] = None
    language: Optional[str] = None

class RequestBody(BaseModel):
    filters: Filters
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

class MovieDetail(BaseModel):
    id: int
    title: str
    overview: Optional[str]
    poster_url: Optional[str]
    rating: float
    genre: List[str]
    cast: List[str]

class PaginationInfo(BaseModel):
    current_page: int
    page_size: int
    total_pages: int
    total_results: int

class MoviesResponse(BaseModel):
    movies: List[MovieDetail]
    pagination: PaginationInfo

# ============= CONSTANTS =============

MOOD_MAPPING = {
    'happy': ['uplifting', 'funny', 'feel-good', 'comedy', 'joy'],
    'neutral': ['balanced', 'thought-provoking', 'mild', 'drama'],
    'sad': ['emotional', 'heart-wrenching', 'deep', 'melancholy']
}

# ============= UTILITY FUNCTIONS =============

async def initialize_genre_mapping():
    """Initialize genre mapping on startup"""
    global GENRE_MAPPING
    if not GENRE_MAPPING:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{TMDB_BASE_URL}/genre/movie/list",
                    params={'api_key': TMDB_API_KEY}
                )
                response.raise_for_status()
                genres = response.json().get('genres', [])
                GENRE_MAPPING = {genre['id']: genre['name'] for genre in genres}
                logger.info(f"Loaded {GENRE_MAPPING} genres")
                logger.info(f"Loaded {len(GENRE_MAPPING)} genres")
        except Exception as e:
            logger.error(f"Failed to fetch genre mapping: {e}")
            raise

def replace_genre_ids_with_names(genre_ids: List[int]) -> List[str]:
    """Convert genre IDs to genre names"""
    return [GENRE_MAPPING.get(genre_id, "Unknown") for genre_id in genre_ids]

async def get_keyword_id(client: httpx.AsyncClient, keyword: str) -> Optional[int]:
    """Search for a keyword and return its ID"""
    try:
        response = await client.get(
            f"{TMDB_BASE_URL}/search/keyword",
            params={'api_key': TMDB_API_KEY, 'query': keyword},
            timeout=5.0
        )
        response.raise_for_status()
        results = response.json().get('results', [])
        return results[0]['id'] if results else None
    except Exception as e:
        logger.warning(f"Failed to fetch keyword ID for '{keyword}': {e}")
        return None

async def get_movie_cast(client: httpx.AsyncClient, movie_id: int) -> List[str]:
    """Fetch top cast members for a movie"""
    try:
        response = await client.get(
            f"{TMDB_BASE_URL}/movie/{movie_id}/credits",
            params={'api_key': TMDB_API_KEY},
            timeout=5.0
        )
        response.raise_for_status()
        cast = response.json().get('cast', [])
        return [actor['name'] for actor in cast[:5]]
    except Exception as e:
        logger.warning(f"Failed to fetch cast for movie {movie_id}: {e}")
        return []

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(database.get_db)
) -> database.User:
    """Validate JWT token and return current user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = database.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# ============= MOVIE ENDPOINTS =============

@app.get("/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    """Fetch detailed information for a specific movie"""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/{movie_id}",
                params={
                    "api_key": TMDB_API_KEY,
                    "append_to_response": "videos,credits"
                }
            )
            
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Movie not found")
            
            response.raise_for_status()
            movie_data = response.json()

            # Extract trailer
            videos = movie_data.get("videos", {}).get("results", [])
            trailer = next(
                (v for v in videos if v["type"] == "Trailer" and v["site"] == "YouTube"),
                None
            )
            
            # Extract cast
            credits = movie_data.get("credits", {}).get("cast", [])
            cast_list = [
                {
                    "name": actor.get("name"),
                    "profilePic": f"https://image.tmdb.org/t/p/w500{actor.get('profile_path')}"
                    if actor.get("profile_path") else None
                }
                for actor in credits[:10]
            ]

            return {
                "id": movie_data.get("id"),
                "title": movie_data.get("title"),
                "description": movie_data.get("overview"),
                "posterUrl": f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}"
                if movie_data.get('poster_path') else None,
                "trailerUrl": f"https://www.youtube.com/embed/{trailer['key']}" if trailer else None,
                "genre": [g["name"] for g in movie_data.get("genres", [])],
                "releaseDate": movie_data.get("release_date"),
                "duration": movie_data.get("runtime"),
                "imdbRating": movie_data.get("vote_average"),
                "tagline": movie_data.get("tagline"),
                "cast": cast_list,
            }
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching movie details: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/movies/genre/{genre_id}")
async def get_movies_by_genre(genre_id: int, page: int = 1):
    """Fetch movies by genre with pagination"""
    # Ensure genre mapping is initialized before use
    if not GENRE_MAPPING:
        await initialize_genre_mapping()

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/discover/movie",
                params={
                    "api_key": TMDB_API_KEY,
                    "with_genres": genre_id,
                    "page": page,
                    "language": "en-US",
                    "sort_by": "popularity.desc",
                }
            )
            response.raise_for_status()
            data = response.json()
            
            movies = data.get('results', [])
            if not movies:
                raise HTTPException(status_code=404, detail="No movies found for this genre")
            
            # Fetch cast concurrently
            cast_tasks = [get_movie_cast(client, movie['id']) for movie in movies]
            casts = await asyncio.gather(*cast_tasks)
            
            movie_details = [
                {
                    "id": movie['id'],
                    "title": movie['title'],
                    "overview": movie['overview'],
                    "poster_path": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                    if movie.get('poster_path') else None,
                    "rating": movie['vote_average'],
                    "genre": replace_genre_ids_with_names(movie['genre_ids']),
                    "cast": cast
                }
                for movie, cast in zip(movies, casts)
            ]
            
            return JSONResponse(content={
                "movies": movie_details,
                "hasNextPage": page < data.get('total_pages', 1),
                "currentPage": page,
            })
    except httpx.HTTPError as e:
        logger.error(f"Error fetching movies by genre: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch movies")

@app.get("/genres")
async def get_genres():
    """Get all available movie genres"""
    return [{"id": gid, "name": name} for gid, name in GENRE_MAPPING.items()]

@app.get("/languages")
async def get_languages():
    """Get all available languages from TMDB"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/configuration/languages",
                params={'api_key': TMDB_API_KEY}
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Error fetching languages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch languages")

@app.post("/recommendations", response_model=MoviesResponse)
async def get_recommendations(request_body: RequestBody):
    """Get movie recommendations based on filters"""
    filters = request_body.filters
    page = request_body.page
    page_size = request_body.page_size # Note: page_size is not used in your TMDB query

    async with httpx.AsyncClient(timeout=20.0) as client:
        # Build base parameters
        params = {
            'api_key': TMDB_API_KEY,
            'with_genres': filters.genre,
            'page': page,
            'sort_by': 'popularity.desc',
        }

        # --- MODIFICATION 1: Make Certification Country Dynamic ---
        if filters.ageRating and filters.ageRating.strip():
            country_code = LANGUAGE_COUNTRY_MAP.get(filters.language, 'US')
            params['certification_country'] = country_code
            params['certification.lte'] = filters.ageRating

        if filters.language and filters.language.strip():
            params['with_original_language'] = filters.language

        current_date = datetime.now()
        if filters.movieAge == 'new':
            five_years_ago = current_date.replace(year=current_date.year - 5)
            params['primary_release_date.gte'] = five_years_ago.strftime('%Y-%m-%d')
        elif filters.movieAge == 'classic':
            five_years_ago = current_date.replace(year=current_date.year - 5)
            params['primary_release_date.lte'] = five_years_ago.strftime('%Y-%m-%d')
        
        # Add mood keywords if present
        keyword_ids = []
        if filters.mood:
            mood_keywords = MOOD_MAPPING.get(filters.mood, [])
            if mood_keywords:
                keyword_tasks = [get_keyword_id(client, kw) for kw in mood_keywords[:3]]
                keyword_ids = [kid for kid in await asyncio.gather(*keyword_tasks) if kid]
                if keyword_ids:
                    params['with_keywords'] = '|'.join(map(str, keyword_ids))
        
        # --- MODIFICATION 2: Improved Fallback Logic ---
        
        # Create a list of parameter combinations to try, from most specific to least
        param_sets_to_try = []
        
        # Start with a copy of the full parameters
        base_attempt = params.copy()
        base_attempt['vote_count.gte'] = 100
        param_sets_to_try.append(base_attempt)
        
        # Fallback 1: Remove keywords (often the most restrictive)
        if 'with_keywords' in base_attempt:
            attempt_2 = base_attempt.copy()
            del attempt_2['with_keywords']
            param_sets_to_try.append(attempt_2)
            
        # Fallback 2: Remove vote count
        attempt_3 = {k: v for k, v in param_sets_to_try[-1].items() if k != 'vote_count.gte'}
        param_sets_to_try.append(attempt_3)

        # Fallback 3: Remove certification (if it was added)
        if 'certification_country' in attempt_3:
            attempt_4 = attempt_3.copy()
            del attempt_4['certification_country']
            del attempt_4['certification.lte']
            param_sets_to_try.append(attempt_4)

        data = {}
        movies = []
        
        # Loop through the attempts until we get results
        for i, current_params in enumerate(param_sets_to_try):
            logger.info(f"Attempting TMDB request with param set #{i+1}")
            try:
                response = await client.get(f"{TMDB_BASE_URL}/discover/movie", params=current_params)
                response.raise_for_status()
                data = response.json()
                movies = data.get('results', [])
                if movies:
                    logger.info(f"Success on attempt #{i+1}, found {len(movies)} movies.")
                    break # Exit the loop if we found movies
            except Exception as e:
                logger.warning(f"Attempt #{i+1} failed: {e}")
                continue # Go to the next, less restrictive attempt

        if not movies:
            raise HTTPException(
                status_code=404,
                detail="No movies found. Try adjusting your filters."
            )

        # --- The rest of your function remains the same ---
        cast_tasks = [get_movie_cast(client, movie['id']) for movie in movies]
        casts = await asyncio.gather(*cast_tasks)

        movie_details = [
            MovieDetail(
                id=movie['id'],
                title=movie['title'],
                overview=movie.get('overview', ''),
                poster_url=f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                if movie.get('poster_path') else None,
                rating=movie.get('vote_average', 0.0),
                genre=replace_genre_ids_with_names(movie.get('genre_ids', [])),
                cast=cast
            )
            for movie, cast in zip(movies, casts)
        ]

        return MoviesResponse(
            movies=movie_details,
            pagination=PaginationInfo(
                current_page=page,
                page_size=len(movie_details), # Use the actual number of results
                total_pages=data.get('total_pages', 1),
                total_results=data.get('total_results', 0)
            )
        )
        
# Add this to your existing main.py file

@app.get("/api/movies/search")
async def search_movies(
    query: str = Query(..., min_length=1, description="Search query for movies"),
    page: int = Query(1, ge=1, description="Page number"),
    include_adult: bool = Query(False, description="Include adult content")
):
    """Search for movies by title, keyword, or description"""
    if not query or not query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/search/movie",
                params={
                    "api_key": TMDB_API_KEY,
                    "query": query.strip(),
                    "page": page,
                    "include_adult": include_adult,
                    "language": "en-US"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            movies = data.get('results', [])
            
            if not movies:
                return JSONResponse(content={
                    "movies": [],
                    "pagination": {
                        "current_page": page,
                        "total_pages": 0,
                        "total_results": 0,
                        "has_next_page": False
                    },
                    "message": "No movies found matching your search"
                })
            
            # Fetch cast for each movie concurrently
            cast_tasks = [get_movie_cast(client, movie['id']) for movie in movies]
            casts = await asyncio.gather(*cast_tasks)
            
            movie_details = [
                {
                    "id": movie['id'],
                    "title": movie['title'],
                    "overview": movie.get('overview', ''),
                    "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                    if movie.get('poster_path') else None,
                    "backdrop_url": f"https://image.tmdb.org/t/p/w1280{movie['backdrop_path']}"
                    if movie.get('backdrop_path') else None,
                    "rating": movie.get('vote_average', 0.0),
                    "release_date": movie.get('release_date'),
                    "genre": replace_genre_ids_with_names(movie.get('genre_ids', [])),
                    "cast": cast,
                    "popularity": movie.get('popularity', 0)
                }
                for movie, cast in zip(movies, casts)
            ]
            
            return JSONResponse(content={
                "movies": movie_details,
                "pagination": {
                    "current_page": page,
                    "total_pages": data.get('total_pages', 1),
                    "total_results": data.get('total_results', 0),
                    "has_next_page": page < data.get('total_pages', 1)
                }
            })
            
    except httpx.HTTPStatusError as e:
        logger.error(f"TMDB API error during search: {e}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Failed to search movies from TMDB"
        )
    except Exception as e:
        logger.error(f"Error searching movies: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during search")        
        


# ============= AUTHENTICATION ENDPOINTS =============

@app.post("/auth/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = Depends(database.get_db)):
    """Register a new user"""
    try:
        # Check for existing users
        if database.get_user_by_email(db, email=user.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        if database.get_user_by_username(db, username=user.username):
            raise HTTPException(status_code=400, detail="Username already taken")

        # Hash password
        hashed_password = security.get_password_hash(user.password)
        
        # Create user
        db_user = database.User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"New user registered: {user.username}")
        return db_user
        
    except HTTPException:
        # Re-raise HTTP exceptions (like duplicate email/username)
        raise
    except ValueError as e:
        # Handle validation errors (like password too long)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Handle any other errors
        logger.error(f"Signup error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail="Registration failed. Please try again."
        )
        
 

@app.post("/auth/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    """Authenticate user and return JWT token"""
    user = database.get_user_by_username(db, username=form_data.username)
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    logger.info(f"User logged in: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: database.User = Depends(get_current_user)):
    """Get current authenticated user"""

    return current_user

# ============= WISHLIST ENDPOINTS =============

@app.post("/users/me/wishlist", response_model=WishlistMovie, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    wishlist_item: WishlistMovieBase,
    db: Session = Depends(database.get_db),
    current_user: database.User = Depends(get_current_user)
):
    """Add a movie to user's wishlist"""
    existing = database.get_wishlist_item(db, user_id=current_user.id, movie_id=wishlist_item.movie_id)
    if existing:
        raise HTTPException(status_code=409, detail="Movie already in wishlist")
    
    return database.add_movie_to_wishlist(db=db, user_id=current_user.id, movie_id=wishlist_item.movie_id)

@app.get("/users/me/wishlist", response_model=List[WishlistMovie])
async def get_wishlist(
    db: Session = Depends(database.get_db),
    current_user: database.User = Depends(get_current_user)
):
    """Get user's wishlist"""
    return database.get_wishlist_for_user(db, user_id=current_user.id)

@app.delete("/users/me/wishlist/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    movie_id: int,
    db: Session = Depends(database.get_db),
    current_user: database.User = Depends(get_current_user)
):
    """Remove a movie from user's wishlist"""
    db_wishlist_item = database.get_wishlist_item(db, user_id=current_user.id, movie_id=movie_id)
    if not db_wishlist_item:
        raise HTTPException(status_code=404, detail="Movie not found in wishlist")
    
    database.remove_movie_from_wishlist(db, db_wishlist_item=db_wishlist_item)

# ============= ROOT ENDPOINT =============

@app.get("/")
async def root():
    return {"message": "API running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}