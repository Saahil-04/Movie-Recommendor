import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function Home() {

  useScrollToTop()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/8 rounded-full blur-2xl"
          animate={{
            x: [-100, 100, -100],
            y: [50, -50, 50],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight mb-6">
              Discover Movies
              <br />
              <span className="text-5xl md:text-7xl font-light">You'll Love</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            Your cinematic journey begins here. Discover films that resonate with your soul,
            curated by intelligent algorithms and passionate movie lovers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
          >
            <Button
              asChild
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
            >
              <Link to="/recommendation">
                <span className="relative z-10 flex items-center gap-2">
                  Get Recommendations
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group bg-white/10 backdrop-blur-md border-white/30 text-white text-lg px-8 py-4 rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <Link to="/genres">
                <span className="group-hover:scale-105 transition-transform">Explore Genres</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10 py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose FlicPick?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Recommendations",
                description: "Advanced algorithms analyze your preferences to suggest movies you'll genuinely love",
                icon: "🎯"
              },
              {
                title: "Curated Collections",
                description: "Hand-picked genres and themes, from hidden gems to blockbuster hits",
                icon: "🎬"
              },
              {
                title: "Personalized Experience",
                description: "Your taste evolves, and so do our recommendations - always fresh and relevant",
                icon: "✨"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group bg-white/5 backdrop-blur-md rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-24 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            Loved by Movie Enthusiasts
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                quote: "FlicPick introduced me to indie masterpieces I never knew existed. It's like having a personal movie curator!",
                author: "Alex R.",
                role: "Film Enthusiast"
              },
              {
                quote: "Perfect for planning movie nights. The recommendations are spot-on and never disappoint my friends.",
                author: "Priya D.",
                role: "Movie Night Host"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="text-6xl text-purple-400 mb-4">"</div>
                <p className="text-lg text-gray-200 italic leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center justify-center">
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-t border-white/10 text-center py-20 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Your Next
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Cinematic Adventure?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of movie lovers who've already discovered their next favorite film.
          </p>
          <Button
            asChild
            className="group bg-gradient-to-r from-white to-gray-100 text-gray-900 text-xl px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-300 font-semibold"
          >
            <Link to="/recommendation">
              <span className="group-hover:scale-105 transition-transform">
                Start Your Journey
              </span>
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}