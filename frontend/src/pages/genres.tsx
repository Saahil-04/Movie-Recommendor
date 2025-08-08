import { useEffect, useState } from 'react';
import {Card, CardContent} from "../components/ui/card"
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
import { Film, Sparkles } from "lucide-react";

type Genre = {
  id: number
  name: string
}

// Genre emoji mapping for visual appeal
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

export default function Genres() {
  const [genres, setGenres] = useState<Genre[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/genres")
        const data = await response.json()
        setGenres(data)
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }
    fetchGenres()
  }, [])

  const handleGenreClick = (genreId: number, genreName: string) => {
    navigate(`/genres/${genreId}`, { state: { genreName } })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1.2, 1, 1.2],
          }}
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

        {/* Grid of Genres */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {genres.map((genre, index) => (
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
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardContent className="relative z-10 flex flex-col justify-center items-center h-full p-4">
                  {/* Genre Emoji */}
                  <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {genreEmojis[genre.name] || '🎬'}
                  </div>
                  
                  {/* Genre Name */}
                  <p className="text-sm md:text-base font-semibold text-white text-center leading-tight group-hover:text-purple-200 transition-colors duration-300">
                    {genre.name}
                  </p>
                  
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </CardContent>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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