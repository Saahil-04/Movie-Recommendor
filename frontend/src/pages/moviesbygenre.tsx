import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import { Skeleton } from "../components/ui/skeleton";
import MovieCard from "../components/moviecard"; // ✅ Import the MovieCard

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
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.05, ease: "easeOut" },
  }),
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
        `http://localhost:8000/api/movies/genre/${genreId}`,
        { params: { page } }
      );

      const { movies: newMovies, hasNextPage: nextPage } = response.data;

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
    fetchMovies(1, true);
  }, [genreId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-100 mb-6 tracking-wide">
        {genreName}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-80 w-full rounded-lg bg-gradient-to-br from-gray-800 to-transparent" />
              <Skeleton className="h-5 w-3/4 rounded bg-gradient-to-r from-gray-700 to-transparent mx-auto" />
              <Skeleton className="h-4 w-1/2 rounded bg-gradient-to-r from-gray-700 to-transparent mx-auto" />
            </div>
          ))
          : movies.map((movie, i) => (
            <motion.div
              key={movie.id}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <MovieCard
                movie={{
                  id:movie.id,
                  title: movie.title,
                  poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  rating: movie.rating,
                  genre: movie.genre || ["Unknown"],
                  overview: movie.overview || "No description available.",
                  cast: movie.cast || ["Cast info unavailable"],
                }}
              />
            </motion.div>
          ))}
      </div>

      {isPageLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-80 w-full rounded-lg bg-gradient-to-br from-gray-800 to-transparent" />
              <Skeleton className="h-5 w-3/4 rounded bg-gradient-to-r from-gray-700 to-transparent mx-auto" />
              <Skeleton className="h-4 w-1/2 rounded bg-gradient-to-r from-gray-700 to-transparent mx-auto" />
            </div>
          ))}
        </div>
      )}

      {hasNextPage && !isPageLoading && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchMovies(currentPage + 1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors duration-300"
          >
            Load More
          </button>
        </div>
      )}

      {!hasNextPage && (
        <p className="text-center text-gray-400 mt-4">
          No more movies to load.
        </p>
      )}
    </div>
  );
};

export default MoviesByGenre;
