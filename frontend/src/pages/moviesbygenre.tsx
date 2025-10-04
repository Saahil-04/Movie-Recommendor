import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import { Skeleton } from "../components/ui/skeleton";
import MovieCard from "../components/moviecard";
import { Film, Loader2, ChevronDown } from "lucide-react";
import { useScrollToTop } from "../hooks/useScrollToTop";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  rating: number;
  overview: string;
  genre: string[];
  cast: string[];
}

interface LocationState {
  genreName?: string;
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

// Genre emoji mapping
const genreEmojis: { [key: string]: string } = {
  'Action': '⚡',
  'Adventure': '🗺️',
  'Animation': '🎨',
  'Comedy': '😄',
  'Crime': '🕵️',
  'Documentary': '📹',
  'Drama': '🎭',
  'Family': '👨‍👩‍👧‍👦',
  'Fantasy': '🔮',
  'History': '📜',
  'Horror': '👻',
  'Music': '🎵',
  'Mystery': '🔍',
  'Romance': '💕',
  'Science Fiction': '🚀',
  'TV Movie': '📺',
  'Thriller': '😰',
  'War': '⚔️',
  'Western': '🤠'
};

const MoviesByGenre = () => {
  const { genreId } = useParams();
  const { state } = useLocation() as { state: LocationState };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const genreName = state?.genreName || "Movies";

  const fetchMovies = async (page: number, isInitialLoad = false) => {
    try {
      if (isInitialLoad) setIsLoading(true);
      else setIsPageLoading(true);

      const response = await axios.get(
        // `${process.env.REACT_APP_API_URL}/api/movies/genre/${genreId}`,
        // { params: { page } }
        `http://localhost:8000/api/movies/genre/${genreId}`,
        { params: { page } }
      );

      const { movies: newMovies, hasNextPage: nextPage } = response.data;
      console.log("Fetched movies:", newMovies);


      setMovies((prevMovies) => {
        const movieIds = new Set(prevMovies.map((movie) => movie.id));
        const filteredMovies = newMovies.filter(
          (movie: { id: number }) => !movieIds.has(movie.id)
        );
        return [...prevMovies, ...filteredMovies];
      });

      setHasNextPage(nextPage);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      if (isInitialLoad) setIsLoading(false);
      else setIsPageLoading(false);
    }
  };

  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    setHasNextPage(true);
    fetchMovies(1, true);
  }, [genreId]);

  useScrollToTop()

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex flex-col space-y-3"
        >
          <Skeleton className="h-80 w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm" />
          <Skeleton className="h-4 w-3/4 rounded-full bg-gradient-to-r from-white/10 to-transparent mx-auto" />
          <Skeleton className="h-3 w-1/2 rounded-full bg-gradient-to-r from-white/8 to-transparent mx-auto" />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-4xl">
              {genreEmojis[genreName] || '🎬'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {genreName}
            </h1>
            <Film className="w-8 h-8 text-purple-400" />
          </div>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover amazing {genreName.toLowerCase()} movies handpicked just for you
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-6" />

          {!isLoading && movies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6"
            >
              <span className="text-gray-400 text-lg">
                Found {movies.length} movie{movies.length !== 1 ? 's' : ''}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Movies Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {movies.map((movie, i) => (
              <motion.div
                key={movie.id}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
              >
                <MovieCard
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    rating: movie.rating,
                    genre: movie.genre,
                    overview: movie.overview || "No description available.",
                    cast: movie.cast || ["Cast info unavailable"],
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loading More Skeletons */}
        {isPageLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={`loading-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex flex-col space-y-3"
              >
                <Skeleton className="h-80 w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm" />
                <Skeleton className="h-4 w-3/4 rounded-full bg-gradient-to-r from-white/10 to-transparent mx-auto" />
                <Skeleton className="h-3 w-1/2 rounded-full bg-gradient-to-r from-white/8 to-transparent mx-auto" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && !isPageLoading && movies.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={() => fetchMovies(currentPage + 1)}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Load More Movies
                <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
              </span>

              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.button>
          </motion.div>
        )}

        {/* Loading More Indicator */}
        {isPageLoading && (
          <motion.div
            className="flex justify-center items-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-gray-200">Loading more movies...</span>
            </div>
          </motion.div>
        )}

        {/* End of Results */}
        {!hasNextPage && movies.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-black/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 inline-block">
              <p className="text-gray-300 text-lg">
                🎬 You've seen all the {genreName.toLowerCase()} movies we have!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Check out other genres for more amazing discoveries
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && movies.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🎭</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Movies Found</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn't find any {genreName.toLowerCase()} movies at the moment.
              Try exploring other genres or check back later!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MoviesByGenre;