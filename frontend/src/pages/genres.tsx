import { useEffect, useState } from 'react';
import {Card, CardContent} from "../components/ui/card"
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"

type Genre = {
  id: number
  name: string
}

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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Explore Genres
        </h1>

        {/* Grid of Genres */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card
                onClick={() => handleGenreClick(genre.id, genre.name)}
                className="cursor-pointer bg-gray-800/60 border border-gray-700 hover:bg-gray-700/80 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 rounded-xl"
              >
                <CardContent className="flex justify-center items-center h-24">
                  <p className="text-lg font-semibold text-white tracking-wide">
                    {genre.name}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}