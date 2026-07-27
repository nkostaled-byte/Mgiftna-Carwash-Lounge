import React from "react";
import { motion } from "motion/react";
import { X, ArrowUpRight, Smartphone, Compass, ShieldAlert, Award, Instagram, Flame, Info } from "lucide-react";
import { BUSINESS_DETAILS } from "../data";
import { ScreenType } from "../types";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export default function MenuOverlay({ isOpen, onClose, onNavigate }: MenuOverlayProps) {
  if (!isOpen) return null;

  const handleLinkClick = (screen: ScreenType) => {
    onNavigate(screen);
    onClose();
  };

  const navLinks = [
    { label: "Exclusive Home", screen: "home", desc: "Your primary dashboard" },
    { label: "Culinary Lounge", screen: "dine", desc: "Fine grills & signature craft pours" },
    { label: "Precision Detailing", screen: "wash", desc: "Automotive preservation treatments" },
    { label: "Lounge Events", screen: "events", desc: "Private member gatherings & tastings" },
    { label: "Priority Reservation", screen: "book", desc: "Secure table or detailing slot" },
    { label: "Visit Sanctuary", screen: "visit", desc: "Clayville maps, hours, & voice dials" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/98 z-50 overflow-y-auto scrollbar-none flex flex-col justify-between pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] pl-[calc(1.5rem+env(safe-area-inset-left))] pr-[calc(1.5rem+env(safe-area-inset-right))] select-none"
      style={{ scrollbarWidth: "none" }}
      id="menu-fullscreen-overlay"
    >
      {/* Top Header bar inside Menu */}
      <div className="flex justify-between items-center h-16 shrink-0" id="menu-overlay-header">
        <div className="flex items-center gap-2.5">
          <img
            src="https://res.cloudinary.com/dvvugpu04/image/upload/v1785159774/Mgiftnana_logo_uvjolg.png"
            alt="Mgiftana Logo"
            className="w-8 h-8 rounded-lg object-cover"
            decoding="async"
            loading="lazy"
            fetchPriority="low"
          />
          <span className="text-xs font-black uppercase tracking-widest text-[#A3A3A3]">
            Mgiftana VIP Portal
          </span>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-2 bg-white/[0.03] rounded-full border border-white/[0.05] active:scale-90 transition-all cursor-pointer"
          id="menu-overlay-close-btn"
        >
          <X className="w-5.5 h-5.5" />
        </button>
      </div>

      {/* Main Luxury Navigation list */}
      <div className="my-auto py-10 space-y-8" id="menu-navigation-container">
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.25em] block">
            Navigation Directory
          </span>
          <nav className="flex flex-col gap-6" id="menu-fullscreen-nav">
            {navLinks.map((link, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                onClick={() => handleLinkClick(link.screen as any)}
                className="group cursor-pointer flex items-center justify-between border-b border-white/[0.03] pb-4"
                id={`menu-item-${link.screen}`}
              >
                <div className="space-y-1">
                  <h3 
                    className="text-2xl font-black text-white group-hover:text-amber-500 uppercase tracking-tight transition-colors"
                    style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}
                  >
                    {link.label}
                  </h3>
                  <p className="text-neutral-500 text-xs font-medium" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {link.desc}
                  </p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-neutral-600 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </motion.div>
            ))}
          </nav>
        </div>

        {/* PWA INTEGRATION: Install Prompt Container */}
      </div>

      {/* Footer Details, Social and Signatures */}
      <div className="space-y-6 shrink-0 border-t border-white/[0.04] pt-6 text-xs text-neutral-500" id="menu-overlay-footer">
        {/* Social Grid and details */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider text-[10px]"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>Instagram</span>
            </a>
            <span className="text-neutral-800">|</span>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider text-[10px]"
            >
              <Compass className="w-4 h-4 text-[#F59E0B]" />
              <span>Visit Us</span>
            </a>
          </div>

          <span className="text-[10px] font-bold uppercase text-neutral-600 tracking-wider">
            Clayville, ZA
          </span>
        </div>

        {/* Brand signature block */}
        <div className="flex justify-between items-end" id="menu-overlay-brand-block">
          <div className="space-y-1 text-left">
            <h5 className="text-[11px] font-bold text-white uppercase tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {BUSINESS_DETAILS.name}
            </h5>
            <p className="text-[10px] text-neutral-600 font-medium leading-none">
              The Art of Culinary Lounge &amp; Automotive Detail
            </p>
          </div>
          
          <div className="text-right text-[9px] text-neutral-600 font-bold uppercase tracking-widest leading-none">
            MGX OS 2.1 • © 2026
          </div>
        </div>
      </div>
    </motion.div>
  );
}
