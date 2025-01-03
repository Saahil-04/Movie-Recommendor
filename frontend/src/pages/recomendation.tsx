import { useState, useRef, useEffect } from 'react';
import { Container, Grid, Skeleton } from '@mui/material';
import MovieFilters from '../components/moviefilters';
import MovieCard from '../components/moviecard';
import axios from 'axios';

interface Movie {
  title: string;
  poster_url: string;
  rating: number;
  genre: string;
  overview: string;
  cast: string[];
}

const Recommendation = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  const cardsSectionRef = useRef<HTMLDivElement>(null); // Ref for the movie cards section

  const handleFilter = async (filters: any) => {
    setIsLoading(true); // Show loading effect
    try {
      const response = await axios.post('http://localhost:8000/recommendations/', filters);
      setFilteredMovies(response.data.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading effect after fetch
      setTimeout(() => {
        if (cardsSectionRef.current) {
          cardsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  useEffect(() => {
    // Debugging: Log the ref current value when movies are updated
    console.log('Updated filteredMovies:', filteredMovies);
    console.log('cardsSectionRef:', cardsSectionRef.current);
  }, [filteredMovies]);

  return (
    <Container>
      <MovieFilters onFilter={handleFilter} />
      <div ref={cardsSectionRef}>
        <Grid container spacing={2}>
        {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton variant="rectangular" height={300} animation="wave" />
                  <Skeleton variant="text" animation="wave" />
                  <Skeleton variant="text" animation="wave" />
                </Grid>
              ))
            : filteredMovies.map((movie, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
        </Grid>
      </div>
    </Container>
  );
};

export default Recommendation;
