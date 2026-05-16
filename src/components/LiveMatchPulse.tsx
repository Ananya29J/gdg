"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Target, Clock, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { useAppStore, BallOutcome } from "@/store/useAppStore";

const BALL_COLORS: Record<BallOutcome, string> = {
  dot: "#4B5563",
  "1": "#9CA3AF",
  "2": "#60A5FA",
  "3": "#34D399",
  "4": "#00D4FF",
  "6": "#A855F7",
  W: "#FF2D55",
  wide: "#FBBF24",
  noball: "#F97316",
};

const BALL_LABELS: Record<BallOutcome, string> = {
  dot: "•",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "6": "6",
  W: "W",
  wide: "WD",
  noball: "NB",
};

function BallChip({ ball }: { ball: BallOutcome }) {
  const color = BALL_COLORS[ball];
  const label = BALL_LABELS[ball];
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
      style={{
        backgroundColor: `${color}20`,
        borderColor: `${color}60`,
        color,
        boxShadow: `0 0 10px ${color}40`,
      }}
    >
      {label}
    </motion.div>
  );
}

function TensionMeter({ value }: { value: number }) {
  const color = value > 70 ? "#FF2D55" : value > 40 ? "#FF6B00" : "#39FF14";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs text-white/50 uppercase tracking-wider">Match Tension</span>
        </div>
        <span className="text-xs font-black" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #39FF14, #FF6B00, #FF2D55)` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function WinProbabilityBar({ prob, team1, team2 }: { prob: number; team1: string; team2: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-neon-blue">{team1}</span>
        <span className="text-white/40 text-[10px]">Win Probability</span>
        <span className="text-hot-pink">{team2}</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #00D4FF, #0080FF)" }}
          animate={{ width: `${prob}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute right-0 top-0 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #FF0080, #FF2D55)", width: `${100 - prob}%` }}
          animate={{ width: `${100 - prob}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="font-black text-neon-blue">{prob}%</span>
        <span className="font-black text-hot-pink">{100 - prob}%</span>
      </div>
    </div>
  );
}

export default function LiveMatchPulse() {
  const { match, pushCommentary } = useAppStore();

  const needed = match.targetScore - match.team1Score;
  const ballsLeft = (20 - match.currentOver) * 6 - match.currentBall;
  const rrr = ballsLeft > 0 ? (needed / ballsLeft * 6).toFixed(2) : "0.00";

  return (
    <div className="space-y-4 w-full" id="live-pulse">
      {/* Hype event flash overlay */}
      <AnimatePresence>
        {match.eventFlash && match.lastEvent === "six" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{ background: "radial-gradient(circle at center, rgba(168,85,247,0.2), transparent 70%)" }}
          />
        )}
        {match.eventFlash && match.lastEvent === "wicket" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{ background: "radial-gradient(circle at center, rgba(255,45,85,0.2), transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      {/* Main scoreboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden"
      >
        {/* Background glow based on last event */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              opacity: match.lastEvent === "six" ? [0, 0.3, 0] : match.lastEvent === "wicket" ? [0, 0.2, 0] : 0,
            }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 rounded-3xl"
            style={{
              background: match.lastEvent === "six"
                ? "radial-gradient(circle at center, rgba(168,85,247,0.4), transparent)"
                : "radial-gradient(circle at center, rgba(255,45,85,0.4), transparent)",
            }}
          />
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#FF2D55]" />
            <span className="text-xs font-bold text-red-400 tracking-widest uppercase">Live T20</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Clock className="w-3 h-3" />
            <span>Innings 2 · Over {match.currentOver}.{match.currentBall}</span>
          </div>
        </div>

        {/* Chasing team score */}
        <div className="text-center mb-4">
          <div className="text-sm text-white/50 mb-1">{match.team1} (Chasing {match.targetScore})</div>
          <div className="flex items-end justify-center gap-2">
            <motion.span
              key={match.team1Score}
              initial={{ scale: 1.3, color: "#00D4FF" }}
              animate={{ scale: 1, color: "#FFFFFF" }}
              className="text-6xl sm:text-7xl font-black leading-none"
            >
              {match.team1Score}
            </motion.span>
            <span className="text-3xl font-black text-white/50 mb-1">/{match.team1Wickets}</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/50">
            <span>RRR: <strong className={parseFloat(rrr) > 12 ? "text-red-400" : "text-green-400"}>{rrr}</strong></span>
            <span>·</span>
            <span>Need: <strong className="text-white">{needed}</strong> from <strong className="text-white">{ballsLeft}</strong> balls</span>
          </div>
        </div>

        {/* Recent balls */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <span className="text-xs text-white/30 mr-1">This over:</span>
          <div className="flex gap-1.5">
            {match.recentBalls.slice(-6).map((ball, i) => (
              <BallChip key={i} ball={ball} />
            ))}
          </div>
          {match.lastBall && (
            <AnimatePresence mode="wait">
              <motion.div
                key={match.lastBall}
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="ml-2 px-2 py-0.5 rounded-full text-xs font-black"
                style={{
                  backgroundColor: `${BALL_COLORS[match.lastBall]}30`,
                  color: BALL_COLORS[match.lastBall],
                  border: `1px solid ${BALL_COLORS[match.lastBall]}60`,
                }}
              >
                {match.lastBall === "4" ? "FOUR!" : match.lastBall === "6" ? "SIX! 🚀" : match.lastBall === "W" ? "OUT! 💀" : BALL_LABELS[match.lastBall]}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Batters */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[match.batter1, match.batter2].map((b, i) => (
            <div key={i} className="glass rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-lime-green animate-pulse" title="On Strike" />}
                <span className="text-sm font-semibold text-white/90">{b.name}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-neon-blue">{b.runs}</span>
                <span className="text-xs text-white/40">({b.balls})</span>
              </div>
              <div className="text-xs text-white/40 mt-1">
                {b.fours}×4 · {b.sixes}×6 · SR: {b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0"}
              </div>
            </div>
          ))}
        </div>

        {/* Bowler */}
        <div className="glass rounded-xl p-3 border border-white/5 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-white/40 mb-0.5">Bowling</div>
              <div className="text-sm font-bold text-white">{match.bowler.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 mb-0.5">Figures</div>
              <div className="text-sm font-bold text-neon-purple">
                {match.bowler.wickets}-{match.bowler.runs} ({match.bowler.overs})
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <TensionMeter value={match.tensionLevel} />
          <WinProbabilityBar
            prob={match.winProbability}
            team1={match.team1}
            team2={match.team2}
          />
        </div>
      </motion.div>

      {/* Commentary feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl p-5 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-neon-blue" />
          <span className="text-sm font-bold text-white/80 uppercase tracking-wider">Live Commentary</span>
        </div>
        <div className="space-y-2.5 max-h-48 overflow-y-auto no-scrollbar">
          <AnimatePresence initial={false}>
            {match.commentary.map((line, i) => (
              <motion.div
                key={line + i}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-sm leading-relaxed ${i === 0 ? "text-white font-medium" : "text-white/50"}`}
              >
                {i === 0 && <span className="text-neon-blue mr-2">▶</span>}
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Phase indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: match.phase === "powerplay" ? "rgba(57,255,20,0.2)" : match.phase === "death" ? "rgba(255,45,85,0.2)" : "rgba(0,212,255,0.2)"
            }}>
            <TrendingUp className="w-5 h-5"
              style={{ color: match.phase === "powerplay" ? "#39FF14" : match.phase === "death" ? "#FF2D55" : "#00D4FF" }} />
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase tracking-wider">Match Phase</div>
            <div className="text-sm font-bold capitalize text-white">{match.phase === "death" ? "💀 Death Overs" : match.phase === "powerplay" ? "⚡ Powerplay" : "🎯 Middle Overs"}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40">Overs Left</div>
          <div className="text-xl font-black text-neon-blue">{20 - match.currentOver}</div>
        </div>
      </motion.div>
    </div>
  );
}
