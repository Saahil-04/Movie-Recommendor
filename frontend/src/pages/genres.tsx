import { useEffect, useState } from 'react';
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
import { Film, Sparkles } from "lucide-react";
import { useScrollToTop } from '../hooks/useScrollToTop';

type Genre = {
  id: number
  name: string
}

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

// Skeleton for a single genre card
const GenreCardSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.4 }}
  >
    <div className="relative overflow-hidden rounded-2xl h-28 md:h-32 bg-black/20 backdrop-blur-md border border-white/10">
      <Skeleton className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
      <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
        {/* Emoji placeholder */}
        <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-white/10 to-transparent" />
        {/* Name placeholder */}
        <Skeleton className="h-4 w-3/4 rounded-full bg-gradient-to-r from-white/10 to-transparent mx-auto" />
      </div>
    </div>
  </motion.div>
);

export default function Genres() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/genres`)
        const data = await response.json()
        setGenres(data)
      } catch (error) {
        console.error("Error fetching genres:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGenres()
  }, [])

  const handleGenreClick = (genreId: number, genreName: string) => {
    navigate(`/genres/${genreId}`, { state: { genreName } })
  }

  useScrollToTop()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 30, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-16 px-4">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Film className="w-8 h-8 text-purple-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Explore Genres
            </h1>
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover your next favorite movie by exploring different genres.
            From heart-pounding action to romantic comedies.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isLoading
            ? // Loading skeletons — render 15 placeholder cards
              Array.from({ length: 15 }).map((_, index) => (
                <GenreCardSkeleton key={index} index={index} />
              ))
            : genres.map((genre, index) => (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => handleGenreClick(genre.id, genre.name)}
                    className="group cursor-pointer relative overflow-hidden bg-black/20 backdrop-blur-md border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-2xl h-28 md:h-32"
                  >
                    {/* Hover gradient overlay — covers full card via absolute inset-0 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* 
                      SHIMMER FIX: moved outside CardContent so it's a direct child of 
                      the Card and uses absolute positioning with inset-0, not constrained 
                      by CardContent's padding 
                    */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    </div>

                    {/* Bottom glow line — also full-width via absolute */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-400/60 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="relative z-10 flex flex-col justify-center items-center h-full p-4">
                      <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {genreEmojis[genre.name] || '🎬'}
                      </div>
                      <p className="text-sm md:text-base font-semibold text-white text-center leading-tight group-hover:text-purple-200 transition-colors duration-300">
                        {genre.name}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-400 text-lg">
            Can't decide? Try our{' '}
            <span
              className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium transition-colors"
              onClick={() => navigate('/recommendation')}
            >
              AI-powered recommendations
            </span>
            {' '}instead.
          </p>
        </motion.div>
      </div>
    </div>
  )
}