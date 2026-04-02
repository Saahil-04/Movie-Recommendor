import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { Link } from "react-router-dom";
import { Star, Play, Info, Sparkles, Loader2, X } from "lucide-react";
import axios from "axios";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_url: string;
    rating: number;
    genre: string[];
    overview: string;
    cast: string[];
  };
  mood?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, mood }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // Separate state for mobile overlay vs desktop hovercard
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);

  const fetchExplanation = async () => {
    if (explanation) return; // Already fetched, don't re-fetch

    setLoadingExplanation(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/movies/explain`,
        {
          mood: mood || "neutral",
          movie_id: movie.id,
          movie_title: movie.title,
          movie_overview: movie.overview,
          genres: movie.genre,
        }
      );
      setExplanation(response.data.explanation);
    } catch (error) {
      setExplanation("Couldn't generate an explanation right now.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleMobileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMobileOverlay(true);
    fetchExplanation();
  };

  const handleDesktopWhyThis = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fetchExplanation();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the "Why this?" button
    if ((e.target as HTMLElement).closest('[data-why-button]')) {
      return;
    }
    // Navigate to movie details
    window.location.pathname = `/movie/${movie.id}`;
  };

  return (
    <>
      {/* Desktop: with HoverCard */}
      <div className="hidden md:block">
        <HoverCard openDelay={150} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Link to={`/movie/${movie.id}`}>
              <motion.div
                className="group relative rounded-2xl overflow-hidden backdrop-blur-sm bg-black/10 border border-white/10 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Poster */}
                <div className="relative overflow-hidden">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="h-80 w-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Desktop hover overlay with play button */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play className="w-8 h-8 text-white fill-white" />
                    </motion.div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-medium">
                        {(movie.rating / 2).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                  <h2 className="text-white font-bold text-sm sm:text-base truncate mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
                    {movie.title}
                  </h2>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genre.slice(0, 2).map((g, index) => (
                      <span key={index} className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-300">
                        {g}
                      </span>
                    ))}
                    {movie.genre.length > 2 && (
                      <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-400">
                        +{movie.genre.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(movie.rating / 2)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600 fill-gray-600"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-yellow-400 font-medium text-xs">
                      {(movie.rating / 2).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </motion.div>
            </Link>
          </HoverCardTrigger>

          {/* Desktop HoverCard — fixed width, no overflow */}
          <HoverCardContent
            side="right"
            sideOffset={15}
            align="start"
            className="w-72 max-w-[calc(100vw-2rem)] bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-0 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-white/10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent truncate">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                    <span className="text-yellow-400 font-bold text-sm">
                      {(movie.rating / 2).toFixed(1)}
                    </span>
                  </div>
                </div>
                <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                {movie.overview}
              </p>

              <div>
                <h4 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0"></span>
                  Genres
                </h4>
                <div className="flex flex-wrap gap-1">
                  {movie.genre.map((g, index) => (
                    <span key={index} className="px-2 py-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/10 rounded-lg text-xs text-gray-300">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                  Cast
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {movie.cast.slice(0, 3).join(", ")}
                  {movie.cast.length > 3 && (
                    <span className="text-gray-500"> +{movie.cast.length - 3} more</span>
                  )}
                </p>
              </div>

              {/* Why This — desktop only, inside HoverCard */}
              {mood && (
                <div className="pt-2 border-t border-white/10">
                  {!explanation && !loadingExplanation && (
                    <motion.button
                      onClick={handleDesktopWhyThis}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/30 rounded-xl text-xs text-purple-300 transition-all duration-200"
                    >
                      <Sparkles className="w-3 h-3" />
                      Why this matches your mood?
                    </motion.button>
                  )}

                  {loadingExplanation && (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                      <span className="text-xs text-gray-400">Thinking...</span>
                    </div>
                  )}

                  {explanation && !loadingExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-3 bg-purple-950/50 rounded-xl border border-purple-500/20"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="text-xs font-semibold text-purple-300">
                          Why this matches your mood
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed italic">
                        {explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  to={`/movie/${movie.id}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-xl py-2 px-4 border border-white/20 backdrop-blur-sm transition-all duration-200"
                >
                  <Play className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">View Details</span>
                </Link>
              </motion.div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Mobile: without HoverCard */}
      <div className="md:hidden relative cursor-pointer" onClick={handleCardClick}>
        <motion.div
          className="group relative rounded-2xl overflow-hidden backdrop-blur-sm bg-black/10 border border-white/10 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Poster */}
          <div className="relative overflow-hidden">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-80 w-full object-cover transition-all duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-medium">
                  {(movie.rating / 2).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4">
            <h2 className="text-white font-bold text-sm sm:text-base truncate mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
              {movie.title}
            </h2>
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.genre.slice(0, 2).map((g, index) => (
                <span key={index} className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-300">
                  {g}
                </span>
              ))}
              {movie.genre.length > 2 && (
                <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-400">
                  +{movie.genre.length - 2}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.round(movie.rating / 2)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600 fill-gray-600"
                      }`}
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-medium text-xs">
                {(movie.rating / 2).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </motion.div>

        {/* Mobile — Why This? button */}
        {mood && (
          <button
            data-why-button
            onClick={handleMobileClick}
            type="button"
            className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 bg-purple-600/80 backdrop-blur-md border border-purple-400/50 rounded-full text-xs text-white shadow-lg hover:bg-purple-600 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Why this?
          </button>
        )}
      </div>

      {/* Mobile AI explanation overlay — rendered outside the card so no layout shift */}
      <AnimatePresence>
        {showMobileOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8 md:hidden"
            onClick={() => setShowMobileOverlay(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowMobileOverlay(false)}
                className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              {/* Movie title */}
              <h3 className="text-base font-bold text-white pr-8 mb-3 truncate">
                {movie.title}
              </h3>

              <div className="flex items-center gap-1 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">
                  Why this matches your mood
                </span>
              </div>

              {loadingExplanation ? (
                <div className="flex items-center gap-3 py-4 justify-center">
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  {explanation}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-white/10">
                <Link
                  to={`/movie/${movie.id}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/40 to-blue-600/40 rounded-xl py-2.5 px-4 border border-white/20 text-white text-sm font-medium"
                >
                  <Play className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MovieCard;