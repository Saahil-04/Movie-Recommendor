

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div
      className="relative min-h-[calc(100vh-50px)] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto text-center text-white px-4 pt-32 md:pt-40">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold drop-shadow-lg mb-4"
        >
          Discover Movies You’ll Love
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-lg md:text-xl opacity-90 leading-relaxed max-w-xl mx-auto mb-8"
        >
          Your next movie night is just a click away. Find films tailored to
          your mood, genre preferences, or explore top recommendations!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6"
        >
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-6 py-3 rounded-lg shadow-md"
          >
            <Link to="/recommendation">Get Recommendations</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-white text-white text-lg px-6 py-3 rounded-lg hover:bg-white/20"
          >
            <Link to="/genres">Explore Genres</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}