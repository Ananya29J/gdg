"use client";

import { create } from "zustand";
import { randomBetween, randomItem } from "@/lib/utils";

export type BallOutcome = "dot" | "1" | "2" | "3" | "4" | "6" | "W" | "wide" | "noball";
export type MatchPhase = "powerplay" | "middle" | "death" | "innings-break" | "completed";

export interface Player {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

export interface Bowler {
  name: string;
  overs: number;
  runs: number;
  wickets: number;
}

export interface MatchState {
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  team1Wickets: number;
  team2Wickets: number;
  team1Overs: string;
  currentInnings: 1 | 2;
  currentOver: number;
  currentBall: number;
  lastBall: BallOutcome | null;
  phase: MatchPhase;
  tensionLevel: number; // 0-100
  momentumTeam: 1 | 2;
  winProbability: number; // team1 win probability 0-100
  commentary: string[];
  recentBalls: BallOutcome[];
  batter1: Player;
  batter2: Player;
  bowler: Bowler;
  targetScore: number;
  isLive: boolean;
  lastEvent: "boundary" | "six" | "wicket" | "dot" | "run" | null;
  eventFlash: boolean;
}

export interface UserState {
  username: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
  predictionStreak: number;
  correctPredictions: number;
  totalPredictions: number;
  badges: string[];
  fanEnergy: number;
  highScores: Record<string, number>;
}

export interface PredictionOption {
  id: string;
  label: string;
  emoji: string;
  odds: number;
}

export interface ActivePrediction {
  question: string;
  options: PredictionOption[];
  expiresIn: number;
  selectedOption: string | null;
  result: string | null;
  isCorrect: boolean | null;
  xpReward: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  accuracy: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
  aura: "gold" | "silver" | "bronze" | "fire" | "default";
}

export interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

interface AppState {
  match: MatchState;
  user: UserState;
  activePredictions: (ActivePrediction & { id: string })[];
  leaderboard: LeaderboardEntry[];
  reactions: Reaction[];
  activeTab: string;
  miniGameActive: boolean;
  heartbeatMode: boolean;
  hypeStorm: boolean;
  aiInsight: string;
  isAiOpen: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  setAiOpen: (open: boolean) => void;
  addReaction: (emoji: string) => void;
  removeReaction: (id: string) => void;
  makePrediction: (predId: string, optionId: string) => void;
  setMiniGame: (active: boolean) => void;
  addXP: (amount: number) => void;
  updateHighScore: (gameId: string, score: number) => void;
  updateMatch: (partial: Partial<MatchState>) => void;
  pushCommentary: (text: string) => void;
  updateLeaderboard: () => void;
  setAiInsight: (insight: string) => void;
}



const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "CricketKing99", avatar: "🏏", xp: 12450, accuracy: 78, streak: 12, badge: "🔥", aura: "gold" },
  { rank: 2, username: "SixMachineX", avatar: "⚡", xp: 11890, accuracy: 74, streak: 8, badge: "💎", aura: "silver" },
  { rank: 3, username: "PitchPerfect", avatar: "🎯", xp: 10230, accuracy: 71, streak: 6, badge: "🏆", aura: "bronze" },
  { rank: 4, username: "BoundaryBlast", avatar: "🌟", xp: 9870, accuracy: 68, streak: 5, badge: "⭐", aura: "fire" },
  { rank: 5, username: "YoungGunZ", avatar: "🎮", xp: 8540, accuracy: 65, streak: 3, badge: "🎯", aura: "default" },
  { rank: 6, username: "IPLFanatic", avatar: "🏟️", xp: 7200, accuracy: 63, streak: 2, badge: "🎪", aura: "default" },
  { rank: 7, username: "PulseX_You", avatar: "😎", xp: 6800, accuracy: 61, streak: 4, badge: "✨", aura: "fire", isCurrentUser: true },
  { rank: 8, username: "CricketNerd", avatar: "🤓", xp: 5400, accuracy: 59, streak: 1, badge: "📊", aura: "default" },
  { rank: 9, username: "StumpOut", avatar: "🎪", xp: 4200, accuracy: 55, streak: 0, badge: "🏏", aura: "default" },
  { rank: 10, username: "FanWarrior", avatar: "⚔️", xp: 3100, accuracy: 52, streak: 0, badge: "🛡️", aura: "default" },
];

