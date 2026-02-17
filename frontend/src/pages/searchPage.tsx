import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Film, ChevronLeft, ChevronRight, EyeOff, Eye } from "lucide-react";
import MovieCard from "../components/moviecard";
import { useScrollToTop } from "../hooks/useScrollToTop";

interface Movie {
  id: number;
  title: string;
  poster_url: string | null;
  backdrop_url: string | null;
  rating: number;
  release_date: string;
  genre: string[];
  overview: string;
  cast: string[];
  popularity: number;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_results: number;
  has_next_page: boolean;
}

interface SearchResponse {
  movies: Movie[];
  pagination: Pagination;
  message?: string;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 0,
    total_results: 0,
    has_next_page: false,
  });

  // Optional controls — page defaults to 1, adult content defaults to false
  const page = parseInt(searchParams.get("page") || "1", 10);
  const includeAdult = searchParams.get("adult") === "true";

  useScrollToTop();

  const fetchSearchResults = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get<SearchResponse>(
        `${process.env.REACT_APP_API_URL}/api/movies/search`,
        {
          params: {
            query: query.trim(),
            page,
            include_adult: includeAdult,
          },
        }
      );

      // Backend returns { movies: [...], pagination: {...} }
      const data = response.data;
      setMovies(data.movies || []);
      setPagination(
        data.pagination || {
          current_page: page,
          total_pages: 0,
          total_results: 0,
          has_next_page: false,
        }
      );

      if ((data.movies || []).length === 0) {
        setError(data.message || "No movies found for your search.");
      }
    } catch (err: any) {
      console.error("Search failed:", err);
      setMovies([]);
      setError(
        err.response?.data?.detail || "Search failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [query, page, includeAdult]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const goToPage = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAdult = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("adult", includeAdult ? "false" : "true");
      next.set("page", "1"); // Reset to page 1 when toggling
      return next;
    });
  };

  // Generate page numbers to show (show 5 around current page)
  const getPageNumbers = () => {
    const total = pagination.total_pages;
    const current = pagination.current_page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "...")[] = [];
    if (current > 3) pages.push(1, "...");
    for (
      let i = Math.max(1, current - 2);
      i <= Math.min(total, current + 2);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...", total);
    return pages;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Search className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Search Results
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Showing results for{" "}
            <span className="text-purple-400 font-semibold">"{query}"</span>
          </p>

          {/* Controls row */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {/* Total results badge */}
            {pagination.total_results > 0 && (
              <span className="text-sm text-gray-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                {pagination.total_results.toLocaleString()} results found
              </span>
            )}

            {/* Adult content toggle */}
            <button
              onClick={toggleAdult}
              className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-full border transition-all duration-200 ${
                includeAdult
                  ? "bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200"
              }`}
            >
              {includeAdult ? (
                <>
                  <Eye className="w-4 h-4" />
                  Adult content: On
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Adult content: Off
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          </div>
        ) : movies.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${query}-${page}`}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                {movies.map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <MovieCard
                      movie={{
                        id: movie.id,
                        title: movie.title,
                        poster_url: movie.poster_url || "",
                        rating: movie.rating || 0,
                        genre: movie.genre || [],
                        overview: movie.overview || "No description available",
                        cast: movie.cast || [],
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-2 mt-12 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Prev button */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/30 hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-gray-500 select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className={`w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        p === page
                          ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-purple-600/20 hover:border-purple-500/30 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={!pagination.has_next_page}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/30 hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          // Empty / error state
          !isLoading && (
            <motion.div
              className="text-center py-20 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                No movies found
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                {error ||
                  `We couldn't find any matches for "${query}". Try checking your spelling or searching for something else.`}
              </p>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;