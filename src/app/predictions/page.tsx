"use client";

import PredictionEngine from "@/components/PredictionEngine";
import { motion } from "framer-motion";

export default function PredictionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-gradient-neon tracking-tight">PREDICTION CENTER</h1>
          <p className="text-white/50 text-sm uppercase tracking-widest font-bold">Swipe to earn XP & climb the ranks</p>
        </div>
        
        <PredictionEngine />
        
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Active Streak Bonus
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[2, 5, 10, 20].map(streak => (
              <div key={streak} className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-2xl font-black text-purple-400">{streak}x</div>
                <div className="text-[10px] text-white/40 uppercase font-bold">Multiplier</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
