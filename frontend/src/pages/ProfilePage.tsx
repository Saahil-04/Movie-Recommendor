import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { User, Mail, LogOut, Bookmark, Film, Loader2 } from 'lucide-react';
import api from '../api';
import MovieCard from '../components/moviecard';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  rating: number;
  genre: string[];
  overview: string;
  cast: string[];
}

const ProfilePage = () => {
  const { user, logout, wishlist } = useAuth();
  const [wishlistMovies, setWishlistMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    const fetchWishlistMovieDetails = async () => {
      if (wishlist.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const moviePromises = wishlist.map(item =>
          api.get(`/movies/${item.movie_id}`).then(res => {
            const movieData = res.data;
            return {
              ...movieData,
              poster_url: movieData.posterUrl, // Map posterUrl to poster_url
              rating: movieData.imdbRating, // Map imdbRating to rating
              overview: movieData.description, // Map description to overview
              cast: movieData.cast.map((c: { name: string }) => c.name), // Extract cast names
            };
          })
        );

        const moviesData = await Promise.all(moviePromises);
        console.log("Wishlist movies: ", moviesData);
        setWishlistMovies(moviesData);
      } catch (error) {
        console.error("Failed to fetch wishlist movie details", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWishlistMovieDetails();
    }
  }, [wishlist, user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
          <Film className="absolute inset-0 m-auto w-6 h-6 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-black">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 mb-16"
        >
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.username}!</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
              <Mail className="w-5 h-5" />
              <span>{user.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex-shrink-0 flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl hover:bg-red-600/40 hover:text-white transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Wishlist Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-8">
            <Bookmark className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">My Wishlist ({wishlist.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>
          ) : wishlistMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {wishlistMovies.map((movie, i) => (
                <motion.div key={movie.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}><MovieCard movie={movie} /></motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-black/20 border border-white/10 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
              <p className="text-gray-400">Start exploring and add movies you want to watch!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;