import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import TheatersIcon from '@mui/icons-material/Theaters';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#000', // Sleek dark background
        color: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for modern look
        zIndex: 1300, // Ensures it's on top of other elements
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          sx={{
            height: '50px !important', // Explicitly set height for the toolbar
            minHeight: '50px !important', // Override default minHeight
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // Center content vertically
            padding: '0 16px', // Optional: Add some horizontal padding
          }}
        >
          {/* Logo / Brand Name */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center', // Vertically centers the logo
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            <TheatersIcon sx={{ marginRight: 0.5 }} />
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
              padding: '4px 12px', // Smaller padding for button to match height
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
