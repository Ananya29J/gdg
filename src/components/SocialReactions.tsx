"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SmilePlus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const EMOJIS = ["🔥", "👏", "🤯", "🚀", "💀", "💙", "❤️"];

export default function SocialReactions() {
  const { reactions, addReaction, match, heartbeatMode } = useAppStore();

  return (
    <>
      {/* Floating emojis layer */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: "100vh", x: `${r.x}vw`, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: "-10vh", 
                x: [`${r.x}vw`, `${r.x + (r.id.length % 10 - 5)}vw`],
                scale: [0.5, 1.5, 1] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute text-4xl"
              style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tense heartbeat overlay effect */}
      <AnimatePresence>
        {heartbeatMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="fixed inset-0 pointer-events-none z-10 bg-red-500/20"
          />
        )}
      </AnimatePresence>

      {/* Desktop reaction bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/10">
        <div className="flex items-center gap-2 pr-2 border-r border-white/10">
          <SmilePlus className="w-5 h-5 text-white/50" />
          <span className="text-xs font-bold text-white/50 uppercase tracking-widest">React</span>
        </div>
        {EMOJIS.map((e) => (
          <motion.button
            key={e}
            onClick={() => addReaction(e)}
            whileHover={{ scale: 1.2, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-white/5 rounded-full transition-colors"
          >
            {e}
          </motion.button>
        ))}
      </div>

      {/* Mobile mini reaction button (opens drawer/sheet in a full app, here just fires random) */}
      <motion.button
        onClick={() => addReaction(EMOJIS[Math.floor(Math.random() * EMOJIS.length)])}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 left-4 z-40 md:hidden w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      >
        <SmilePlus className="w-6 h-6 text-white" />
      </motion.button>
    </>
  );
}
