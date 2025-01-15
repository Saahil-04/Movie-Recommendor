from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

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
        movies = response.json().get('results', [])
        if not movies:
            raise HTTPException(status_code=404, detail="No movies found matching your criteria")

        # Process movie details
        movie_details = []
        for movie in movies:
            movie_id = movie['id']
            cast = get_movie_cast(movie_id)  # Get cast details
            movie_details.append({
                "id": movie['id'],
                "title": movie['title'],
                # "overview": movie['overview'],
                "poster_path": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie.get('poster_path') else None,
                "rating": movie['vote_average'],
                # "genre": replace_genre_ids_with_names(movie['genre_ids']),
                # "cast": cast
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
async def get_recommendations(filters: Filters):
    fetch_genre_mapping()  # Ensure the genre mapping is available

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
            'with_original_language':filters.language
            # 'with_keywords': ','.join([str(kw) for kw in keyword_ids])  # Join the keyword IDs
        })
        response.raise_for_status()
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=500, detail="Error fetching movies from TMDB")

    movies = response.json().get('results', [])
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

    return {"movies": movie_details}
