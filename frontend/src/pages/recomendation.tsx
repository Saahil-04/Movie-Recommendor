import { useState } from 'react';
import { Container, Grid } from '@mui/material';
import MovieFilters from '../components/moviefilters';
import MovieCard from '../components/moviecard';
import axios from 'axios';

interface Movie {
  title: string;
  poster_url: string;
  rating: number;
  genre: string;
}

const Recommendation = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  const handleFilter = async (filters: any) => {
    console.log(filters);
    try {
      const response = await axios.post('http://localhost:8000/recommendations/', filters);
      console.log("the response is ", response.data);
      setFilteredMovies(response.data)

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <MovieFilters onFilter={handleFilter} />
      <Grid container spacing={2}>
        {filteredMovies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Recommendation;
