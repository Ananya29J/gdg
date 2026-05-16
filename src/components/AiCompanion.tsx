"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, MessageSquare, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

function AiOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { match, heartbeatMode } = useAppStore();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    
    // Scale slightly on heartbeat
    if (heartbeatMode) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 8) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const baseColor = heartbeatMode ? "#FF2D55" : match.lastEvent === "six" ? "#A855F7" : "#00D4FF";

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.5}
        roughness={0.2}
        distort={heartbeatMode ? 0.6 : 0.4}
        speed={heartbeatMode ? 5 : 2}
      />
    </Sphere>
  );
}

export default function AiCompanion() {
  const { aiInsight, isAiOpen, setAiOpen } = useAppStore();

  return (
    <>
      {/* Floating Orb Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAiOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 w-16 h-16 rounded-full glass border border-white/20 shadow-[-10px_0_30px_rgba(0,212,255,0.3)] overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <AiOrb />
          </Canvas>
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-transparent transition-colors">
          <Brain className="w-6 h-6 text-white drop-shadow-md" />
        </div>
      </motion.button>

      {/* Insight Popup Tooltip (when closed) */}
      <AnimatePresence>
        {!isAiOpen && aiInsight && (
          <motion.div
            key={aiInsight}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-[110px] right-6 md:bottom-[100px] md:right-10 z-30 max-w-[240px] glass-card p-3 rounded-2xl rounded-br-sm border border-neon-blue/30 text-xs text-white shadow-[0_0_20px_rgba(0,212,255,0.15)] origin-bottom-right"
          >
            <div className="flex gap-2">
              <span className="text-neon-blue">✦</span>
              <p className="leading-relaxed">{aiInsight}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded AI Panel */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-32 z-50 w-[320px] max-w-[calc(100vw-32px)] glass-strong border border-neon-blue/40 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(0,212,255,0.15)]"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-neon-blue" />
                <span className="font-black text-white">PulseX AI</span>
              </div>
              <button 
                onClick={() => setAiOpen(false)}
                className="w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Insight */}
              <div className="glass p-4 rounded-2xl border border-neon-blue/20 bg-neon-blue/5">
                <div className="text-[10px] uppercase tracking-widest text-neon-blue mb-1 font-bold">Live Tactical Insight</div>
                <p className="text-sm text-white/90 leading-relaxed">{aiInsight}</p>
              </div>

              {/* Chat Input Mock */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask about player stats..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-neon-blue/50 transition-colors"
                  disabled
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-neon-blue transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {["Should I predict wicket?", "Kohli stats", "Win % chance"].map(q => (
                  <button key={q} className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
