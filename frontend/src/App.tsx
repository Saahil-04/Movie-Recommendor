import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Recommendation from './pages/recomendation';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';
import Genres from './pages/genres';
import MoviesByGenre from './pages/moviesbygenre';
import MovieDetails from './pages/moviedetails';
import 'lenis/dist/lenis.css';
import LoginPage from './pages/loginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import { useLenis } from './hooks/useLenis';
import "./App.css"
import SearchPage from './pages/searchPage';

const App = () => {

  useLenis();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>

        <Navbar />
        <main
          style={{ marginTop: '0px' }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/genres/:genreId" element={<MoviesByGenre />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            {/* Fallback 404 route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