const PREDICTION_POOL: Omit<ActivePrediction, "selectedOption" | "result" | "isCorrect">[] = [
  {
    question: "What will be the next ball?",
    options: [
      { id: "dot", label: "Dot Ball", emoji: "⚫", odds: 1.5 },
      { id: "boundary", label: "Boundary (4)", emoji: "🔵", odds: 3.0 },
      { id: "six", label: "Maximum (6)", emoji: "🔴", odds: 5.0 },
      { id: "wicket", label: "Wicket!", emoji: "💀", odds: 8.0 },
    ],
    expiresIn: 15,
    xpReward: 50,
  },
  {
    question: "Powerplay score prediction",
    options: [
      { id: "under50", label: "Under 50", emoji: "📉", odds: 2.0 },
      { id: "50to60", label: "50-60 runs", emoji: "📊", odds: 2.5 },
      { id: "60to70", label: "60-70 runs", emoji: "📈", odds: 3.0 },
      { id: "over70", label: "Over 70", emoji: "🚀", odds: 4.0 },
    ],
    expiresIn: 20,
    xpReward: 100,
  },
  {
    question: "Will next over have a wicket?",
    options: [
      { id: "yes", label: "Yes! Wicket incoming", emoji: "🎯", odds: 3.5 },
      { id: "no", label: "No, batsman safe", emoji: "🛡️", odds: 1.4 },
    ],
    expiresIn: 12,
    xpReward: 75,
  },
  {
    question: "Who wins the match?",
    options: [
      { id: "t1", label: "Chennai Super Kings", emoji: "💛", odds: 1.9 },
      { id: "t2", label: "Lucknow Super Giants", emoji: "💙", odds: 2.1 },
    ],
    expiresIn: 30,
    xpReward: 150,
  },
];

const AI_INSIGHTS = [
  "Bishnoi's googly accuracy is at 89% today — expect a wicket maiden next over! 🎯",
  "Chennai's required run rate just crossed 12 — pressure is mounting! 📈",
  "Dhoni's strike rate is 145 in last 10 balls. He's in beast mode! 🔥",
  "Historical data: CSK wins 78% of matches when chasing at Chepauk. They're on track!",
  "Powerplay over — expect the 'consolidation trap'. Dot balls incoming! ⚫",
  "Dew factor kicking in. Batting team has a significant advantage now! 💧",
  "This is a classic momentum shift — after 3 boundaries, expect a tight spell! 🎭",
  "The partnership is worth 60+ runs. Time for a bowling change! 🏏",
];

