import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-red-500 text-center mt-10">
        Movie not found.
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${movie.posterUrl})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Title & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-sm text-gray-300">
            {movie.releaseDate} &bull; {movie.genre.join(', ')} &bull; {movie.duration} mins
          </p>
          <p className="text-gray-200 max-w-3xl">{movie.description}</p>
        </motion.div>

        {/* Trailer */}
        {movie.trailerUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-video w-full rounded-lg overflow-hidden border border-purple-700"
          >
            <iframe
              src={movie.trailerUrl}
              title="Trailer"
              allowFullScreen
              className="w-full h-full"
            />
          </motion.div>
        )}

        {/* Ratings */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-1">Ratings</h2>
          <p className="text-gray-300">IMDb: {movie.imdbRating}/10</p>
        </div>

        {/* Cast */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {movie.cast.map((actor: any) => (
              <div
                key={actor.name}
                className="bg-white/5 p-3 rounded-xl backdrop-blur-md text-center hover:bg-white/10 transition"
              >
                <img
                  src={actor.profilePic}
                  alt={actor.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover mb-2"
                />
                <p className="text-sm text-gray-100">{actor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
