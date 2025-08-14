import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { Link } from "react-router-dom";
import { Star, Play, Info } from "lucide-react";
import { useScrollToTop } from "../hooks/useScrollToTop";

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
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

  useScrollToTop()

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link to={`/movie/${movie.id}`}>
          <motion.div
            className="group relative rounded-2xl overflow-hidden backdrop-blur-sm bg-black/10 border border-white/10 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{
              scale: 1.05,
              y: -8,
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Poster Image Container */}
            <div className="relative overflow-hidden">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="h-80 w-full object-cover transition-all duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover Overlay with Play Button */}
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

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4">
              <h2 className="text-white font-bold text-sm sm:text-base truncate mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
                {movie.title}
              </h2>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-1 mb-2">
                {movie.genre.slice(0, 2).map((g, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-300"
                  >
                    {g}
                  </span>
                ))}
                {movie.genre.length > 2 && (
                  <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-400">
                    +{movie.genre.length - 2}
                  </span>
                )}
              </div>

              {/* Rating Stars */}
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

            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </motion.div>
        </Link>
      </HoverCardTrigger>

      {/* Enhanced Hover Card Content */}
      <HoverCardContent
        side="right"
        sideOffset={15}
        align="start"
        className="w-80 bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-0 overflow-hidden"
      >
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">
                    {(movie.rating / 2).toFixed(1)}
                  </span>
                </div>
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
              </div>
            </div>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Overview */}
          <div>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
              {movie.overview}
            </p>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Genres
            </h4>
            <div className="flex flex-wrap gap-1">
              {movie.genre.map((g, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/10 rounded-lg text-xs text-gray-300 backdrop-blur-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Cast */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Cast
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {movie.cast.slice(0, 3).join(", ")}
              {movie.cast.length > 3 && (
                <span className="text-gray-500"> and {movie.cast.length - 3} more</span>
              )}
            </p>
          </div>

          {/* Action Button */}
          <motion.div
            className="pt-2 border-t border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-xl py-2 px-4 border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer">
              <Play className="w-4 h-4 text-white" />
              <Link to={`/movie/${movie.id}`}>
                <span className="text-white text-sm font-medium">View Details</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default MovieCard;