export const useAppStore = create<AppState>((set, get) => ({
  match: {
    team1: "Chennai Super Kings",
    team2: "Lucknow Super Giants",
    team1Score: 76,
    team2Score: 186,
    team1Wickets: 2,
    team2Wickets: 10,
    team1Overs: "20.0",
    currentInnings: 2,
    currentOver: 8,
    currentBall: 3,
    lastBall: null,
    phase: "middle",
    tensionLevel: 65,
    momentumTeam: 1,
    winProbability: 52,
    commentary: [
      "WHAT A SHOT! Dhoni hammers it over mid-on for a SIX! 🚀",
      "Good length delivery from Bishnoi, defended solidly back down the pitch.",
      "FOUR! Gaikwad clips it fine leg, races to the boundary!",
      "Bowled! But wait... no ball called by the umpire!",
      "Chennai need 98 from 70 balls. Game very much alive! ⚡",
    ],
    recentBalls: ["4", "dot", "1", "6", "dot", "W"] as BallOutcome[],
    batter1: { name: "M. Dhoni", runs: 67, balls: 42, fours: 5, sixes: 4 },
    batter2: { name: "R. Gaikwad", runs: 34, balls: 28, fours: 3, sixes: 1 },
    bowler: { name: "R. Bishnoi", overs: 2.3, runs: 18, wickets: 1 },
    targetScore: 187,
    isLive: true,
    lastEvent: null,
    eventFlash: false,
  },
  user: {
    username: "PulseX_You",
    avatar: "😎",
    xp: 6800,
    level: 14,
    rank: 7,
    predictionStreak: 4,
    correctPredictions: 28,
    totalPredictions: 46,
    badges: ["🔥", "⚡", "🎯", "💎"],
    fanEnergy: 72,
    highScores: {
      catch: 0,
      tap: 0,
      trivia: 0,
      timing: 0,
      reflex: 0,
    },
  },
  activePredictions: [
    { ...PREDICTION_POOL[0], id: "p1", selectedOption: null, result: null, isCorrect: null },
    { ...PREDICTION_POOL[1], id: "p2", selectedOption: null, result: null, isCorrect: null },
    { ...PREDICTION_POOL[3], id: "p3", selectedOption: null, result: null, isCorrect: null },
  ],
  leaderboard: INITIAL_LEADERBOARD,
  reactions: [],
  activeTab: "pulse",
  miniGameActive: false,
  heartbeatMode: false,
  hypeStorm: false,
  aiInsight: AI_INSIGHTS[0],
  isAiOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setAiOpen: (open) => set({ isAiOpen: open }),

  addReaction: (emoji) => {
    const id = Math.random().toString(36).slice(2);
    const x = randomBetween(10, 90);
    set((s) => ({ reactions: [...s.reactions.slice(-15), { id, emoji, x }] }));
    setTimeout(() => get().removeReaction(id), 3000);
  },

  removeReaction: (id) =>
    set((s) => ({ reactions: s.reactions.filter((r) => r.id !== id) })),

  makePrediction: (predId: string, optionId: string) => {
    const { activePredictions } = get();
    const targetIdx = activePredictions.findIndex(p => p.id === predId);
    if (targetIdx === -1 || activePredictions[targetIdx].selectedOption) return;

    const prediction = activePredictions[targetIdx];
    const isCorrect = Math.random() > 0.45; 
    const xpGain = isCorrect ? prediction.xpReward * (get().user.predictionStreak + 1) : 0;

    // Set selected
    set((s) => {
      const newPreds = [...s.activePredictions];
      newPreds[targetIdx] = { ...prediction, selectedOption: optionId };
      return { activePredictions: newPreds };
    });

    // Reveal result after 3s
    setTimeout(() => {
      const correctId = isCorrect ? optionId : randomItem(prediction.options.map((o) => o.id).filter((id) => id !== optionId));
      set((s) => {
        const newPreds = [...s.activePredictions];
        newPreds[targetIdx] = { ...newPreds[targetIdx], result: correctId, isCorrect };
        return { activePredictions: newPreds };
      });
      if (isCorrect) get().addXP(xpGain);
    }, 3000);

    // Swap prediction after 6s
    setTimeout(() => {
      set((s) => {
        const newPreds = [...s.activePredictions];
        const nextP = randomItem(PREDICTION_POOL);
        newPreds[targetIdx] = { ...nextP, id: Math.random().toString(), selectedOption: null, result: null, isCorrect: null };
        return { activePredictions: newPreds };
      });
    }, 7000);
  },

  setMiniGame: (active) => set({ miniGameActive: active }),

  addXP: (amount) =>
    set((s) => {
      const newXp = s.user.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      // Instantly update user in leaderboard and resort
      const newLeaderboard = [...s.leaderboard]
        .map(e => e.isCurrentUser ? { ...e, xp: newXp } : e)
        .sort((a, b) => b.xp - a.xp)
        .map((e, i) => ({ ...e, rank: i + 1 }));

      const newRank = newLeaderboard.find(e => e.isCurrentUser)?.rank || s.user.rank;

      return { 
        user: { ...s.user, xp: newXp, level: newLevel, rank: newRank },
        leaderboard: newLeaderboard
      };
    }),

  updateMatch: (partial) =>
    set((s) => ({ match: { ...s.match, ...partial } })),

  pushCommentary: (text) =>
    set((s) => ({
      match: {
        ...s.match,
        commentary: [text, ...s.match.commentary].slice(0, 20),
      },
    })),

  updateLeaderboard: () => {
    set((s) => {
      const shuffled = [...s.leaderboard]
        .map((e) => ({
          ...e,
          xp: e.isCurrentUser ? e.xp : e.xp + randomBetween(-50, 150),
        }))
        .sort((a, b) => b.xp - a.xp)
        .map((e, i) => ({ ...e, rank: i + 1 }));
      return { leaderboard: shuffled };
    });
  },

  setAiInsight: (insight) => set({ aiInsight: insight }),
  
  updateHighScore: (gameId, score) =>
    set((s) => {
      const currentHigh = s.user.highScores[gameId] || 0;
      if (score > currentHigh) {
        return { user: { ...s.user, highScores: { ...s.user.highScores, [gameId]: score } } };
      }
      return s;
    }),
}));
