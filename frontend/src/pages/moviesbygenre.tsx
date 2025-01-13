import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
  }

interface LocationState {
    genreName?: string;
  }

const MoviesByGenre = () => {
  const { genreId } = useParams();
  const { state } = useLocation() as { state: LocationState }; 
  const [movies, setMovies] = useState<Movie[]>([]);
  const genreName = state?.genreName || 'Movies';

  useEffect(() => {
    // Fetch movies of the selected genre
    const fetchMovies = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/movies/genre/${genreId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setMovies(data.movies); // Assuming backend returns { movies: [...] }
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      };

    fetchMovies();
  }, [genreId]);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {genreName}
      </Typography>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Adjust image URL as per TMDB docs
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  {movie.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MoviesByGenre;