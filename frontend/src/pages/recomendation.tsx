import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import MovieFilters from "../components/moviefilters";
import MovieCard from "../components/moviecard";
import { Skeleton } from "../components/ui/skeleton";
import { Sparkles, Loader2, Filter } from "lucide-react";


interface Movie {
  id: number;
  title: string;
  poster_url: string;
  rating: number;
  genre: string[];
  overview: string;
  cast: string[];
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const Recommendation = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleFilter = async (filters: any) => {
    setIsLoading(true);
    setCurrentPage(1);
    setCurrentFilters(filters);
    setHasSearched(true);

    setTimeout(() => {
      if (cardsSectionRef.current) {
        cardsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    try {
      const response = await axios.post(
        // `${process.env.REACT_APP_API_URL}/recommendations/`,
         `http://localhost:8000/recommendations/`,
        { filters, page: 1, page_size: 20 }
      );
      console.log("This is the response: ",response.data)
      setFilteredMovies(response.data.movies);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreMovies = async () => {
    if (loadingMore || currentPage >= totalPages) return;
    setLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const response = await axios.post(
        // `${process.env.REACT_APP_API_URL}/recommendations/`,
        `http://localhost:8000/recommendations/`,
        {
          filters: currentFilters,
          page: nextPage,
          page_size: 20,
        }
      );

      if (response.data.pagination.current_page === nextPage) {
        
        setFilteredMovies((prev) => [...prev, ...response.data.movies]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingMore && currentPage < totalPages) {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchMoreMovies();
          }, 200);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loadingMore, currentPage, totalPages, currentFilters]);



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
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Movie Recommendations
            </h1>
            <Filter className="w-8 h-8 text-blue-400" />
          </div>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover your next favorite movie with our AI-powered recommendations
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Filters Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MovieFilters onFilter={handleFilter} />
        </motion.div>

        <div ref={cardsSectionRef}>
          {/* Results Count */}
          {hasSearched && !isLoading && filteredMovies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <span className="text-gray-400 text-lg">
                Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} for you
              </span>
            </motion.div>
          )}

          {/* Movies Grid */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : hasSearched ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filteredMovies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  variants={fadeInVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={i}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Welcome State */
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-6xl mb-6">🎭</div>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Discover?</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Use the filters above to find movies tailored to your taste.
                Our AI will recommend the perfect films for you!
              </p>
              <div className="flex items-center justify-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm">Set your preferences and let the magic begin</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </motion.div>
          )}

          {/* Loading More Skeletons */}
          {loadingMore && (
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

          {/* Loading More Indicator */}
          {loadingMore && (
            <motion.div
              className="flex justify-center items-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                <span className="text-gray-200">Loading more recommendations...</span>
              </div>
            </motion.div>
          )}

          {/* End of Results */}
          {hasSearched && !loadingMore && currentPage >= totalPages && filteredMovies.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 inline-block">
                <p className="text-gray-300 text-lg">
                  ✨ That's all the recommendations we have for now!
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters for more discoveries
                </p>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {hasSearched && !isLoading && filteredMovies.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-4">No Matches Found</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                We couldn't find any movies matching your criteria.
                Try adjusting your filters for better results!
              </p>
              <motion.div
                className="text-purple-400 flex items-center justify-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Expand your preferences to discover hidden gems</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.div>
          )}

          <div ref={observerRef} className="h-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;