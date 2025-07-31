from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TMDB_API_KEY = 'b238a46baa3fa8bd5fbae8981280cf06'
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

GENRE_MAPPING = {}

def fetch_genre_mapping():
    global GENRE_MAPPING
    if not GENRE_MAPPING:
        try:
            response = requests.get(f"{TMDB_BASE_URL}/genre/movie/list", params={
                'api_key': TMDB_API_KEY
            })
            response.raise_for_status()
            genres = response.json().get('genres', [])
            GENRE_MAPPING = {genre['id']: genre['name'] for genre in genres}
        except requests.exceptions.RequestException:
            raise HTTPException(status_code=500, detail="Error fetching genres from TMDB")

# Replace genre IDs with genre names
def replace_genre_ids_with_names(genre_ids):
    return [GENRE_MAPPING.get(genre_id, "Unknown") for genre_id in genre_ids]

# Define the mood-related keyword mapping
MOOD_MAPPING = {
    'happy': ['uplifting', 'funny', 'feel-good'],
    'neutral': ['balanced', 'thought-provoking', 'mild'],
    'sad': ['emotional', 'heart-wrenching', 'deep']
}

class Filters(BaseModel):
    mood: str
    genre: int
    movieAge: str
    ageRating: str
    language:str
    
class RequestBody(BaseModel):
    filters: Filters
    page: int = 1
    page_size: int = 20

# Get genre ID for a genre string
def get_genre_id(genre_name):
    genre_mapping = {
        'action': 28,
        'comedy': 35,
        'drama': 18,
        'romance': 10749,
        # Add more genre mappings here
    }
    return genre_mapping.get(genre_name.lower())

# Search for a keyword and get its ID
def get_keyword_id(keyword):
    try:
        response = requests.get(f"{TMDB_BASE_URL}/search/keyword", params={
            'api_key': TMDB_API_KEY,
            'query': keyword
        })
        response.raise_for_status()
        results = response.json().get('results', [])
        if results:
            return results[0]['id']  # Return the first keyword ID found
        return None
    except requests.exceptions.RequestException:
        return None

# Get the cast details for a movie
def get_movie_cast(movie_id):
    try:
        response = requests.get(f"{TMDB_BASE_URL}/movie/{movie_id}/credits", params={
            'api_key': TMDB_API_KEY
        })
        response.raise_for_status()
        cast = response.json().get('cast', [])
        return [actor['name'] for actor in cast[:5]]  # Limit to top 5 actors
    except requests.exceptions.RequestException:
        return []



movies = [
    {
        "id": 1,
        "title": "Inception",
        "posterUrl": "https://example.com/inception-poster.jpg",
        "trailerUrl": "https://www.youtube.com/embed/YoHD9XEInc0",
        "description": "A thief who steals corporate secrets...",
        "genre": ["Sci-Fi", "Action"],
        "duration": 148,
        "releaseDate": "2010-07-16",
        "imdbRating": 8.8,
        "cast": [
            {"name": "Leonardo DiCaprio", "profilePic": "https://example.com/leo.jpg"},
            {"name": "Joseph Gordon-Levitt", "profilePic": "https://example.com/joseph.jpg"},
        ],
    },
    # Add more movies
]

