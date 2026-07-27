import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ShieldCheck, CheckCircle2, X, Calendar, ChevronRight } from "lucide-react";
import { WASH_PACKAGES } from "../data";
import { WashPackage } from "../types";
import OptimizedImage from "./OptimizedImage";

interface WashViewProps {
  selectedWash: WashPackage | null;
  onSelectWash: (pkg: WashPackage | null) => void;
  onNavigateToBook: (presetType: "dine" | "wash", selectedPackage?: string) => void;
}

export default function WashView({ selectedWash, onSelectWash, onNavigateToBook }: WashViewProps) {
  return (
    <div className="space-y-4 pb-6 px-4 animate-fade-in" id="wash-view-container">
      {/* Title Header */}
      <div className="pt-1.5" id="wash-title-section">
        <span className="text-amber-500 font-extrabold text-[8.5px] uppercase tracking-[0.25em]" style={{ fontFamily: "'General Sans', sans-serif" }}>
          Precision Automotive Care
        </span>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5" style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}>
          Bespoke Detailing
        </h1>
        <p className="text-neutral-500 text-[11.5px] mt-1 leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          Hand-crafted mechanical cleanses, paint purification, and professional-grade multi-year ceramic protection.
        </p>
      </div>

      {/* Package Comparative Cards */}
      <div className="space-y-4" id="wash-packages-list">
        {WASH_PACKAGES.map((pkg) => {
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              onClick={() => onSelectWash(pkg)}
              className="bg-[#111112] rounded-xl overflow-hidden border border-white/[0.04] shadow-md cursor-pointer p-3.5 relative group space-y-3"
              id={`wash-pkg-card-${pkg.id}`}
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                <OptimizedImage
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  isBelowFold={true}
                  priority="low"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111112]/80 to-transparent pointer-events-none" />
              </div>

              <div className="flex justify-between items-start pt-1">
                <div className="space-y-0.5">
                  {pkg.isPopular && (
                    <span className="inline-flex items-center bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mb-0.5">
                      Highly Recommended
                    </span>
                  )}
                  <h3 
                    className="text-sm font-extrabold text-white uppercase tracking-tight group-hover:text-[#F59E0B] transition-colors"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {pkg.name}
                  </h3>
                </div>

                <div className="flex flex-col items-end">
                  <span 
                    className="text-sm font-black text-[#F59E0B]"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    R{pkg.price}
                  </span>
                  <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-neutral-500" />
                    {pkg.duration}
                  </span>
                </div>
              </div>

              <p 
                className="text-neutral-400 text-[11px] leading-relaxed"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {pkg.description}
              </p>

              <div className="space-y-1.5 pt-1.5" id={`wash-highlights-${pkg.id}`}>
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block">
                  Key Treatment Stages:
                </span>
                <ul className="space-y-1">
                  {pkg.features.slice(0, 3).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B]/70 shrink-0 stroke-[2]" />
                      <span className="line-clamp-1" style={{ fontFamily: "'Satoshi', sans-serif" }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                {pkg.features.length > 3 && (
                  <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-wide flex items-center gap-0.5 group-hover:text-amber-500 pt-0.5 transition-colors">
                    <span>View all {pkg.features.length} features</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FULLSCREEN WASH DETAILS OVERLAY (Premium aesthetic slide-up) */}
      <AnimatePresence>
        {selectedWash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 overflow-y-auto scrollbar-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
            style={{ scrollbarWidth: "none" }}
            id="wash-detail-overlay"
          >
            {/* Close Button */}
            <button
              onClick={() => onSelectWash(null)}
              className="fixed top-[calc(1rem+env(safe-area-inset-top))] right-[calc(1rem+env(safe-area-inset-right))] z-50 bg-black/60 hover:bg-neutral-900 active:scale-95 text-white w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all duration-200 cursor-pointer"
              id="wash-detail-close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Container */}
            <div className="w-full max-w-lg mx-auto bg-[#0A0A0A] min-h-[100dvh] pb-[calc(6rem+env(safe-area-inset-bottom))] relative" id="wash-detail-content">
              {/* Cinematic Cover Image */}
              <div className="relative h-[38vh] w-full">
                <OptimizedImage
                  src={selectedWash.image}
                  alt={selectedWash.name}
                  className="w-full h-full object-cover"
                  isBelowFold={true}
                  priority="low"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/35" />
              </div>

              {/* Package detailed list body */}
              <div className="px-5 space-y-4 -mt-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedWash.duration}
                    </span>
                    {selectedWash.isPopular && (
                      <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-start gap-3 pt-0.5">
                    <h2 
                      className="text-lg font-black text-white uppercase tracking-tight leading-tight"
                      style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}
                    >
                      {selectedWash.name}
                    </h2>
                    <span 
                      className="text-lg font-black text-amber-500 animate-pulse"
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      R{selectedWash.price}0
                    </span>
                  </div>
                </div>

                {/* Treatment description */}
                <div className="space-y-1.5 border-t border-white/[0.04] pt-4" id="wash-detail-description">
                  <h4 className="text-[9.5px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    Treatment Overview
                  </h4>
                  <p 
                    className="text-[#D1D1D6] text-xs leading-relaxed"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {selectedWash.description}
                  </p>
                </div>

                {/* Deep-Cleansing features list */}
                <div className="space-y-2 border-t border-white/[0.04] pt-4" id="wash-detail-features">
                  <h4 className="text-[9.5px] font-bold text-neutral-400 uppercase tracking-widest block">
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {selectedWash.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 stroke-[2] mt-0.5" />
                        <span style={{ fontFamily: "'Satoshi', sans-serif" }} className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* STICKY BOTTOM BOOKING CTA */}
              <div 
                className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black to-black/90 border-t border-[#1F1F1F]/80 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex justify-center"
                id="wash-detail-sticky-cta"
              >
                <div className="w-full max-w-md">
                  <button
                    onClick={() => {
                      onSelectWash(null);
                      onNavigateToBook("wash", selectedWash.name);
                    }}
                    className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.99] text-black font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                    id="wash-detail-book-btn"
                  >
                    <Calendar className="w-3.5 h-3.5 fill-black" />
                    <span>Book wash treatment</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
