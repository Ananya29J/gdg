"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, X, Timer, Trophy } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function PredictionEngine() {
  const { activePredictions, makePrediction, user } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(15);

  // Global countdown for active predictions
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="prediction-engine" className="glass-strong p-6 rounded-3xl border border-neon-blue/20 relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-neon-blue/20 transition-colors duration-700" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-neon-blue" />
            Live Predictions
          </h2>
          <p className="text-white/50 text-sm mt-1">Predict match events to earn XP</p>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-xl border border-orange-500/30">
          <Zap className="w-4 h-4 text-orange-400" fill="currentColor" />
          <span className="font-bold text-orange-400">{user.predictionStreak}x Streak</span>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {activePredictions.map((prediction) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "glass p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                prediction.isCorrect === true ? "border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]" :
                prediction.isCorrect === false ? "border-red-500/30 bg-red-500/5" :
                "border-white/10 hover:border-white/20"
              )}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-lg font-bold text-white max-w-[80%] leading-tight">
                  {prediction.question}
                </h3>
                
                {!prediction.selectedOption ? (
                  <div className="flex items-center gap-1 text-neon-blue bg-neon-blue/10 px-2 py-1 rounded-lg text-xs font-bold font-mono">
                    <Timer className="w-3 h-3" />
                    {timeLeft}s
                  </div>
                ) : (
                  <div className="text-xs font-bold px-2 py-1 rounded-lg bg-white/10 text-white/70">
                    +{prediction.xpReward} XP
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {prediction.options.map((option) => {
                  const isSelected = prediction.selectedOption === option.id;
                  const isResult = prediction.result === option.id;
                  const showSuccess = prediction.result && isSelected && isResult;
                  const showFail = prediction.result && isSelected && !isResult;

                  return (
                    <motion.button
                      key={option.id}
                      disabled={!!prediction.selectedOption}
                      onClick={() => makePrediction(prediction.id, option.id)}
                      whileHover={!prediction.selectedOption ? { scale: 1.02 } : {}}
                      whileTap={!prediction.selectedOption ? { scale: 0.98 } : {}}
                      className={cn(
                        "relative p-3 rounded-xl border text-left transition-all duration-300 overflow-hidden",
                        isSelected && !prediction.result ? "border-neon-blue bg-neon-blue/20" :
                        showSuccess ? "border-green-500 bg-green-500/20" :
                        showFail ? "border-red-500 bg-red-500/20 text-white/50" :
                        isResult && !isSelected ? "border-green-500/50 bg-green-500/10" :
                        "border-white/10 glass hover:bg-white/5 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{option.emoji}</span>
                          <span className="font-semibold text-sm text-white">{option.label}</span>
                        </div>
                        <span className="text-xs font-mono text-white/40">{option.odds}x</span>
                      </div>

                      {/* Result Icons */}
                      <AnimatePresence>
                        {showSuccess && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_#22c55e]">
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          </motion.div>
                        )}
                        {showFail && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_10px_#ef4444]">
                              <X className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {/* Status Overlay when locked */}
              {prediction.selectedOption && !prediction.result && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
                  <div className="glass px-4 py-2 rounded-xl border border-neon-blue/30 flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                    <div className="w-4 h-4 rounded-full border-2 border-neon-blue border-t-transparent animate-spin" />
                    <span className="text-sm font-bold text-neon-blue">Awaiting Result...</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
