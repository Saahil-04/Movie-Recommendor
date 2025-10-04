"use client"

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { cn } from "../libs/utils"
import { Film, LogIn, LogOut, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../AuthContext"

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAtTop, setIsAtTop] = useState(true)

  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Check if we're at the top of the page
      setIsAtTop(currentScrollY < 10)
      
      // Show floating navbar only when scrolling up and not at top
      if (currentScrollY < lastScrollY && currentScrollY > 100) {
        // Scrolling up and past threshold - show floating navbar
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY || currentScrollY < 100) {
        // Scrolling down or at top - hide floating navbar
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      {/* Static navbar at top */}
      <header className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-2xl z-40 border-b border-white/5">
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

          {/* Auth and Nav Buttons */}
          <div className="flex items-center gap-4">
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
              </Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" className="p-2 rounded-full hover:bg-white/10">
                  <Link to="/profile" title="Profile">
                    <User className="w-5 h-5 text-white" />
                  </Link>
                </Button>
                <Button variant="ghost" onClick={logout} className="p-2 rounded-full hover:bg-white/10" title="Logout">
                  <LogOut className="w-5 h-5 text-white" />
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" className="p-2 rounded-full hover:bg-white/10">
                <Link to="/login" title="Login">
                  <LogIn className="w-5 h-5 text-white" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Floating navbar */}
      <div 
        className={cn(
          "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out",
          isVisible 
            ? "translate-y-0 opacity-100 scale-100" 
            : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 px-6 py-3">
          <div className="flex items-center justify-between gap-8">
            {/* Logo / Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-lg hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative">
                <Film className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <div className="absolute inset-0 bg-purple-400/20 blur-md rounded-full group-hover:bg-purple-300/30 transition-all duration-300"></div>
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
                "relative text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30",
                "text-sm rounded-xl px-5 py-2 font-medium transition-all duration-300",
                "border border-white/20 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/30",
                "backdrop-blur-sm hover:scale-105"
              )}
            >
              <Link to="/recommendation" className="relative z-10">
                Recommend Me!
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}