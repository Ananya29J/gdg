"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useAppStore } from "@/store/useAppStore";
import { useLiveSimulation } from "@/hooks/useLiveSimulation";
import HeroSection from "@/components/HeroSection";
import FloatingNavbar from "@/components/FloatingNavbar";
import LiveMatchPulse from "@/components/LiveMatchPulse";
import PredictionEngine from "@/components/PredictionEngine";
import LiveLeaderboard from "@/components/LiveLeaderboard";
import MiniGames from "@/components/MiniGames";
import AiCompanion from "@/components/AiCompanion";
import FullScorecard from "@/components/FullScorecard";
import SocialReactions from "@/components/SocialReactions";

export default function Home() {
  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Start the live simulation engine
  useLiveSimulation();

  const { activeTab } = useAppStore();

  return (
    <main className="relative min-h-screen bg-deep-space overflow-hidden pb-24 md:pb-0">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-screen opacity-30" 
             style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,212,255,0.15), transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-full h-screen opacity-20" 
             style={{ background: "radial-gradient(circle at 100% 100%, rgba(168,85,247,0.15), transparent 70%)" }} />
      </div>

      <FloatingNavbar />
      <SocialReactions />
      <AiCompanion />

      {/* Hero Section (Always visible at top, scrolls out) */}
      <HeroSection />

      {/* Main Dashboard Layout */}
      <div id="main-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Live Pulse & Mini Games */}
          <div className={`lg:col-span-7 space-y-8 ${activeTab === 'predict' || activeTab === 'leaderboard' ? 'hidden lg:block' : ''}`}>
            <LiveMatchPulse />
            {activeTab === 'games' && <div className="lg:hidden"><MiniGames /></div>}
            <div className="hidden lg:block"><MiniGames /></div>
            <FullScorecard />
          </div>

          {/* Right Column: Predictions & Leaderboard */}
          <div className={`lg:col-span-5 space-y-8 ${activeTab === 'pulse' || activeTab === 'games' ? 'hidden lg:block' : ''}`}>
            <PredictionEngine />
            <LiveLeaderboard />
          </div>

        </div>
      </div>
    </main>
  );
}
