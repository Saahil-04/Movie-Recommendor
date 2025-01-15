// pages/Home.tsx
import { Container, Typography, Box, Button, Stack } from '@mui/material';
// import { darkTheme } from '../theme';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 50px)',
        // minHeight: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {/* <Navbar/> */}

      <Container
        sx={{
          position: 'relative',
          zIndex: 2, // Ensure text stays above overlay
          color: 'white',
          textAlign: 'center',
          pt: 5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mt: 20,
            mb: 3,
            textShadow: '2px 2px 10px rgba(0,0,0,0.7)',
          }}
        >
          Discover Movies You’ll Love
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 5,
            margin:'auto',
            maxWidth: '600px',
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          Your next movie night is just a click away. Find films tailored to your mood, genre preferences, or explore top recommendations!
        </Typography>

        {/* Call-to-Actions */}
        <Stack direction="row" spacing={3}>
          <div style={{width:'100%', display:'flex',justifyContent:'center' , gap:'100px',marginTop:'15px'}}>


          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              // backgroundColor: '#ff5722',

            }}
            component={Link}
            to="/recommendation"
          >
            Get Recommendations
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
             component={Link}
            to="/genres"
            >
            Explore Genres
          </Button>
            </div>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
