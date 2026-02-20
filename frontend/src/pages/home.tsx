import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { useScrollToTop } from "../hooks/useScrollToTop";
import React, { useState } from "react";
import { Search, Sparkles, ChevronRight, Film, Zap, Star } from "lucide-react";
import Footer from "../components/footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useScrollToTop();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ── Animated Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        {/* Cinematic film-grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />

        {/* Background image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1476&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay" />

        {/* Radial spotlight from top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(147,51,234,0.25),transparent)]" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 30, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/8 rounded-full blur-2xl"
          animate={{ x: [-100, 100, -100], y: [50, -50, 50] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        {/* Extra deep orb */}
        <motion.div
          className="absolute top-3/4 left-1/3 w-96 h-96 bg-indigo-700/8 rounded-full blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, -80, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Hero ── */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-8">
        <div className="max-w-5xl mx-auto text-center text-white">

          {/* Badge pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-purple-500/30 rounded-full px-5 py-2 mb-10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium tracking-wide">AI-Powered Movie Discovery</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight mb-6 tracking-tight">
              Discover Movies
              <br />
              <span className="text-5xl md:text-7xl font-extralight italic text-purple-100/80">
                You'll Love
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            Your cinematic journey begins here. Discover films that resonate with your soul,
            curated by intelligent algorithms and passionate movie lovers.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-14 relative z-20"
          >
            <div className="relative group">
              {/* Glow halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative flex items-center bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-2xl p-2 group-hover:bg-white/10 group-hover:border-purple-500/40 transition-all duration-300 shadow-2xl">
                <Search className="w-5 h-5 text-purple-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for movies, directors, genres..."
                  className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 focus:outline-none px-4 py-2.5 text-base"
                />
                {/* Search button — bold & chunky */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden flex-shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-6 py-2.5 text-sm tracking-wide shadow-lg shadow-purple-900/50 transition-all duration-300"
                >
                  <span className="relative z-10">Search</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-5 mb-20"
          >
            {/* Primary CTA — large, glowing, animated shimmer */}
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/recommendation"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white text-base font-bold px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] transition-all duration-300 border border-purple-500/30"
              >
                {/* Animated shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Sparkles className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10 tracking-wide">Get Recommendations</span>
                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Secondary CTA — frosted glass, chunky border */}
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/genres"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-white/8 backdrop-blur-xl border-2 border-white/20 hover:border-purple-400/60 text-white text-base font-bold px-10 py-5 rounded-2xl hover:bg-white/12 transition-all duration-300 shadow-xl"
              >
                <Film className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform duration-300" />
                <span className="tracking-wide">Explore Genres</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex justify-center gap-10 text-center"
          >
            {[
              { value: "10K+", label: "Movies" },
              { value: "50+", label: "Genres" },
              { value: "AI", label: "Powered" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 flex justify-center pb-10 -mt-6"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2.5 bg-gradient-to-b from-purple-400 to-transparent rounded-full" />
        </motion.div>
      </motion.div>

      {/* ── Features Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10 py-28 px-6"
      >
        {/* Diagonal light sweep */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(147,51,234,0.06),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-purple-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4"
            >
              Why FlicPick?
            </motion.p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">
              Built for True{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Cinephiles
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Picks",
                description: "Advanced algorithms analyze your taste to surface films you'll genuinely love — not just popular ones.",
                icon: <Zap className="w-7 h-7" />,
                accent: "from-purple-600 to-violet-600",
                glow: "rgba(147,51,234,0.3)",
              },
              {
                title: "Curated Collections",
                description: "Hand-picked genres and themes, from hidden indie gems to award-winning blockbuster hits.",
                icon: <Film className="w-7 h-7" />,
                accent: "from-blue-600 to-cyan-600",
                glow: "rgba(37,99,235,0.3)",
              },
              {
                title: "Always Evolving",
                description: "Your taste grows, and so do our recommendations — always fresh, always relevant, never stale.",
                icon: <Star className="w-7 h-7" />,
                accent: "from-pink-600 to-purple-600",
                glow: "rgba(219,39,119,0.3)",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-white/[0.04] backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-400 overflow-hidden cursor-default"
                style={{
                  boxShadow: `0 0 0 0 ${feature.glow}`,
                }}
              >
                {/* Card glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${feature.glow}, transparent 70%)`,
                  }}
                />

                {/* Icon pill */}
                <div className={`relative z-10 inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${feature.accent} mb-6 shadow-lg`}>
                  <span className="text-white">{feature.icon}</span>
                </div>

                <h3 className="relative z-10 text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="relative z-10 text-gray-400 leading-relaxed text-sm">{feature.description}</p>

                {/* Corner accent */}
                <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${feature.accent} opacity-5 rounded-tl-full`} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Testimonials ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-28 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-purple-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4"
          >
            Community
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-20 tracking-tight">
            Loved by Movie{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Enthusiasts
            </span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                quote: "FlicPick introduced me to indie masterpieces I never knew existed. It's like having a personal movie curator!",
                author: "Alex R.",
                role: "Film Enthusiast",
                stars: 5,
              },
              {
                quote: "Perfect for planning movie nights. The recommendations are spot-on and never disappoint my friends.",
                author: "Priya D.",
                role: "Movie Night Host",
                stars: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group bg-gradient-to-br from-white/8 to-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all duration-400 text-left overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-purple-400 text-purple-400" />
                  ))}
                </div>

                <p className="text-base text-gray-300 italic leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>

                {/* Corner glow */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Final CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 overflow-hidden border-t border-white/10 text-center py-28 px-6"
      >
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(147,51,234,0.12),transparent)]" />
        {/* Top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-5 py-2 mb-10"
          >
            <Film className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Join thousands of movie lovers</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Ready for Your Next
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Cinematic Adventure?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-14 max-w-2xl mx-auto font-light">
            Discover your next favorite film in seconds — powered by taste, not just trends.
          </p>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/recommendation"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-white text-gray-900 text-lg font-black px-12 py-5 rounded-2xl shadow-[0_0_60px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.25)] transition-all duration-300 tracking-tight"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Sparkles className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300 text-purple-600" />
              <span className="relative z-10">Start Your Journey</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}