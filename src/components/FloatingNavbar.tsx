"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, GamepadIcon, Users, Brain, Menu, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { id: "pulse", label: "Live Pulse", icon: Zap, color: "#00D4FF", path: "/" },
  { id: "predict", label: "Predict", icon: Trophy, color: "#A855F7", path: "/predictions" },
  { id: "leaderboard", label: "Leaders", icon: Users, color: "#FF6B00", path: "/leaderboard" },
  { id: "games", label: "Games", icon: GamepadIcon, color: "#39FF14", path: "/games" },
  { id: "ai", label: "AI Coach", icon: Brain, color: "#FF2D55", path: "/#" },
];

export default function FloatingNavbar() {
  const pathname = usePathname();
  const { setAiOpen } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Determine active tab based on pathname
  const activeTab = NAV_ITEMS.find(item => item.path === pathname)?.id || "pulse";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    if (item.id === 'ai') {
      setAiOpen(true);
      return;
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop floating nav */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block",
          "rounded-2xl transition-all duration-500",
          scrolled
            ? "glass-strong border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
            : "glass border border-white/8"
        )}
      >
        <div className="flex items-center gap-1 px-3 py-2">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-1 mr-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00D4FF, #A855F7)" }}>
              <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
            </div>
            <span className="font-black text-sm tracking-tight text-gradient-neon">PulseX</span>
          </div>

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Nav items */}
          {NAV_ITEMS.map((item) => (
            <Link key={item.id} href={item.path} onClick={() => handleNavClick(item)}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer",
                  activeTab === item.id ? "text-white" : "text-white/50 hover:text-white/80"
                )}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-3.5 h-3.5 relative z-10" style={{ color: activeTab === item.id ? item.color : "currentColor" }} />
                <span className="relative z-10">{item.label}</span>
                {activeTab === item.id && (
                  <motion.span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </Link>
          ))}

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 tracking-wider">LIVE</span>
          </div>
        </div>
      </motion.nav>

      {/* Mobile top bar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden glass-strong border-b border-white/8"
      >
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00D4FF, #A855F7)" }}>
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-black text-base text-gradient-neon">PulseX</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400">LIVE</span>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg glass border border-white/10"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/8"
            >
              <div className="p-3 grid grid-cols-3 gap-2">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.id} href={item.path} onClick={() => handleNavClick(item)}>
                    <div
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                        activeTab === item.id ? "text-white" : "text-white/50"
                      )}
                      style={{
                        background: activeTab === item.id ? `${item.color}20` : "transparent",
                        border: `1px solid ${activeTab === item.id ? item.color + "40" : "transparent"}`,
                      }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile bottom dock */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-strong border-t border-white/10 safe-area-pb"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.id} href={item.path} onClick={() => handleNavClick(item)}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl min-w-[56px] cursor-pointer"
              >
                <div className="relative">
                  <item.icon
                    className="w-5 h-5 transition-all duration-300"
                    style={{ color: activeTab === item.id ? item.color : "rgba(255,255,255,0.35)" }}
                  />
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="dock-indicator"
                      className="absolute -inset-2 rounded-xl -z-10"
                      style={{ background: `${item.color}15` }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] font-semibold transition-colors duration-300"
                  style={{ color: activeTab === item.id ? item.color : "rgba(255,255,255,0.35)" }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
}
