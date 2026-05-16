"use client";

import { useEffect } from "react";
import { useAppStore, BallOutcome } from "@/store/useAppStore";
import { randomBetween, randomItem } from "@/lib/utils";

const COMMENTARY_POOL: Record<string, string[]> = {
  dot: [
    "Dot ball! Tight line from the bowler. 🔒",
    "Defended solidly. No run off that delivery.",
    "Good length, pushed back to the bowler. Scoreboard pressure building!",
  ],
  "1": [
    "Worked away for a single. Good rotation of strike! 🔄",
    "Dabbed to fine leg, they run through for one.",
    "Single taken. Smart cricket by the batsman.",
  ],
  "2": [
    "Two runs! Pushed through the covers for a couple. 👟",
    "Good running between the wickets — two taken!",
    "Guided to third man, quick two runs.",
  ],
  "3": [
    "Three runs! Excellent running between the wickets. 🏃",
    "Pushed into the deep, they come back for the third.",
    "Great effort in the deep saves a boundary, they run three.",
  ],
  "4": [
    "FOUR! Cracked through the off side — beautiful shot! 🔵",
    "BOUNDARY! Swept fine, races away to the rope! 💥",
    "FOUR RUNS! Edged but it flies over slip for four! ⚡",
  ],
  "6": [
    "SIX! Maximum! Launched over long-on into the stands! 🚀🔴",
    "HUGE SIX! That's gone miles! The crowd goes berserk! 🎆",
    "SIX SIXES!? Another maximum — the bowler has no answers! 💫",
  ],
  W: [
    "WICKET! Clean bowled through the gate! TIMBER! 💀",
    "OUT! Caught at mid-on! Big wicket falls! 🎯",
    "GONE! LBW — plumb in front! The umpire's finger goes up! ☝️",
  ],
  wide: ["Wide ball! Strays down leg, the pressure of the chase! 📏"],
  noball: ["No ball! Free hit coming up! What drama! 🎉"],
};

const BALL_PROBABILITIES: { outcome: BallOutcome; weight: number }[] = [
  { outcome: "dot", weight: 30 },
  { outcome: "1", weight: 25 },
  { outcome: "2", weight: 12 },
  { outcome: "4", weight: 14 },
  { outcome: "6", weight: 8 },
  { outcome: "W", weight: 7 },
  { outcome: "wide", weight: 3 },
  { outcome: "noball", weight: 1 },
];

function getWeightedBall(): BallOutcome {
  const total = BALL_PROBABILITIES.reduce((sum, b) => sum + b.weight, 0);
  let rand = Math.random() * total;
  for (const b of BALL_PROBABILITIES) {
    rand -= b.weight;
    if (rand <= 0) return b.outcome;
  }
  return "dot";
}

const AI_INSIGHTS_POOL = [
  "Bumrah's yorker accuracy is 89% today — expect a wicket maiden next over! 🎯",
  "Required rate just crossed 12. Pressure is mounting! 📈",
  "Kohli's strike rate in last 10 balls: 145. He's in beast mode! 🔥",
  "RCB wins 68% of matches when defending 186+. Looking good!",
  "Dew factor kicking in — batting team has a significant advantage now! 💧",
  "After 3 boundaries in a row, statistically a dot ball is 73% likely! ⚫",
  "Partnership worth 60+ runs. A bowling change expected! 🏏",
  "Death overs approaching — expect yorkers and pace variations. ⚡",
  "MI need 10 an over from here. Historically 42% chance of pulling it off!",
  "The fielding circle tightens — expect boundary-saving mode now! 🛡️",
];

export function useLiveSimulation() {
  const store = useAppStore();

  useEffect(() => {
    let ballInterval: ReturnType<typeof setInterval>;
    let leaderboardInterval: ReturnType<typeof setInterval>;
    let insightInterval: ReturnType<typeof setInterval>;
    let tensionInterval: ReturnType<typeof setInterval>;

    // Ball-by-ball simulation every 5 seconds
    ballInterval = setInterval(() => {
      const outcome = getWeightedBall();
      const commentary = randomItem(COMMENTARY_POOL[outcome] || COMMENTARY_POOL["dot"]);

      const m = store.match;
      let newScore = m.team1Score;
      let newWickets = m.team1Wickets;
      let newBall = m.currentBall + 1;
      let newOver = m.currentOver;
      let newBalls: BallOutcome[] = [...m.recentBalls.slice(-5), outcome];
      let lastEvent: typeof m.lastEvent = "run";
      let tension = m.tensionLevel;

      if (outcome === "4") { newScore += 4; lastEvent = "boundary"; tension = Math.min(100, tension + 5); }
      else if (outcome === "6") { newScore += 6; lastEvent = "six"; tension = Math.min(100, tension + 10); }
      else if (outcome === "W") { newWickets += 1; lastEvent = "wicket"; tension = Math.min(100, tension + 15); }
      else if (outcome === "1") { newScore += 1; }
      else if (outcome === "2") { newScore += 2; }
      else if (outcome === "3") { newScore += 3; }
      else if (outcome === "dot") { lastEvent = "dot"; tension = Math.max(0, tension - 2); }

      if (newBall > 6 && outcome !== "wide" && outcome !== "noball") {
        newBall = 1;
        newOver += 1;
      }

      const needed = m.targetScore - newScore;
      const ballsLeft = (20 - newOver) * 6 - newBall;
      const rrr = ballsLeft > 0 ? (needed / ballsLeft) * 6 : 99;
      const winProb = Math.max(5, Math.min(95, 100 - (rrr / 36) * 100 + randomBetween(-5, 5)));

      const heartbeat = tension > 70;
      const hype = outcome === "6" || outcome === "W";

      store.updateMatch({
        team1Score: newScore,
        team1Wickets: newWickets,
        currentBall: newBall,
        currentOver: newOver,
        lastBall: outcome,
        recentBalls: newBalls,
        tensionLevel: tension,
        winProbability: winProb,
        lastEvent,
        eventFlash: hype,
        phase: newOver < 6 ? "powerplay" : newOver < 15 ? "middle" : "death",
      });

      store.pushCommentary(commentary);
      useAppStore.setState({ heartbeatMode: tension > 70 });

      // Add XP for watching live
      if (Math.random() > 0.7) store.addXP(5);

      // Trigger hype storm flash
      if (outcome === "6" || outcome === "W") {
        useAppStore.setState({ hypeStorm: true });
        setTimeout(() => useAppStore.setState({ hypeStorm: false }), 2000);
      }
    }, 5000);

    // Leaderboard shuffle every 12 seconds
    leaderboardInterval = setInterval(() => {
      store.updateLeaderboard();
    }, 12000);

    // AI insight rotation every 20 seconds
    insightInterval = setInterval(() => {
      store.setAiInsight(randomItem(AI_INSIGHTS_POOL));
    }, 20000);

    // Tension fluctuation every 8 seconds
    tensionInterval = setInterval(() => {
      const current = useAppStore.getState().match.tensionLevel;
      const delta = randomBetween(-8, 8);
      const newTension = Math.max(20, Math.min(100, current + delta));
      store.updateMatch({ tensionLevel: newTension });
      useAppStore.setState({ heartbeatMode: newTension > 72 });
    }, 8000);

    return () => {
      clearInterval(ballInterval);
      clearInterval(leaderboardInterval);
      clearInterval(insightInterval);
      clearInterval(tensionInterval);
    };
  }, []);
}