# Fetch movie details by ID
@app.get("/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    try:
        async with httpx.AsyncClient() as client:
            # Fetch movie details
            movie_url = f"{TMDB_BASE_URL}/movie/{movie_id}"
            movie_response = await client.get(
                movie_url, params={"api_key": TMDB_API_KEY, "append_to_response": "videos,credits"}
            )
            if movie_response.status_code != 200:
                raise HTTPException(status_code=movie_response.status_code, detail="Movie not found")
            
            movie_data = movie_response.json()

            # Extract main details
            movie_details = {
                "id": movie_data.get("id"),
                "title": movie_data.get("title"),
                "description": movie_data.get("overview"),
                "posterUrl": f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}",
                "trailerUrl": None,
                "genre": [genre["name"] for genre in movie_data.get("genres", [])],
                "releaseDate": movie_data.get("release_date"),
                "duration": movie_data.get("runtime"),
                "imdbRating": movie_data.get("vote_average"),
                "cast": [],
            }

            # Get trailer
            videos = movie_data.get("videos", {}).get("results", [])
            trailer = next((video for video in videos if video["type"] == "Trailer" and video["site"] == "YouTube"), None)
            if trailer:
                movie_details["trailerUrl"] = f"https://www.youtube.com/embed/{trailer['key']}"

            # Get cast
            credits = movie_data.get("credits", {}).get("cast", [])
            for actor in credits[:10]:  # Limit to 10 cast members
                movie_details["cast"].append({
                    "name": actor.get("name"),
                    "profilePic": f"https://image.tmdb.org/t/p/w500{actor.get('profile_path')}" if actor.get("profile_path") else None
                })

            return movie_details

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@app.get("/api/movies/genre/{genre_id}")
async def get_movies_by_genre(genre_id: int, page: int = 1):
    """
    Fetch movies by genre using TMDB API.

    Args:
        genre_id (int): The ID of the genre.
        page (int): The page number for paginated results (default: 1).

    Returns:
        JSONResponse: A JSON response with the list of movies.
    """
    url = f"{TMDB_BASE_URL}/discover/movie"
    params = {
        "api_key": TMDB_API_KEY,
        "with_genres": genre_id,
        "page": page,
        "language": "en-US",  # Optional: Specify the language
        "sort_by": "popularity.desc",  # Sort by popularity (default)
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        movies = data.get('results', [])
        if not movies:
            raise HTTPException(status_code=404, detail="No movies found matching your criteria")
        total_pages = data.get('total_pages', 1)  # Get the total number of pages
        has_next_page = page < total_pages  # Determine if there are more pages
        # Process movie details
        movie_details = []
        for movie in movies:
            movie_id = movie['id']
            cast = get_movie_cast(movie_id)  # Get cast details
            movie_details.append({
                "id": movie['id'],
                "title": movie['title'],
                "overview": movie['overview'],
                "poster_path": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie.get('poster_path') else None,
                "rating": movie['vote_average'],
                "genre": replace_genre_ids_with_names(movie['genre_ids']),
                "cast": cast
            })
            
         # Return movies and pagination info
        return JSONResponse(content={
            "movies": movie_details,
            "hasNextPage": has_next_page,
            "currentPage": page,
        })

        return JSONResponse(content={"movies": movie_details})
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movies: {str(e)}")
@app.get("/genres")
async def get_genres():
    try:
        response = requests.get(f"{TMDB_BASE_URL}/genre/movie/list", params={"api_key": TMDB_API_KEY})
        response.raise_for_status()
      
        return response.json().get("genres", [])
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Error fetching genres from TMDB")

@app.get("/languages")
async def get_languages():
    try:
        response = requests.get(f"{TMDB_BASE_URL}/configuration/languages", params={
            'api_key': TMDB_API_KEY
        })
        response.raise_for_status()
        languages = response.json()
        return languages
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=500, detail="Error fetching languages from TMDB")
    
    
@app.post("/recommendations")
async def get_recommendations(request_body:RequestBody):
    filters = request_body.filters
    page = request_body.page
    page_size = request_body.page_size    
    fetch_genre_mapping()  # Ensure the genre mapping is available
    print(f"Received page: {page}")  # Add this to check the value

    # genre_id = get_genre_id(filters.genre)
    if not filters.genre:
        raise HTTPException(status_code=400, detail="Invalid genre selection")


    # Get the keyword ID based on the mood
    mood_keywords = MOOD_MAPPING.get(filters.mood, [])
    keyword_ids = []
    for mood_keyword in mood_keywords:
        keyword_id = get_keyword_id(mood_keyword)
        if keyword_id:
            keyword_ids.append(keyword_id)

    if not keyword_ids:
        raise HTTPException(status_code=400, detail="No keywords found for the selected mood")

    try:
        # Call TMDB API to discover movies with genre and keyword filters
        response = requests.get(f"{TMDB_BASE_URL}/discover/movie", params={
            'api_key': TMDB_API_KEY,
            'with_genres': filters.genre,
            'certification_country': 'US',
            'certification': filters.ageRating,
            'primary_release_date_gte': datetime.now().strftime('%Y-%m-%d') if filters.movieAge == 'new' else '2000-01-01',
            'with_original_language':filters.language,
            'page': page,  # Pagination: TMDB supports page-based results
            # 'with_keywords': ','.join([str(kw) for kw in keyword_ids])  # Join the keyword IDs
        })
        response.raise_for_status()
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=500, detail="Error fetching movies from TMDB")

    movies = response.json().get('results', [])
    total_pages = response.json().get('total_pages', 1)
    total_results = response.json().get('total_results', 0)
    if not movies:
        raise HTTPException(status_code=404, detail="No movies found matching your criteria")

    # Add cast details for each movie
    movie_details = []
    for movie in movies:
        movie_id = movie['id']
        cast = get_movie_cast(movie_id)
        movie_details.append({
            "title": movie['title'],
            "overview": movie['overview'],
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
            "rating": movie['vote_average'],
            "genre": replace_genre_ids_with_names(movie['genre_ids']),
            "cast": cast
        })

    return {"movies": movie_details,
            "pagination": {
            "current_page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "total_results": total_results
        }
            }
