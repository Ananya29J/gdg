"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GamepadIcon, Zap, Target, Clock, Trophy, X, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { randomBetween } from "@/lib/utils";

// ─── Catch the Ball Game ────────────────────────────────────────────────────
function CatchTheBall({ onComplete }: { onComplete: (score: number) => void }) {
  const [balls, setBalls] = useState<{ id: number; x: number; y: number; caught: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (gameOver) return;
      setBalls((prev) => [
        ...prev.slice(-8),
        { id: Date.now(), x: randomBetween(10, 85), y: 0, caught: false },
      ]);
    }, 800);
    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gameOver) setTimeout(() => onComplete(score), 1500);
  }, [gameOver, score, onComplete]);

  const catchBall = (id: number) => {
    setBalls((prev) =>
      prev.map((b) => (b.id === id ? { ...b, caught: true } : b))
    );
    setScore((s) => s + 10);
    setTimeout(() => setBalls((prev) => prev.filter((b) => b.id !== id)), 300);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-neon-blue">
          <Star className="w-4 h-4" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/40" />
          <span className={`text-sm font-black ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-white/60"}`}>
            {timeLeft}s
          </span>
        </div>
      </div>
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-white/10"
        style={{ height: 280, background: "radial-gradient(ellipse at bottom, #0a1628, #050714)" }}
      >
        {/* Field lines */}
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20"
          style={{ background: "linear-gradient(180deg, transparent, rgba(57,255,20,0.2))" }} />

        <AnimatePresence>
          {balls.map((ball) => (
            <motion.button
              key={ball.id}
              initial={{ top: "0%", scale: 0.5, opacity: 0 }}
              animate={{ top: "90%", scale: 1, opacity: ball.caught ? 0 : 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 2, ease: "easeIn" }}
              onClick={() => catchBall(ball.id)}
              className="absolute w-10 h-10 rounded-full flex items-center justify-center text-xl -translate-x-1/2 cursor-pointer select-none active:scale-75 transition-transform"
              style={{
                left: `${ball.x}%`,
                background: "radial-gradient(circle at 30% 30%, #ffffff, #dc2626)",
                boxShadow: "0 0 15px rgba(220,38,38,0.6), 0 2px 8px rgba(0,0,0,0.5)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              🏏
            </motion.button>
          ))}
        </AnimatePresence>

        {gameOver && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-xl font-black text-yellow-400">Game Over!</div>
            <div className="text-lg text-white mt-1">{score} points</div>
          </motion.div>
        )}
      </div>
      <p className="text-center text-xs text-white/30 mt-2">Tap the falling balls to catch them!</p>
    </div>
  );
}

