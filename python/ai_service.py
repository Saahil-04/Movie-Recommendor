import httpx
import os
import logging

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"  

async def get_movie_explanation(
    mood: str,
    movie_title: str,
    movie_overview: str,
    genres: list[str]
) -> str | None:
    if not GROQ_API_KEY:
        logger.warning("GROQ_API_KEY not set")
        return None

    try:
        genre_str = ", ".join(genres) if genres else "Unknown"

        prompt = f"""A user is feeling: {mood}

Recommended movie: {movie_title}
Genres: {genre_str}
Description: {movie_overview}

Write 2-3 sentences explaining why this movie matches their mood.
Be specific to the film. No generic statements.Talk to the User Directly in a friendly manner."""

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 150
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    except Exception as e:
        logger.error(f"Groq API error for {movie_title}: {e}")
        return None