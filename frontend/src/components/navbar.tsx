"use client"

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { cn } from "../libs/utils"
import { Film } from "lucide-react"

export default function Navbar() {
  return (
    <header className="w-full bg-black text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12 px-4">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="flex items-center gap-1 text-white font-bold text-lg hover:opacity-90 transition-opacity"
        >
          <Film className="w-5 h-5" />
          FlicPick
        </Link>

        {/* Nav Button */}
        <Button
          asChild
          variant="ghost"
          className={cn(
            "text-white hover:bg-white/10 text-sm rounded-md px-3 py-1"
          )}
        >
          <Link to="/recommendation">Recommend Me!</Link>
        </Button>
      </div>
    </header>
  )
}
