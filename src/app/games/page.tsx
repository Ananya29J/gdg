"use client";

import MiniGames from "@/components/MiniGames";
import { motion } from "framer-motion";

export default function GamesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-gradient-neon tracking-tight">GAMES ARCADE</h1>
          <p className="text-white/50 text-sm uppercase tracking-widest font-bold">Play during breaks to boost your XP</p>
        </div>
        
        <MiniGames />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="glass p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-2xl font-black italic">CHALLENGE OF THE DAY</h2>
            <p className="text-white/60 leading-relaxed">
              Score 500+ in **Yorker Dodge** within 60 seconds to unlock the "Reflex King" badge and 500 bonus XP.
            </p>
            <button className="px-6 py-3 rounded-xl bg-green-500 text-black font-black text-sm uppercase tracking-wider hover:bg-green-400 transition-colors">
              Accept Challenge
            </button>
          </div>
          <div className="glass p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-2xl font-black italic">TOURNAMENT MODE</h2>
            <p className="text-white/60 leading-relaxed">
              Global tournament starts in **04:22:15**. Compete for the ultimate bragging rights and exclusive rewards.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-xs font-bold text-white/40">1,240 Registered</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
