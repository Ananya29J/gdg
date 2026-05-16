"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Flame, Star, TrendingUp, Award } from "lucide-react";
import { useAppStore, LeaderboardEntry } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const AURA_STYLES = {
  gold: { border: "rgba(255,215,0,0.5)", glow: "rgba(255,215,0,0.3)", text: "text-yellow-400" },
  silver: { border: "rgba(192,192,192,0.5)", glow: "rgba(192,192,192,0.3)", text: "text-gray-300" },
  bronze: { border: "rgba(205,127,50,0.5)", glow: "rgba(205,127,50,0.3)", text: "text-orange-400" },
  fire: { border: "rgba(255,107,0,0.5)", glow: "rgba(255,107,0,0.3)", text: "text-cyber-orange" },
  default: { border: "rgba(255,255,255,0.08)", glow: "transparent", text: "text-white/60" },
};

function RankBadge({ rank, aura }: { rank: number; aura: string }) {
  const style = AURA_STYLES[aura as keyof typeof AURA_STYLES] || AURA_STYLES.default;
  return (
    <div className="relative w-9 h-9 flex items-center justify-center">
      {rank <= 3 && (
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
          style={{ background: style.glow, border: `1px solid ${style.border}` }}
        />
      )}
      <div className="relative z-10 text-sm font-black" style={{ color: style.border }}>
        {rank === 1 ? "👑" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const auraStyle = AURA_STYLES[entry.aura] || AURA_STYLES.default;

  return (
    <motion.div
      layout
      layoutId={entry.username}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.04 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden",
        entry.isCurrentUser ? "border-neon-blue/40" : "border-white/6"
      )}
      style={{
        background: entry.isCurrentUser
          ? "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(168,85,247,0.08))"
          : `rgba(255,255,255,0.02)`,
        boxShadow: entry.isCurrentUser ? "0 0 20px rgba(0,212,255,0.1)" : undefined,
      }}
    >
      {/* Shimmer for current user */}
      {entry.isCurrentUser && <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />}

      {/* Rank */}
      <RankBadge rank={entry.rank} aura={entry.aura} />

      {/* Avatar + name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg border"
            style={{ borderColor: auraStyle.border }}
          >
            {entry.avatar}
          </div>
          {entry.streak > 0 && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyber-orange flex items-center justify-center text-[8px] font-black border border-black">
              {entry.streak}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className={cn("text-sm font-bold truncate", entry.isCurrentUser ? "text-neon-blue" : "text-white/90")}>
            {entry.username}
            {entry.isCurrentUser && <span className="ml-1 text-[10px] text-neon-blue/60">(You)</span>}
          </div>
          <div className="text-xs text-white/35 flex items-center gap-1">
            <span>{entry.accuracy}% acc</span>
            {entry.streak > 0 && (
              <>
                <span>·</span>
                <span className="text-cyber-orange">{entry.streak}🔥</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* XP */}
      <div className="text-right">
        <div className={cn("text-sm font-black", auraStyle.text)}>
          {entry.xp.toLocaleString()}
        </div>
        <div className="text-xs text-white/30">XP</div>
      </div>

      {/* Badge */}
      <div className="text-lg">{entry.badge}</div>
    </motion.div>
  );
}

function PodiumSection({ top3 }: { top3: LeaderboardEntry[] }) {
  const heights = [120, 160, 100];
  const order = [1, 0, 2]; // 2nd, 1st, 3rd on podium

  return (
    <div className="flex items-end justify-center gap-3 mb-6 px-4">
      {order.map((idx, i) => {
        const entry = top3[idx];
        if (!entry) return null;
        const height = heights[i];
        const colors = [
          "linear-gradient(180deg, #C0C0C0, #808080)",
          "linear-gradient(180deg, #FFD700, #FFA500)",
          "linear-gradient(180deg, #CD7F32, #8B4513)",
        ];

        return (
          <motion.div
            key={entry.username}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className="flex flex-col items-center gap-2"
          >
            {/* Avatar */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <div className="text-lg">{entry.badge}</div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2"
                style={{ borderColor: i === 1 ? "#FFD700" : i === 0 ? "#C0C0C0" : "#CD7F32" }}
              >
                {entry.avatar}
              </div>
              <div className="text-xs font-bold text-white/80 max-w-[70px] truncate text-center">{entry.username}</div>
              <div className="text-xs font-black" style={{ color: i === 1 ? "#FFD700" : i === 0 ? "#C0C0C0" : "#CD7F32" }}>
                {entry.xp.toLocaleString()} XP
              </div>
            </motion.div>
            {/* Podium block */}
            <div
              className="w-20 rounded-t-xl flex items-center justify-center relative overflow-hidden"
              style={{ height, background: colors[i] }}
            >
              <div className="absolute inset-0 shimmer opacity-30" />
              <span className="text-2xl font-black text-white relative z-10">
                {i === 1 ? "1" : i === 0 ? "2" : "3"}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function LiveLeaderboard() {
  const { leaderboard, user } = useAppStore();
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-4" id="leaderboard">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #FF6B00, #FF2D55)" }}>
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Live Leaderboard</h2>
          <p className="text-xs text-white/40">Updates every 12 seconds</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-green/10 border border-lime-green/30">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-green animate-pulse" />
          <span className="text-xs font-bold text-lime-green">LIVE</span>
        </div>
      </div>

      {/* Your rank card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-4 border border-neon-blue/20"
        style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(168,85,247,0.05))" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-neon-blue/40">
              {user.avatar}
            </div>
            <div>
              <div className="text-sm font-bold text-neon-blue">{user.username}</div>
              <div className="text-xs text-white/40">Rank #{user.rank} globally</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-gradient-blue-purple">{user.xp.toLocaleString()}</div>
            <div className="text-xs text-white/40">XP</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <TrendingUp className="w-3.5 h-3.5 text-lime-green" />
          <span className="text-xs text-lime-green font-semibold">You overtook 3 fans this over! 🚀</span>
        </div>
      </motion.div>

      {/* Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-5 border border-white/10 overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-white/70 uppercase tracking-wider">Top Fans</span>
        </div>
        <PodiumSection top3={top3} />
      </motion.div>

      {/* Full list */}
      <div className="glass-card rounded-3xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-white/50" />
          <span className="text-sm font-bold text-white/50 uppercase tracking-wider">Rankings</span>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {leaderboard.map((entry, i) => (
              <LeaderboardRow key={entry.username} entry={entry} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
