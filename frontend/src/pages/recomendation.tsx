import { useState, useRef, useEffect } from 'react';
import { Box, Button, Container, Grid, Skeleton } from '@mui/material';
import MovieFilters from '../components/moviefilters';
import MovieCard from '../components/moviecard';
import axios from 'axios';

interface Movie {
  title: string;
  poster_url: string;
  rating: number;
  genre: string[];
  overview: string;
  cast: string[];
}

const Recommendation = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isPageLoading, setIsPageLoading] = useState(false); // For lazy loading spinner
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page for lazy loading
  // const [hasNextPage, setHasNextPage] = useState(true); // Flag to check if more pages are available
  const [totalPages, setTotalPages] = useState(1); // Total pages available
  const [currentFilters, setCurrentFilters] = useState({})
  const cardsSectionRef = useRef<HTMLDivElement>(null); // Ref for the movie cards section
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleFilter = async (filters: any) => {
    setIsLoading(true); // Show loading effect for the first load
    setCurrentPage(1); // Reset to the first page
    // setHasNextPage(true); // Reset hasNextPage for new filter
    setCurrentFilters(filters);
    setTimeout(() => {
      if (cardsSectionRef.current) {
        cardsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    try {
      const response = await axios.post('http://localhost:8000/recommendations/', { filters:filters, page: 1, page_size:20});
      console.log(response.data);
      setFilteredMovies(response.data.movies);
      // setHasNextPage(response.data.hasNextPage);
      setTotalPages(response.data.pagination.total_pages); // Update total pages
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading effect after fetch
    }
  };

  const fetchMoreMovies = async () => {
    console.log("Request payload:", {
      filters: currentFilters,
      page:currentPage + 1,
      page_size: 20,
    });
    if (loadingMore || currentPage >= totalPages) return; // Prevent unnecessary requests
    setLoadingMore(true); // Show spinner for loading more movies

    console.log('Fetching page:', currentPage + 1);
    setTimeout(() => {
    if (observerRef.current) {
      observerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
    try {
      const nextPage = currentPage + 1;
      const response = await axios.post('http://localhost:8000/recommendations/', {
        filters:currentFilters,
        page:nextPage, // Increment the page number
        page_size: 20,
      });
      // console.log("current page",currentPage);
      console.log("load more response",response.data);
      if (response.data.pagination.current_page === nextPage) {
      setFilteredMovies((prevMovies) => [...prevMovies, ...response.data.movies]);
      setCurrentPage(nextPage);
    }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false); // Hide spinner after fetch
    }
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingMore && currentPage < totalPages) {
          if (timeoutId) clearTimeout(timeoutId); // Clear any previous timeout
          timeoutId = setTimeout(() => {
            fetchMoreMovies(); // Fetch more movies after debounce
          }, 200); // Adjust debounce time as needed
        }
      },
      {
        threshold: 1.0,
      }
    );
  
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
  
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loadingMore, currentPage, totalPages, currentFilters]);
  
  useEffect(()=>{
    console.log("current filters",currentFilters);
  },[currentFilters])

  return (
    <Container>
      <MovieFilters onFilter={handleFilter} />
      <div ref={cardsSectionRef} style={{ marginBottom: '50px' }}>
        <Grid container spacing={2}

        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={300} animation="wave" />
                <Skeleton variant="text" animation="wave" />
                <Skeleton variant="text" animation="wave" />
              </Grid>
            ))
            : filteredMovies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
        </Grid>
        {loadingMore && ( // Show spinner while loading more
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={300} animation="wave" />
                <Skeleton variant="text" animation="wave" />
                <Skeleton variant="text" animation="wave" />  
              </Grid>
            ))}
          </Grid>
        )}
      <div ref={observerRef} className="loading-trigger">
        {/* {currentPage < totalPages && ( // Show "Load More" button if more pages are available
          <Button
            variant="contained"
            color="primary"
            onClick={fetchMoreMovies}
            sx={{ mt: 2, display: 'block', mx: 'auto' }}
          >
            Load More
          </Button>
        )} */}
         {loadingMore && <p>Loading...</p>}
         </div>
      </div>
    </Container>
  );
};

export default Recommendation;
