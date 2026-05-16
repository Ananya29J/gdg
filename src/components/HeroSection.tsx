"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Play, ChevronDown, Users, Trophy, Brain } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const STATS = [
  { label: "Live Fans", value: "2.4M", icon: Users, color: "text-electric-blue" },
  { label: "Predictions Made", value: "18.7M", icon: Zap, color: "text-neon-purple" },
  { label: "XP Awarded", value: "∞", icon: Trophy, color: "text-cyber-orange" },
];

const FLOATING_PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
  color: ["#00D4FF", "#A855F7", "#FF2D55", "#39FF14", "#FF6B00"][Math.floor(Math.random() * 5)],
}));

export default function HeroSection() {
  const { setActiveTab, match, setAiOpen } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToLive = () => {
    setActiveTab("pulse");
    setTimeout(() => {
      const el = document.getElementById("live-pulse");
      if (el) {
        const yOffset = -100;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-24"
      id="hero"
    >
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000510] via-[#050714] to-[#0A0E1A]" />

      {/* Radial glow orbs */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, #00D4FF, transparent)" }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-[120px]"
          style={{ background: "radial-gradient(circle, #A855F7, transparent)" }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full opacity-10 blur-[80px]"
          style={{ background: "radial-gradient(circle, #FF2D55, transparent)" }} />
      </motion.div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl mx-auto mt-8 md:mt-0"
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 border border-red-500/30"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#FF2D55]" />
          <span className="text-sm font-semibold text-red-400 tracking-widest uppercase">
            LIVE · 15 MAY 2026 · {match.team1} vs {match.team2}
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black leading-none tracking-tighter mb-2">
            <span className="text-gradient-neon animate-neon-flicker">PULSE</span>
            <span className="text-white">X</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl sm:text-2xl text-white/60 max-w-2xl font-light leading-relaxed mb-3"
        >
          The future of IPL fan engagement.
          <span className="text-gradient-blue-purple font-semibold"> Predict. Compete. Feel every ball.</span>
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-sm text-white/30 tracking-[0.3em] uppercase mb-12"
        >
          Real-time · AI-Powered · Cinematic
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <motion.button
            onClick={scrollToLive}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,212,255,0.6)" }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg relative overflow-hidden cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #00D4FF, #A855F7)",
            }}
          >
            <div className="absolute inset-0 shimmer" />
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
            <span className="relative">Enter Live Match</span>
          </motion.button>

          <motion.button
            onClick={() => setAiOpen(true)}
            whileHover={{ scale: 1.05, borderColor: "rgba(168,85,247,0.8)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg glass border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <Brain className="w-5 h-5 text-neon-purple" />
            <span>AI Companion</span>
          </motion.button>
        </motion.div>

        {/* Live stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex items-center gap-3 glass px-5 py-3 rounded-xl border border-white/5"
            >
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <div>
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </motion.div>

      {/* Live scoreboard floating card */}
      <motion.div
        className="absolute right-12 top-1/2 -translate-y-1/2 glass-card p-6 rounded-3xl hidden xl:block border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-white/50 tracking-widest">LIVE SCORE</span>
        </div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="font-bold text-white mb-1">{match.team1}</div>
            <div className="text-xs text-white/50">Ov {match.currentOver}.{match.currentBall}</div>
          </div>
          <div className="text-3xl font-black text-neon-blue">{match.team1Score}/{match.team1Wickets}</div>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-neon-blue rounded-full" 
            animate={{ width: `${(match.team1Score / match.targetScore) * 100}%` }} 
            transition={{ duration: 1 }}
          />
        </div>
        <div className="text-xs text-white/40 text-center">
          Need {match.targetScore - match.team1Score} from {(20 - match.currentOver) * 6 - match.currentBall} balls
        </div>
      </motion.div>
    </section>
  );
}
