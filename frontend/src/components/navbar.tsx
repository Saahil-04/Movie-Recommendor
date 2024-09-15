import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1c1c1c' }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        Movie Recommendation
      </Typography>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button color="inherit" component={Link} to="/recommendation">
        Recommendations
      </Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;
