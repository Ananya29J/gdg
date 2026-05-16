"use client";

import LiveLeaderboard from "@/components/LiveLeaderboard";
import { motion } from "framer-motion";
import { Trophy, Target, Zap } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-gradient-neon tracking-tight">GLOBAL RANKINGS</h1>
          <p className="text-white/50 text-sm uppercase tracking-widest font-bold">The Elite PulseX Community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={Trophy} label="Season Reward" value="₹25,000" color="text-yellow-400" />
          <StatCard icon={Target} label="Top Accuracy" value="94.2%" color="text-blue-400" />
          <StatCard icon={Zap} label="Active Fans" value="12.4k" color="text-cyan-400" />
        </div>
        
        <LiveLeaderboard />
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center gap-2">
      <Icon className={`w-6 h-6 ${color}`} />
      <div className="text-2xl font-black">{value}</div>
      <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{label}</div>
    </div>
  );
}
