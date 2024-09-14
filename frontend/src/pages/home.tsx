// pages/Home.tsx
import { Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Movie Recommendation System!
      </Typography>
      <Typography>
        Select a mood, genre, and more to find movies tailored to your preferences.
      </Typography>
    </Container>
  );
};

export default Home;
