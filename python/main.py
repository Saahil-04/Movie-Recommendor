import requests
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List,Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TMDB_API_KEY = "b238a46baa3fa8bd5fbae8981280cf06"
TMDB_BASE_URL = "https://api.themoviedb.org/3"
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjM4YTQ2YmFhM2ZhOGJkNWZiYWU4OTgxMjgwY2YwNiIsIm5iZiI6MTcyNjQ3NTA5MC44MTM0OTMsInN1YiI6IjY2ZTdkNjIxZGQyMjRkMWEzOTkxYjgwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8UBWZIwnbeWt4s_tYWc3FGjm-8xwGvyM_pJg5Qr76dY"
}


# User input model
class UserInput(BaseModel):
    mood: str
    genre: Optional[str]
    ageRating: Optional[str]
    movieAge: Optional[str]

# Movie response model
class Movie(BaseModel):
    title: str
    poster_url: str
    rating: float
    genre: str

# Mapping moods to genres (based on user input)
mood_to_genre_map = {
    "happy": "35",  # Comedy
    "exciting": "28",  # Action
    "romantic": "10749",  # Romance
}

# Mapping user-friendly genres to TMDB genres (you can add more)
genres_map = {
    "action": "28",
    "comedy": "35",
    "romantic": "10749",
    # Add more mappings if needed
}


def fetch_from_tmdb(filters:UserInput):
    params = {
        "api_key": TMDB_API_KEY,
        "certification_country": "US",  # For age rating
    }

    # Add genre filter from user input or mood mapping
    if filters.genre:
        params["with_genres"] = genres_map.get(filters.genre, "")
    elif filters.mood:
        params["with_genres"] = mood_to_genre_map.get(filters.mood, "")

    # Add age rating filter
    if filters.ageRating:
        params["certification"] = filters.ageRating

    # Add release date filter based on movie age preference
    if filters.movieAge == "new":
        params["primary_release_date_gte"] = "2015-01-01"
    elif filters.movieAge == "old":
        params["primary_release_date_lte"] = "2015-01-01"

    # Send a request to TMDB
    response = requests.get(f"{TMDB_BASE_URL}/discover/movie",params=params)
    response.raise_for_status()  # Raises an exception if the request fails
    data = response.json()

    # Convert TMDB data into a simplified movie format
    movies = [
        {
            "title": movie["title"],
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
            "rating": movie["vote_average"],
            "genre": filters.genre if filters.genre else filters.mood,  # Use genre or mood
        }
        for movie in data["results"]
    ]

    return movies

# Endpoint to get movie recommendations
@app.post("/recommendations/", response_model=List[Movie])
def get_recommendations(user_input: UserInput):
    movies = fetch_from_tmdb(user_input)
    return movies