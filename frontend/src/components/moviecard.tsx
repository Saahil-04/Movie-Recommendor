import { Card, CardMedia, CardContent, Typography, Rating, Box } from '@mui/material';

interface MovieCardProps {
  movie: {
    title: string;
    poster_url: string;
    rating: number;
    genre: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => (
  <Card
    sx={{
      // maxWidth: 345,
      backgroundColor: 'background.paper',
      // borderRadius: 3,
      // boxShadow: 3
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 350, // Set fixed height
      width: '100%', // Full width within its container
    }}
  >
    <CardMedia component="img" height="400" image={movie.poster_url} alt={movie.title}
      sx={{
        height: '65%', // Image takes up 65% of the card height
        objectFit: 'cover', // Ensure image fits properly
      }} 
      />
    <CardContent>
      <Typography variant="h6" component="h2"  noWrap sx={{ fontWeight: 'bold', color: 'primary.main' ,marginBottom:1 }}>
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
