import React from "react";
import { motion } from "motion/react";
import { Home, Utensils, Car, Calendar, MapPin, Music } from "lucide-react";
import { ScreenType } from "../types";

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems: { id: ScreenType; icon: React.ComponentType<any>; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "dine", icon: Utensils, label: "Dine" },
    { id: "wash", icon: Car, label: "Wash" },
    { id: "events", icon: Music, label: "Events" },
    { id: "book", icon: Calendar, label: "Book" },
    { id: "visit", icon: MapPin, label: "Visit" },
  ];

  return (
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[370px] z-40 select-none"
      id="app-bottom-nav-container"
    >
      <div 
        className="bg-[#0B0B0C]/90 backdrop-blur-2xl border border-white/[0.06] rounded-[24px] shadow-[0_12px_35px_rgba(0,0,0,0.85)] p-1 flex justify-between items-center"
        id="app-bottom-nav-inner"
      >
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center justify-center py-1 px-1 flex-1 cursor-pointer outline-none tap-highlight-transparent"
              id={`nav-tab-${item.id}`}
            >
              {/* Subtle active background capsule */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-capsule"
                  className="absolute inset-0 bg-white/[0.03] rounded-[18px] -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Centered Icon with subtle scale-lift on active */}
              <motion.div
                animate={{
                  y: isActive ? -1 : 0,
                  scale: isActive ? 1.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`${isActive ? "text-[#F59E0B]" : "text-neutral-500 hover:text-neutral-300"} transition-colors`}
              >
                <IconComponent className="w-[18px] h-[18px] stroke-[2]" />
              </motion.div>

              {/* Minimal Label */}
              <span
                className={`text-[7.5px] font-bold tracking-[0.1em] mt-1 transition-colors duration-200 ${
                  isActive ? "text-[#F59E0B]" : "text-neutral-500"
                }`}
                style={{ fontFamily: "'General Sans', 'Satoshi', sans-serif" }}
              >
                {item.label}
              </span>

              {/* Active miniature dot below */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-dot"
                  className="absolute bottom-0 w-0.5 h-0.5 rounded-full bg-[#F59E0B]"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

