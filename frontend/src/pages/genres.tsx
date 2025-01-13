import { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Genre = {
    id: number;
    name: string;
  };

const Genres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch genres from the backend
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/genres'); // Adjust endpoint as needed
        const data = await response.json();
        setGenres(data); // Assuming data.genres is an array
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId: number, genreName: string) => {
    // Navigate to the movies page with the selected genre ID
    navigate(`/genres/${genreId}`, { state: { genreName } });
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Explore Genres
      </Typography>
      <Grid container spacing={3}>
        {genres.map((genre) => (
          <Grid item xs={12} sm={6} md={4} key={genre.id}>
            <Card>
              <CardActionArea onClick={() => handleGenreClick(genre.id, genre.name)}>
                <CardContent>
                  <Typography variant="h6" textAlign="center">
                    {genre.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Genres;
