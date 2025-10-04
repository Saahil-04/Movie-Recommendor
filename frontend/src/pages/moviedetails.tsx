import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Calendar, Users, Film, Bookmark, BookMarked } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import api from '../api';
import { useAuth } from '../AuthContext';

interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl: string | null;
  genre: string[];
  releaseDate: string;
  duration: number;
  imdbRating: number;
  tagline: string;
  cast: {
    name: string;
    profilePic: string | null;
  }[];
}

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, wishlist, addToWishlist, removeFromWishlist } = useAuth();

  const isInWishlist = movie ? wishlist.some(item => item.movie_id === movie.id) : false;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useScrollToTop()

  const handleWishlistToggle = async () => {
    if (!movie || !isAuthenticated) return;
    try {
      if (isInWishlist) {
        await removeFromWishlist(movie.id);
      } else {
        await addToWishlist(movie.id);
      }
    } catch (err) {
      console.error("Failed to update wishlist", err);
    }
  };

  if (loading) {
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
          <p className="text-gray-400">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-12 gap-8 mb-16"
        >
          {/* Movie Poster */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
              >
                {movie.title}
              </motion.h1>

              {/* Meta Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 mb-6"
              >
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-200 text-sm">{movie.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-200 text-sm">{movie.duration} mins</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-200 text-sm">{movie.imdbRating}/10</span>
                </div>
              </motion.div>

              {/* Genres */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {movie.genre.map((g: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-purple-400/30"
                  >
                    {g}
                  </span>
                ))}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-gray-200 text-lg leading-relaxed max-w-3xl"
              >
                {movie.description}
              </motion.p>

              {/* Actions: Wishlist & Rating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
              >
                {/* Left Column: Wishlist and Tagline */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Wishlist Button */}
                  {isAuthenticated && (
                    <button
                      onClick={handleWishlistToggle}
                      className={`group relative flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 ${isInWishlist
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        } text-white`}
                    >
                      {isInWishlist ? <BookMarked className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                      {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                  )}
                  {/* Themed Text Div (Tagline) */}
                  <div className="flex-grow bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex items-center justify-center text-center">
                    <p className="text-gray-300 italic text-lg">"{movie.tagline || 'A cinematic experience.'}"</p>
                  </div>
                </div>

                {/* Right Column: Rating Card */}
                <div className="lg:col-span-1 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white">Rating</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-yellow-400">{movie.imdbRating}</div>
                    <div className="flex-1">
                      <div className="text-lg font-medium text-gray-200">IMDb Rating</div>
                      <div className="text-sm text-gray-400">out of 10</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Trailer Section */}
        {movie.trailerUrl && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-6 h-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Watch Trailer</h2>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <iframe
                src={`https://vidsrc.cc/v2/embed/movie/${movie.id}`}
                title="Movie Trailer"
                allowFullScreen
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Cast Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Cast</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movie.cast.slice(0, 12).map((actor, index: number) => (
              <motion.div
                key={actor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="group"
              >
                <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-purple-400/50  hover:bg-black/40 transition-all duration-300 text-center group-hover:scale-105">
                  <div className="relative mb-4">
                    <img
                      src={actor.profilePic || `https://ui-avatars.com/api/?name=${actor.name.replace(/\s/g, "+")}&background=2a0e42&color=fff`}
                      alt={actor.name}
                      className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-white/20 group-hover:border-purple-400/50 transition-colors duration-300"
                    />

                  </div>
                  <p className="text-white font-medium text-sm leading-tight">{actor.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MovieDetails;