// ─── Tap Challenge Game ──────────────────────────────────────────────────────
function TapChallenge({ onComplete }: { onComplete: (score: number) => void }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setDone(true);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  useEffect(() => {
    if (done) setTimeout(() => onComplete(taps * 5), 1500);
  }, [done, taps, onComplete]);

  const progress = (timeLeft / 10) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-center">
          <div className="text-3xl font-black text-neon-blue">{taps}</div>
          <div className="text-xs text-white/40">Taps</div>
        </div>
        <div className="w-16 h-16 relative flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="64" height="64">
            <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
            <motion.circle
              cx="32" cy="32" r="26"
              stroke={timeLeft <= 3 ? "#FF2D55" : "#00D4FF"}
              strokeWidth="4"
              fill="none"
              strokeDasharray={163}
              animate={{ strokeDashoffset: 163 - (163 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <span className="text-lg font-black">{started ? timeLeft : "GO"}</span>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-lime-green">{taps * 5}</div>
          <div className="text-xs text-white/40">XP</div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onPointerDown={() => {
          if (!started) setStarted(true);
          if (!done) setTaps((t) => t + 1);
        }}
        animate={done ? { scale: 1 } : {}}
        className="w-40 h-40 rounded-full flex flex-col items-center justify-center select-none text-white font-black text-lg relative overflow-hidden"
        style={{
          background: done
            ? "linear-gradient(135deg, #FFD700, #FF6B00)"
            : "linear-gradient(135deg, #00D4FF, #A855F7)",
          boxShadow: done ? "0 0 60px rgba(255,215,0,0.5)" : "0 0 40px rgba(0,212,255,0.4), 0 0 80px rgba(168,85,247,0.2)",
        }}
      >
        <div className="absolute inset-0 shimmer" />
        {done ? (
          <>
            <Trophy className="w-10 h-10 mb-1" />
            <span>Done!</span>
          </>
        ) : (
          <>
            <Zap className="w-10 h-10 mb-1" fill="currentColor" />
            <span>{started ? "TAP!" : "START"}</span>
          </>
        )}
      </motion.button>
      <p className="text-xs text-white/30">Tap as fast as you can in 10 seconds!</p>
    </div>
  );
}

// ─── Trivia Game ─────────────────────────────────────────────────────────────
const TRIVIA_QUESTIONS = [
  {
    q: "Which batsman holds the IPL record for most sixes?",
    options: ["Chris Gayle", "AB de Villiers", "MS Dhoni", "Virat Kohli"],
    answer: 0,
  },
  {
    q: "Which team has won the most IPL titles?",
    options: ["CSK", "MI Mumbai", "KKR", "SRH"],
    answer: 1,
  },
  {
    q: "Who is the fastest to 100 wickets in IPL history?",
    options: ["Lasith Malinga", "SL Malinga", "Dwayne Bravo", "Amit Mishra"],
    answer: 0,
  },
  {
    q: "What does IPL stand for?",
    options: ["Indian Premier League", "International Premier League", "India Pro League", "Indian Power League"],
    answer: 0,
  },
];

function TriviaBlitz({ onComplete }: { onComplete: (score: number) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = TRIVIA_QUESTIONS[qIndex];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 100);
    setTimeout(() => {
      if (qIndex + 1 >= TRIVIA_QUESTIONS.length) {
        setDone(true);
        setTimeout(() => onComplete(score + (i === q.answer ? 100 : 0)), 1200);
      } else {
        setQIndex((qi) => qi + 1);
        setSelected(null);
      }
    }, 900);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-white/50">
        <span>Question {qIndex + 1}/{TRIVIA_QUESTIONS.length}</span>
        <span className="text-neon-blue font-bold">{score} pts</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-500"
          style={{ width: `${((qIndex + 1) / TRIVIA_QUESTIONS.length) * 100}%` }} />
      </div>
      <h3 className="text-base font-bold text-white leading-snug">{q.q}</h3>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => handleAnswer(i)}
            whileHover={selected === null ? { scale: 1.02 } : {}}
            whileTap={selected === null ? { scale: 0.98 } : {}}
            className="w-full text-left p-3 rounded-xl border text-sm font-medium transition-all"
            style={{
              background: selected === null
                ? "rgba(255,255,255,0.04)"
                : i === q.answer
                ? "rgba(57,255,20,0.15)"
                : i === selected
                ? "rgba(255,45,85,0.15)"
                : "rgba(255,255,255,0.02)",
              borderColor: selected === null
                ? "rgba(255,255,255,0.08)"
                : i === q.answer
                ? "rgba(57,255,20,0.5)"
                : i === selected
                ? "rgba(255,45,85,0.5)"
                : "rgba(255,255,255,0.04)",
              color: selected === null ? "rgba(255,255,255,0.8)" : i === q.answer ? "#39FF14" : i === selected ? "#FF2D55" : "rgba(255,255,255,0.4)",
              cursor: selected !== null ? "default" : "pointer",
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
      {done && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center p-4 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,107,0,0.1))" }}
        >
          <div className="text-3xl mb-1">🎉</div>
          <div className="text-lg font-black text-yellow-400">Final Score: {score}</div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Perfect Timing Game (Yorker Dodge) ──────────────────────────────────────
function PerfectTiming({ onComplete }: { onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(6);
  const [position, setPosition] = useState(50); // 0 to 100
  const [done, setDone] = useState(false);
  const [lastHit, setLastHit] = useState<"perfect" | "ok" | "miss" | null>(null);

  useEffect(() => {
    if (done) {
      setTimeout(() => onComplete(score), 1500);
      return;
    }
    let p = 0;
    let dir = 1;
    const interval = setInterval(() => {
      p += dir * 4;
      if (p >= 100) { p = 100; dir = -1; }
      if (p <= 0) { p = 0; dir = 1; }
      setPosition(p);
    }, 25);
    return () => clearInterval(interval);
  }, [done, score, onComplete]);

  const handleHit = () => {
    if (done) return;
    if (position >= 45 && position <= 55) {
      setScore((s) => s + 100);
      setLastHit("perfect");
    } else if (position >= 30 && position <= 70) {
      setScore((s) => s + 20);
      setLastHit("ok");
    } else {
      setLastHit("miss");
    }
    
    setTimeout(() => setLastHit(null), 800);

    setBallsLeft((b) => {
      if (b <= 1) { setDone(true); return 0; }
      return b - 1;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full text-white/50 text-sm font-bold">
        <span>Score: <span className="text-neon-blue">{score}</span></span>
        <span>Balls: <span className="text-white">{ballsLeft}/6</span></span>
      </div>

      <div className="w-full h-12 bg-black/40 rounded-full border border-white/10 relative overflow-hidden flex items-center shadow-inner">
        {/* Sweet spot */}
        <div className="absolute left-1/2 -translate-x-1/2 w-10 h-full bg-green-500/30 border-x border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
        {/* OK spot */}
        <div className="absolute left-1/2 -translate-x-1/2 w-32 h-full bg-yellow-500/10 border-x border-yellow-500/30" />
        
        {/* Moving Cursor */}
        <motion.div
          className="absolute w-4 h-16 bg-white rounded-full shadow-[0_0_10px_white] z-10"
          style={{ left: `calc(${position}% - 8px)` }}
        />
      </div>

      <div className="h-6">
        <AnimatePresence>
          {lastHit === "perfect" && <motion.div initial={{y: 10, opacity:0}} animate={{y:0, opacity:1}} exit={{opacity:0}} className="text-green-400 font-black text-xl">PERFECT HIT! +100</motion.div>}
          {lastHit === "ok" && <motion.div initial={{y: 10, opacity:0}} animate={{y:0, opacity:1}} exit={{opacity:0}} className="text-yellow-400 font-bold text-lg">GOOD HIT! +20</motion.div>}
          {lastHit === "miss" && <motion.div initial={{y: 10, opacity:0}} animate={{y:0, opacity:1}} exit={{opacity:0}} className="text-red-400 font-bold">MISSED!</motion.div>}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handleHit}
        whileTap={{ scale: 0.9 }}
        disabled={done}
        className="w-32 h-32 rounded-full glass-strong border border-neon-blue flex items-center justify-center font-black text-2xl text-white shadow-[0_0_30px_rgba(0,212,255,0.3)] disabled:opacity-50"
      >
        {done ? "DONE" : "SWING"}
      </motion.button>
    </div>
  );
}

// ─── Keeper Reflex Game ──────────────────────────────────────────────────────
function KeeperReflex({ onComplete }: { onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setDone(true); clearInterval(timer); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [done]);

  useEffect(() => {
    if (done) setTimeout(() => onComplete(score), 1500);
  }, [done, score, onComplete]);

  useEffect(() => {
    if (done) return;
    const spawn = () => {
      setDirection(Math.random() > 0.5 ? "left" : "right");
      setTimeout(() => setDirection(null), 600); // 600ms to react!
    };
    const interval = setInterval(spawn, 1200);
    return () => clearInterval(interval);
  }, [done]);

  const handleCatch = (dir: "left" | "right") => {
    if (done) return;
    if (direction === dir) {
      setScore((s) => s + 50);
      setDirection(null);
      setFeedback("good");
    } else {
      setScore((s) => Math.max(0, s - 20));
      setFeedback("bad");
    }
    setTimeout(() => setFeedback(null), 400);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full text-white/50 text-sm font-bold">
        <span>Score: <span className="text-neon-blue">{score}</span></span>
        <span>Time: <span className="text-white">{timeLeft}s</span></span>
      </div>

      <div className="h-32 w-full flex items-center justify-center relative bg-black/20 rounded-2xl border border-white/5">
        <AnimatePresence>
          {direction === "left" && (
            <motion.div initial={{ scale: 0, x: 20 }} animate={{ scale: 1, x: 0 }} exit={{ scale: 0, opacity: 0 }} className="absolute left-8 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_#ef4444]">
              <ArrowLeft className="text-white w-8 h-8" />
            </motion.div>
          )}
          {direction === "right" && (
            <motion.div initial={{ scale: 0, x: -20 }} animate={{ scale: 1, x: 0 }} exit={{ scale: 0, opacity: 0 }} className="absolute right-8 w-16 h-16 rounded-full bg-neon-blue flex items-center justify-center shadow-[0_0_20px_#00d4ff]">
              <ArrowRight className="text-white w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>

        {feedback === "good" && <div className="text-green-500 font-black text-2xl absolute">NICE CATCH!</div>}
        {feedback === "bad" && <div className="text-red-500 font-black text-xl absolute">MISS! -20</div>}
        {!direction && !feedback && !done && <div className="text-white/20 text-sm font-bold">READY...</div>}
        {done && <div className="text-yellow-400 font-black text-2xl absolute">TIME UP!</div>}
      </div>

      <div className="flex gap-8 w-full justify-center">
        <motion.button
          onClick={() => handleCatch("left")}
          whileTap={{ scale: 0.9 }}
          disabled={done}
          className="w-24 h-24 rounded-2xl glass border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
        >
          <ArrowLeft className="w-10 h-10" />
        </motion.button>
        <motion.button
          onClick={() => handleCatch("right")}
          whileTap={{ scale: 0.9 }}
          disabled={done}
          className="w-24 h-24 rounded-2xl glass border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
        >
          <ArrowRight className="w-10 h-10" />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Mini Games Hub ─────────────────────────────────────────────────────
const GAMES = [
  { id: "catch", name: "Catch The Ball", emoji: "🏏", desc: "Tap falling cricket balls!", color: "#00D4FF" },
  { id: "tap", name: "Tap Powerplay", emoji: "⚡", desc: "Fastest tapper wins!", color: "#A855F7" },
  { id: "timing", name: "Perfect Timing", emoji: "🎯", desc: "Hit the sweet spot!", color: "#39FF14" },
  { id: "reflex", name: "Keeper Reflex", emoji: "🧤", desc: "React left or right fast!", color: "#FF2D55" },
  { id: "trivia", name: "Trivia Blitz", emoji: "🧠", desc: "Test your cricket knowledge!", color: "#FF6B00" },
];

export default function MiniGames() {
  const { addXP, user, updateHighScore } = useAppStore();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleComplete = useCallback((score: number) => {
    setLastScore(score);
    addXP(score);
    if (activeGame) {
      updateHighScore(activeGame, score);
    }
    setTimeout(() => { setActiveGame(null); }, 2000);
  }, [addXP, updateHighScore, activeGame]);

  return (
    <div className="space-y-4" id="mini-games">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #39FF14, #00D4FF)" }}>
          <GamepadIcon className="w-5 h-5 text-black" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Mini Games</h2>
          <p className="text-xs text-white/40">Play, earn XP, climb the ranks!</p>
        </div>
      </div>

      {/* Game selection */}
      {!activeGame && (
        <div className="space-y-3">
          {lastScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-3 border border-lime-green/30 text-center"
            >
              <span className="text-lime-green font-bold text-sm">+{lastScore} XP earned! 🎉</span>
            </motion.div>
          )}
          {GAMES.map((game, i) => {
            const highscore = user.highScores?.[game.id] || 0;
            return (
              <motion.button
                key={game.id}
                onClick={() => { setActiveGame(game.id); setLastScore(null); }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/8 text-left group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: `${game.color}20`, border: `1px solid ${game.color}30` }}>
                  {game.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-bold text-white group-hover:text-neon-blue transition-colors">{game.name}</div>
                    {highscore > 0 && (
                      <div className="text-xs font-mono font-bold px-2 py-0.5 rounded-md" style={{ color: game.color, backgroundColor: `${game.color}15` }}>
                        High: {highscore}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{game.desc}</div>
                </div>
                <Zap className="w-5 h-5 text-white/20 group-hover:text-neon-blue transition-colors" />
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Active game */}
      <AnimatePresence mode="wait">
        {activeGame && (
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-3xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                {GAMES.find((g) => g.id === activeGame)?.name}
                <span className="text-xs font-mono text-white/30 px-2 py-0.5 rounded-full bg-white/5">
                  PB: {user.highScores?.[activeGame] || 0}
                </span>
              </h3>
              <button
                onClick={() => setActiveGame(null)}
                className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {activeGame === "catch" && <CatchTheBall onComplete={handleComplete} />}
            {activeGame === "tap" && <TapChallenge onComplete={handleComplete} />}
            {activeGame === "timing" && <PerfectTiming onComplete={handleComplete} />}
            {activeGame === "reflex" && <KeeperReflex onComplete={handleComplete} />}
            {activeGame === "trivia" && <TriviaBlitz onComplete={handleComplete} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
