import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Rating, Box } from '@mui/material';

interface MovieCardProps {
  movie: {
    title: string;
    poster_url: string;
    rating: number;
    genre: string;
    overview: string;
    cast: string[];
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        height: 450,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: 3,
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: 6 },
        backgroundColor: 'background.paper',
      }}
    >
      {/* Movie Poster */}
      <CardMedia
        component="img"
        image={movie.poster_url}
        alt={movie.title}
        sx={{
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      />

      {/* Hover Overlay */}
      {hovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
              {movie.title}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              {movie.overview}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Genre: {movie.genre}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              Cast: {movie.cast.join(',')}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Rating value={movie.rating / 2} readOnly precision={0.1} />
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d9b61c' }}>
                {(movie.rating / 2).toFixed(1)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Default Content */}
      {!hovered && (
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            noWrap
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
            <Typography variant="body2" sx={{ color: 'secondary.main' }}>
              {movie.genre}
            </Typography>
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default MovieCard;
