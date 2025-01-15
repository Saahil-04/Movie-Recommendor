import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Skeleton, Box, Rating, CircularProgress, Button } from '@mui/material';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  rating: number;

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
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const [hasNextPage, setHasNextPage] = useState(true); // Indicates if more pages are available
  // const observerRef = useRef<HTMLDivElement | null>(null); // Ref for the observer

  const fetchMovies = async (page: number, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true); // Show main loading spinner for the initial load
      } else {
        setIsPageLoading(true); // Show loading spinner for "Load More" button
      }

      const response = await axios.get(`http://localhost:8000/api/movies/genre/${genreId}`, {
        params: { page },
      });

      const { movies: newMovies, hasNextPage: nextPage } = response.data;

      setMovies((prevMovies) => {
        const movieIds = new Set(prevMovies.map((movie) => movie.id));
        const filteredMovies = newMovies.filter((movie: { id: number }) => !movieIds.has(movie.id));
        return [...prevMovies, ...filteredMovies];
      });

      setHasNextPage(nextPage); // Update if more pages are available
      setCurrentPage(page); // Update the current page
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false); // Hide main loading spinner
      } else {
        setIsPageLoading(false); // Hide "Load More" button spinner
      }
    }
  };

  useEffect(() => {
    // Fetch movies of the selected genre
    fetchMovies(1, true);
  }, [genreId]);

  // useEffect(() => {
  //   if (!observerRef.current || !hasNextPage || isPageLoading) return;

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         fetchMovies(currentPage + 1); // Fetch the next page
  //       }
  //     },
  //     { threshold: 1.0 }
  //   );

  //   observer.observe(observerRef.current);

  //   return () => {
  //     if (observerRef.current) observer.unobserve(observerRef.current);
  //   };
  // }, [currentPage, hasNextPage, isPageLoading]);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
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
                        flexDirection: 'column',

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
        {isPageLoading && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* {hasNextPage && !isPageLoading && (
                          <Box ref={observerRef} sx={{ height: '50px', mt: 2 }} />
                        )} */}
        {hasNextPage && !isPageLoading && (
          <Box sx={{ textAlign: 'center', width: '100%', margin: '15px auto'  }}>
            <Button
              variant="contained"
              onClick={() => fetchMovies(currentPage + 1)}
              disabled={isPageLoading}
            >
              Load More
            </Button>
          </Box>
        )}
        {!hasNextPage && (
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
            No more movies to load.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default MoviesByGenre;