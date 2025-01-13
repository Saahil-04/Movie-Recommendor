import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar
      position="static" // Keeps it fixed at the top
      sx={{
        backgroundColor: '#121212', // Sleek dark background
        color: 'white', // White text color for contrast
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for modern look
        zIndex: 1300, // Ensures it's on top of other elements
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo / Brand Name */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            FlicPick
          </Typography>

          {/* Navigation Buttons */}
          <Button
            color="inherit"
            component={Link}
            to="/recommendation"
            sx={{
              fontSize: '1rem',
              textTransform: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle hover effect
              },
            }}
          >
            Recommend Me!
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
