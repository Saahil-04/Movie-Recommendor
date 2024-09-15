import { Card, CardMedia, CardContent, Typography, Rating, Box } from '@mui/material';

interface MovieCardProps {
  movie: {
    title: string;
    posterUrl: string;
    rating: number;
    genre: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => (
  <Card sx={{ maxWidth: 345, backgroundColor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
    <CardMedia component="img" height="400" image={movie.posterUrl} alt={movie.title} />
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {movie.title}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Rating value={movie.rating / 2} readOnly />
        <Typography variant="body2" sx={{ color: 'secondary.main' }}>
          {movie.genre}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default MovieCard;
