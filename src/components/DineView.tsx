import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, ChefHat, Leaf, Coins } from "lucide-react";
import { DINE_ITEMS } from "../data";
import { DineItem, DineCategory } from "../types";

interface DineViewProps {
  selectedItem: DineItem | null;
  onSelectItem: (item: DineItem | null) => void;
  onNavigateToBook: (presetType: "dine" | "wash", selectedMeal?: string) => void;
}

export default function DineView({ selectedItem, onSelectItem, onNavigateToBook }: DineViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<DineCategory | "all">("all");

  const categories: { id: DineCategory | "all"; label: string }[] = [
    { id: "all", label: "All Curations" },
    { id: "grills", label: "Flame Grills" },
    { id: "platters", label: "Grand Platters" },
    { id: "cocktails", label: "Artisanal Cocktails" },
    { id: "desserts", label: "Fine Desserts" },
    { id: "wine", label: "Reserve Wines" },
  ];

  // Filter items
  const filteredItems = selectedCategory === "all"
    ? DINE_ITEMS
    : DINE_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-4 pb-6 px-4 animate-fade-in" id="dine-view-container">
      {/* Title Header */}
      <div className="pt-1.5" id="dine-title-section">
        <span className="text-amber-500 font-extrabold text-[8.5px] uppercase tracking-[0.25em]" style={{ fontFamily: "'General Sans', sans-serif" }}>
          Culinary Excellence
        </span>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5" style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}>
          The Lounge Menu
        </h1>
        <p className="text-neutral-500 text-[11.5px] mt-1 leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          Artisanal charcoal-cooked gastronomy, luxury shareables, and rare curated liquors.
        </p>
      </div>

      {/* Horizontal Category Chips */}
      <div 
        className="flex gap-1.5 overflow-x-auto pb-1.5 -mx-4 px-4 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
        id="dine-categories-scroll"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                isActive
                  ? "bg-[#F59E0B] text-black border-[#F59E0B] shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
                  : "bg-[#111112] text-neutral-400 border-white/[0.04] hover:text-white"
              }`}
              style={{ fontFamily: "'General Sans', sans-serif" }}
              id={`dine-chip-${cat.id}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 gap-4" id="dine-items-grid">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            layoutId={`dine-item-card-${item.id}`}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectItem(item)}
            className="bg-[#111112] rounded-xl overflow-hidden border border-white/[0.04] shadow-md cursor-pointer group"
            id={`dine-item-card-${item.id}`}
          >
            {/* Image Wrap */}
            <div className="aspect-[16/10] w-full relative overflow-hidden">
              <motion.img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                initial={{ scale: 1.05, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
              
              {/* Dynamic tag if popular/featured */}
              {item.isPopular && (
                <div className="absolute top-3 left-3 bg-[#F59E0B] text-black px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest shadow-md">
                  Highly Coveted
                </div>
              )}

              {/* Price Tag pinned to bottom right of image */}
              <div 
                className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[#F59E0B] text-[11px] font-black"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                R{item.price}0
              </div>
            </div>

            {/* Title & Body Meta */}
            <div className="p-3.5 space-y-1">
              <h3 
                className="text-sm font-extrabold text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {item.name}
              </h3>
              <p 
                className="text-neutral-400 text-[11px] leading-relaxed line-clamp-2"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FULLSCREEN FOOD DETAILS OVERLAY (Uber Eats / Airbnb Style) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 overflow-y-auto scrollbar-none"
            style={{ scrollbarWidth: "none" }}
            id="dine-detail-overlay"
          >
            {/* Back Arrow button */}
            <button
              onClick={() => onSelectItem(null)}
              className="fixed top-4 right-4 z-50 bg-black/60 hover:bg-neutral-900 active:scale-95 text-white p-1.5 rounded-full backdrop-blur-md border border-white/10 transition-all duration-200"
              id="dine-detail-close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Immersive visual content */}
            <div className="w-full max-w-lg mx-auto bg-[#0A0A0A] min-h-screen pb-24 relative" id="dine-detail-content">
              {/* Header Cinematic Banner */}
              <div className="relative h-[38vh] w-full">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />
              </div>

              {/* Culinary details body */}
              <div className="px-5 space-y-4 -mt-4 relative z-10">
                {/* Title and Pricing Header */}
                <div className="space-y-1" id="dine-detail-title-block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                      {selectedItem.category}
                    </span>
                    {selectedItem.isPopular && (
                      <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                        Signature
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-start gap-3">
                    <h2 
                      className="text-lg font-black text-white uppercase tracking-tight leading-tight"
                      style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}
                    >
                      {selectedItem.name}
                    </h2>
                    <span 
                      className="text-lg font-black text-amber-500 whitespace-nowrap"
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      R{selectedItem.price}0
                    </span>
                  </div>
                </div>

                {/* Gastronomic Description */}
                <div className="space-y-1.5 border-t border-white/[0.04] pt-4" id="dine-detail-description">
                  <h4 className="text-[9.5px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <ChefHat className="w-3 h-3 text-amber-500" />
                    Curator Notes
                  </h4>
                  <p 
                    className="text-[#D1D1D6] text-xs leading-relaxed"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {selectedItem.description}
                  </p>
                </div>

                {/* Handcrafted Ingredients */}
                <div className="space-y-2 border-t border-white/[0.04] pt-4" id="dine-detail-ingredients">
                  <h4 className="text-[9.5px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-amber-500" />
                    Ingredients &amp; Accoutrements
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-[#111112] text-neutral-300 px-2.5 py-1 rounded-lg text-[10.5px] font-medium border border-white/[0.03]"
                        style={{ fontFamily: "'Satoshi', sans-serif" }}
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom Booking Promo Sheet */}
                <div className="bg-[#111112] border border-white/[0.04] rounded-xl p-3 flex gap-3 items-center" id="dine-detail-promo">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                      Experience It Live
                    </h5>
                    <p className="text-neutral-500 text-[9.5px] leading-relaxed mt-0.5" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                      Reserve a table and enjoy this luxury plate cooked fresh in our charcoal ovens.
                    </p>
                  </div>
                </div>
              </div>

              {/* STICKY BOTTOM RESERVATION CTA */}
              <div 
                className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black to-black/90 border-t border-[#1F1F1F]/80 p-3 flex justify-center"
                id="dine-detail-sticky-cta"
              >
                <div className="w-full max-w-md">
                  <button
                    onClick={() => {
                      onSelectItem(null);
                      onNavigateToBook("dine", selectedItem.name);
                    }}
                    className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.99] text-black font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                    id="dine-detail-book-table-btn"
                  >
                    <Calendar className="w-3.5 h-3.5 fill-black" />
                    <span>Reserve table for this</span>
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
