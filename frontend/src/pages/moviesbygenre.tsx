import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import { Skeleton } from "../components/ui/skeleton";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  rating: number;
}

interface LocationState {
  genreName?: string;
}

const fadeInVariants:Variants = {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-800 h-80 rounded-lg"
              />
            ))
          : movies.map((movie, i) => (
              <motion.div
                key={movie.id}
                className="bg-gray-900 rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer
                           hover:shadow-2xl transition-all duration-100"
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 200 },
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="h-80 w-full object-cover"
                />
                <div className="p-4 flex flex-col flex-grow justify-between text-center">
                  <h2 className="text-lg font-semibold text-indigo-400 mb-2">
                    {movie.title}
                  </h2>
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={
                            i < Math.round(movie.rating / 2)
                              ? "#fbbf24"
                              : "#4b5563"
                          }
                          className="w-5 h-5"
                        >
                          <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.869 1.402-8.174L.132 9.209l8.2-1.191z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-yellow-400 font-bold">
                      {(movie.rating / 2).toFixed(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

       {isPageLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-80 w-full rounded-lg bg-gray-800" />
              <Skeleton className="h-5 w-3/4 rounded bg-gray-700 mx-auto" />
              <Skeleton className="h-4 w-1/2 rounded bg-gray-700 mx-auto" />
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
