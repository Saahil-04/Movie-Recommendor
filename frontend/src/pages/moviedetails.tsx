import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

const MovieDetails = () => {
  const { id } = useParams(); // Movie ID from the URL
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/movies/${id}`);
        setMovie(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#121212',
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!movie) {
    return <Typography color="error">Movie not found.</Typography>;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: `url(${movie.posterUrl}) no-repeat center center/cover`,
        color: '#fff',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)', // Dark overlay
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {movie.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {movie.releaseDate} • {movie.genre.join(', ')} • {movie.duration} mins
        </Typography>
        <Typography variant="body1" paragraph>
          {movie.description}
        </Typography>

        {/* Trailer */}
        {movie.trailerUrl && (
          <Box sx={{ my: 3 }}>
            <iframe
              width="100%"
              height="400"
              src={movie.trailerUrl}
              title="Trailer"
              allowFullScreen
              style={{ borderRadius: '10px', border: 'none' }}
            />
          </Box>
        )}

        {/* Ratings */}
        <Typography variant="h6">Ratings:</Typography>
        <Typography variant="body2" gutterBottom>
          IMDb: {movie.imdbRating}/10
        </Typography>

        {/* Cast */}
        <Typography variant="h6">Cast:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {movie.cast.map((actor: any) => (
            <Box key={actor.name} sx={{ textAlign: 'center' }}>
              <img
                src={actor.profilePic}
                alt={actor.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <Typography variant="body2">{actor.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MovieDetails;