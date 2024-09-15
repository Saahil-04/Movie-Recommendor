import { useState } from 'react';
import { Container, Grid } from '@mui/material';
import MovieFilters from '../components/moviefilters';
import MovieCard from '../components/moviecard';

interface Movie {
    title: string;
    posterUrl: string;
    rating: number;
    genre: string;
  }

const Recommendation = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  const handleFilter = (filters: any) => {
    // Implement logic to fetch movies and apply filters.
    const movies = [
      { title: 'Inception', posterUrl: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg', rating: 8.8, genre: 'Action' },
      // More movies...
    ];
    const filtered = movies.filter(movie => movie.genre.toLowerCase() === filters.genre.toLowerCase());
    setFilteredMovies(filtered);
  };

  return (
    <Container>
      <MovieFilters onFilter={handleFilter} />
      <Grid container spacing={2}>
        {filteredMovies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Recommendation;
