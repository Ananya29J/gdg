"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useLiveSimulation } from "@/hooks/useLiveSimulation";
import FloatingNavbar from "@/components/FloatingNavbar";
import AiCompanion from "@/components/AiCompanion";
import SocialReactions from "@/components/SocialReactions";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
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

  // Start the live simulation engine globally
  useLiveSimulation();

  return (
    <div className="relative min-h-screen bg-deep-space overflow-hidden pb-24 md:pb-0">
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

      <div className="relative z-10 pt-24 md:pt-32">
        {children}
      </div>
    </div>
  );
}
