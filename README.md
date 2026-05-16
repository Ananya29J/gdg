# PulseX 🏏⚡

PulseX is a **Next-Gen IPL Fan Engagement Platform** built for Google Developer Groups (GDG). It transforms the traditional "second screen" cricket viewing experience into a highly interactive, gamified, and cinematic digital arena.

## 🌟 Key Features

* **Live Simulation Engine:** A deterministic, client-side engine that simulates a live T20 cricket match ball-by-ball, complete with tension mechanics, win probabilities, and dynamic commentary.
* **Tinder-Style Predictions:** Swipe on dynamic, high-stakes predictions (e.g., "Will the next ball be a six?", "Who wins the match?"). Correct predictions instantly update your global XP.
* **Real-Time Leaderboard:** A fully reactive global ranking system. As fans earn XP through predictions and mini-games, they dynamically climb the ranks in real-time.
* **Mini-Games Arcade:** Built-in casual games to keep fans engaged during timeouts and innings breaks:
  * 🎯 **Perfect Timing (Yorker Dodge):** A reflex timing game to hit the sweet spot.
  * 🧤 **Keeper Reflex:** A split-second directional reaction game.
  * ⚡ **Tap Powerplay:** A frenetic screen-tapping challenge.
  * 🏏 **Catch The Ball:** An arcade-style falling object catcher.
  * 🧠 **Trivia Blitz:** A rapid-fire IPL knowledge test.
* **AI Match Companion:** An integrated context-aware 3D AI companion that analyzes current match momentum, player strike rates, and tension levels to provide actionable insights.
* **Global Social Reactions:** A floating barrage of emojis synced to the live match feed.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS (Custom Neon-Dark aesthetic)
* **Animations:** Framer Motion (Pop layouts, springs, and orchestrated sequences)
* **State Management:** Zustand (Global immutable state synced across components)
* **Scroll Engine:** Lenis (Smooth, inertial scrolling)
* **Icons:** Lucide React

## 🤝 Next Steps for Production

This codebase is currently architected as a high-fidelity prototype utilizing a local simulation engine for demonstration purposes. To take this to production:
1. Replace the `useLiveSimulation.ts` engine with WebSockets connected to a live sports data provider (e.g., Sportradar, Cricbuzz API).
2. Integrate **Firebase Firestore / Realtime Database** to persist the `Leaderboard` and broadcast `Social Reactions` globally across all connected clients.
