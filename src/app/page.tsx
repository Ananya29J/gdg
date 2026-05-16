"use client";

import HeroSection from "@/components/HeroSection";
import LiveMatchPulse from "@/components/LiveMatchPulse";
import FullScorecard from "@/components/FullScorecard";

export default function Home() {
  return (
    <>
      {/* Hero Section (Always visible at top, scrolls out) */}
      <HeroSection />

      {/* Main Dashboard Layout */}
      <div id="main-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Live Pulse */}
          <div className="lg:col-span-7 space-y-8">
            <LiveMatchPulse />
          </div>

          {/* Right Column: Scorecard */}
          <div className="lg:col-span-5 space-y-8">
            <FullScorecard />
          </div>

        </div>
      </div>
    </>
  );
}
