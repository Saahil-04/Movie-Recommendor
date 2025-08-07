import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { Link } from "react-router-dom";


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
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link to={`/movie/${movie.id}`}>
          <motion.div
            className="relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200 hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
          >
            {/* Poster Image */}
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-96 w-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/60 to-transparent px-4 py-3 flex flex-col justify-end">
              <h2 className="text-sm sm:text-base font-semibold text-indigo-300 truncate">
                {movie.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {/* Stars */}
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
                      className="w-4 h-4"
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.869 1.402-8.174L.132 9.209l8.2-1.191z" />
                    </svg>
                  ))}
                </div>
                <span className="text-yellow-400 font-bold text-xs">
                  {(movie.rating / 2).toFixed(1)}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{movie.genre[0]}</p>
            </div>
          </motion.div>
        </Link>
      </HoverCardTrigger>


      {/* ✅ Hover Popup Content */}
      <HoverCardContent
        side="right"
        sideOffset={-10}
        align="start"
        className="w-80 bg-gray-900 text-white border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-bold text-indigo-400">{movie.title}</h3>
        <p className="text-sm text-gray-300 mt-2 line-clamp-4">
          {movie.overview}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          <span className="font-semibold text-gray-300">Genre:</span>{" "}
          {movie.genre.join(", ")}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          <span className="font-semibold text-gray-300">Cast:</span>{" "}
          {movie.cast.join(", ")}
        </p>
        <div className="flex items-center gap-1 mt-3">
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
                className="w-4 h-4"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.869 1.402-8.174L.132 9.209l8.2-1.191z" />
              </svg>
            ))}
          </div>
          <span className="text-yellow-400 font-bold text-xs">
            {(movie.rating / 2).toFixed(1)}
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default MovieCard;
