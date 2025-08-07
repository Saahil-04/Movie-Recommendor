"use client"

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { cn } from "../libs/utils"
import { Film } from "lucide-react"

export default function Navbar() {
  return (
    <header className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-2xl z-50 border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white font-bold text-xl hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative">
            <Film className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
            <div className="absolute inset-0 bg-purple-400/20 blur-lg rounded-full group-hover:bg-purple-300/30 transition-all duration-300"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            FlicPick
          </span>
        </Link>

        {/* Nav Button */}
        <Button
          asChild
          variant="ghost"
          className={cn(
            "relative text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20",
            "text-sm rounded-full px-6 py-2 font-medium transition-all duration-300",
            "border border-white/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25",
            "backdrop-blur-sm hover:scale-105"
          )}
        >
          <Link to="/recommendation" className="relative z-10">
            Recommend Me!
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>
        </Button>
      </div>
    </header>
  )
}