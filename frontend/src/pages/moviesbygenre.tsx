import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Skeleton, Box, Rating } from '@mui/material';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  rating:number;

}

interface LocationState {
  genreName?: string;
}

const MoviesByGenre = () => {
  const { genreId } = useParams();
  const { state } = useLocation() as { state: LocationState };
  const [movies, setMovies] = useState<Movie[]>([]);
  const genreName = state?.genreName || 'Movies';
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch movies of the selected genre
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/movies/genre/${genreId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.movies); // Assuming backend returns { movies: [...] }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false); // Hide loading effect after fetch
      }
    };

    fetchMovies();
  }, [genreId]);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h3" textAlign="center" gutterBottom sx={{fontWeight: 'bold'}}>
        {genreName}
      </Typography>
      <Grid container spacing={2}>

        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={400} animation="wave" />
              <Skeleton variant="text" animation="wave" />
              <Skeleton variant="text" animation="wave" />
            </Grid>
          )) :
          (
            <Grid container spacing={3} sx={{ margin: '10px' }}>
              {movies.map((movie) => (
                <Grid item xs={12} sm={4} md={3} key={movie.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column", // Ensures content stacks vertically
                      height: "100%", // Forces cards to stretch within the grid
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Adjust image URL as per TMDB docs
                      alt={movie.title}
                      sx={{
                        height: '4  00px',
                        objectFit: 'cover',
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1, // Ensures content fills the remaining space
                        display: "flex",
                        alignItems: "center", // Center text vertically
                        justifyContent: "center", // Center text horizontally
                        flexDirection:'column',

                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        // noWrap
                        sx={{ fontWeight: 'bold', color: 'primary.main', marginBottom: 1 }}
                      >
                        {movie.title}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={movie.rating / 2} readOnly precision={0.1} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#d9b61c',
                              fontWeight: 'bold',
                            }}
                          >
                            {(movie.rating / 2).toFixed(1)}
                          </Typography>
                        </Box>
                        {/* <Typography variant="body2" sx={{ color: 'secondary.main' }}>
                          {movie.genre[0]}
                        </Typography> */}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

      </Grid>
    </Container>
  );
};

export default MoviesByGenre;