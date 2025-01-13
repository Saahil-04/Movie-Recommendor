import { useState, useRef } from 'react';
import { Card, CardMedia, CardContent, Typography, Rating, Box } from '@mui/material';

interface MovieCardProps {
  movie: {
    title: string;
    poster_url: string;
    rating: number;
    genre: string[];
    overview: string;
    cast: string[];
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 300; // Adjust this to the width of your popup
    const popupHeight = 300; // Adjust this to the height of your popup
  
    // Calculate the default position
    let top = rect.top + window.scrollY + 300;
    let left = rect.left + rect.width;
  
    // Adjust the `left` position if the popup goes beyond the right edge of the viewport
    if (left + popupWidth > window.innerWidth) {
      left = window.innerWidth - popupWidth - 10; // Add some padding to the right edge
    }
  
    // Adjust the `top` position if the popup goes beyond the bottom edge of the viewport
    if (top + popupHeight > window.innerHeight) {
      top = rect.top + window.scrollY - popupHeight + 800 ; // Add some padding to the top edge
    }
  
    // Set the new position
    setPopupPosition({ top, left });
    setIsHovered(true);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget;

    // Safely check if relatedTarget is a valid Node and contains containerRef
    if (
      !(relatedTarget instanceof Node) || // Ensure relatedTarget is a valid DOM Node
      (containerRef.current && !containerRef.current.contains(relatedTarget)) // Ensure containerRef is valid and contains relatedTarget
    ) {
      setIsHovered(false);
    }
  };

  return (
    <div>
      {/* Movie Card */}
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        <CardMedia
          component="img"
          image={movie.poster_url}
          alt={movie.title}
          sx={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />

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
              {movie.genre[0]}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Custom Popup */}
      {isHovered && (
        <Box
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={(event) => {
            const relatedTarget = event.relatedTarget;

            // Safely check if relatedTarget is a valid Node and containerRef contains it
            if (
              !(relatedTarget instanceof Node) || // Ensure relatedTarget is a valid DOM Node
              (containerRef.current && !containerRef.current.contains(relatedTarget)) // Ensure containerRef is valid and contains relatedTarget
            ) {
              setIsHovered(false);
            }
          }}
          sx={{
            position: 'absolute',
            top: popupPosition.top,
            left: popupPosition.left,
            transform: 'translate(-50%, -100%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: 2,
            borderRadius: 2,
            boxShadow: 6,
            zIndex: 10,
            width: 300,
            maxHeight: 300,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '4px',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            {movie.title}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            {movie.overview}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', marginBottom: 1 }}>
            Genre: {movie.genre.join(', ')}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Cast: {movie.cast.join(', ')}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Rating value={movie.rating / 2} readOnly precision={0.1} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d9b61c' }}>
              {(movie.rating / 2).toFixed(1)}
            </Typography>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default MovieCard;
