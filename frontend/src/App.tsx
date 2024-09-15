import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Recommendation from './pages/recomendation';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';

const App = () => (
  <ThemeProvider theme = {darkTheme}>
    <CssBaseline/>
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recommendation" element={<Recommendation />} />
    </Routes>
  </Router>
  </ThemeProvider>
);

export default App;
