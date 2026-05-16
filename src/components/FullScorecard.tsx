"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { User, Swords, Shield, Zap, Target } from "lucide-react";

const SQUADS = {
  team1: {
    name: "Chennai Super Kings",
    players: [
      { name: "R. Gaikwad (c)", role: "Batter", runs: 34, balls: 28, out: false },
      { name: "R. Ravindra", role: "Batter", runs: 12, balls: 8, out: true },
      { name: "A. Rahane", role: "Batter", runs: 2, balls: 4, out: true },
      { name: "S. Dube", role: "All-Rounder", runs: 0, balls: 0, out: false },
      { name: "D. Mitchell", role: "All-Rounder", runs: 0, balls: 0, out: false },
      { name: "M. Dhoni (wk)", role: "Batter", runs: 67, balls: 42, out: false },
      { name: "R. Jadeja", role: "All-Rounder", runs: 0, balls: 0, out: false, overs: 4, wickets: 2, runsConceded: 28 },
      { name: "D. Chahar", role: "Bowler", overs: 4, wickets: 1, runsConceded: 34 },
      { name: "M. Pathirana", role: "Bowler", overs: 4, wickets: 3, runsConceded: 31 },
      { name: "M. Theekshana", role: "Bowler", overs: 4, wickets: 1, runsConceded: 24 },
      { name: "T. Deshpande", role: "Bowler", overs: 4, wickets: 2, runsConceded: 42 },
    ]
  },
  team2: {
    name: "Lucknow Super Giants",
    players: [
      { name: "Q. de Kock", role: "Batter", runs: 45, balls: 31, out: true },
      { name: "KL Rahul (c)", role: "Batter", runs: 82, balls: 54, out: true },
      { name: "D. Padikkal", role: "Batter", runs: 14, balls: 10, out: true },
      { name: "M. Stoinis", role: "All-Rounder", runs: 28, balls: 15, out: true, overs: 1, wickets: 0, runsConceded: 12 },
      { name: "N. Pooran", role: "Batter", runs: 12, balls: 6, out: true },
      { name: "A. Badoni", role: "Batter", runs: 5, balls: 4, out: true },
      { name: "K. Pandya", role: "All-Rounder", runs: 0, balls: 0, out: true, overs: 2, wickets: 0, runsConceded: 18 },
      { name: "R. Bishnoi", role: "Bowler", overs: 2.3, wickets: 1, runsConceded: 18 },
      { name: "M. Khan", role: "Bowler", overs: 2, wickets: 1, runsConceded: 14 },
      { name: "N. ul-Haq", role: "Bowler", overs: 2, wickets: 0, runsConceded: 22 },
      { name: "Y. Thakur", role: "Bowler", overs: 2, wickets: 0, runsConceded: 15 },
    ]
  }
};

export default function FullScorecard() {
  const { match } = useAppStore();

  const getRoleIcon = (role: string) => {
    switch(role) {
      case "Batter": return <Swords className="w-3 h-3 text-neon-blue" />;
      case "Bowler": return <Target className="w-3 h-3 text-red-400" />;
      case "All-Rounder": return <Zap className="w-3 h-3 text-yellow-400" />;
      default: return <User className="w-3 h-3 text-white/50" />;
    }
  };

  const renderPlayerList = (team: typeof SQUADS.team1) => (
    <div className="space-y-2">
      {team.players.map((p, i) => (
        <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              {p.role === "Batter" ? <Swords className="w-4 h-4 text-white/50" /> : 
               p.role === "Bowler" ? <div className="w-4 h-4 rounded-full border-2 border-white/50" /> :
               <Zap className="w-4 h-4 text-white/50" />}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {p.name}
                {p.out === false && <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />}
              </div>
              <div className="text-xs text-white/40">{p.role}</div>
            </div>
          </div>
          
          <div className="text-right flex gap-4">
            {p.runs !== undefined && (
              <div className="w-16">
                <div className="text-sm font-bold text-white">{p.runs} <span className="text-xs font-normal text-white/50">({p.balls})</span></div>
                <div className="text-[10px] text-white/40 uppercase">Batting</div>
              </div>
            )}
            {p.overs !== undefined && (
              <div className="w-16">
                <div className="text-sm font-bold text-white">{p.wickets}/{p.runsConceded}</div>
                <div className="text-[10px] text-white/40 uppercase">({p.overs} ov)</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div id="full-scorecard" className="mt-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Match Squads</h2>
          <p className="text-xs text-white/40">Full team performance & stats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-6 border border-white/10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            {SQUADS.team1.name}
          </h3>
          {renderPlayerList(SQUADS.team1)}
        </motion.div>

        {/* Team 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-3xl p-6 border border-white/10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-neon-blue" />
            {SQUADS.team2.name}
          </h3>
          {renderPlayerList(SQUADS.team2)}
        </motion.div>
      </div>
    </div>
  );
}
