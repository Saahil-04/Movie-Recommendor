import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import MovieFilters from "../components/moviefilters";
import MovieCard from "../components/moviecard";
import { Skeleton } from "../components/ui/skeleton";

interface Movie {
  title: string;
  poster_url: string;
  rating: number;
  genre: string[];
  overview: string;
  cast: string[];
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

const Recommendation = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleFilter = async (filters: any) => {
    setIsLoading(true);
    setCurrentPage(1);
    setCurrentFilters(filters);

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
        "http://localhost:8000/recommendations/",
        { filters, page: 1, page_size: 20 }
      );
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
        "http://localhost:8000/recommendations/",
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ✅ Filters Section */}
      <MovieFilters onFilter={handleFilter} />

      <div ref={cardsSectionRef} className="mt-8">
        {/* ✅ Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-80 w-full rounded-lg bg-gray-800" />
                <Skeleton className="h-5 w-3/4 rounded bg-gray-700 mx-auto" />
                <Skeleton className="h-4 w-1/2 rounded bg-gray-700 mx-auto" />
              </div>  
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredMovies.map((movie, i) => (
              <motion.div
                key={i}
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
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        )}

        {/* ✅ Loading More Skeletons */}
        {loadingMore && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-80 w-full rounded-lg bg-gray-800" />
                <Skeleton className="h-5 w-3/4 rounded bg-gray-700 mx-auto" />
                <Skeleton className="h-4 w-1/2 rounded bg-gray-700 mx-auto" />
              </div>
            ))}
          </div>
        )}

        <div ref={observerRef} className="h-10"></div>
      </div>
    </div>
  );
};

export default Recommendation;
