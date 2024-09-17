import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1c1c1c' }}>
    <Toolbar>
      <Typography sx={{ flexGrow: 1 }} >
       <Typography variant="h6" style={{textDecoration:'none', color:'white',fontWeight: 'bold'}} component = {Link} to='/'>
        FlicPick
       </Typography>
      </Typography>
      <Button color="inherit" sx={{fontSize:15}} component={Link} to="/recommendation">
        Recommend ME!!
      </Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;
