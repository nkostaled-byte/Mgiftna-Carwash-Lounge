import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Clock, Award } from "lucide-react";
import { DINE_ITEMS, WASH_PACKAGES } from "../data";
import { DineItem, WashPackage, ScreenType } from "../types";

interface HomeViewProps {
  onNavigate: (screen: ScreenType, presetType?: "dine" | "wash" | string) => void;
  onSelectItem: (item: DineItem) => void;
  onSelectWash: (pkg: WashPackage) => void;
}

export default function HomeView({ onNavigate, onSelectItem, onSelectWash }: HomeViewProps) {
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  // Filter out featured or popular items for display
  const featuredItem = DINE_ITEMS.find((item) => item.isFeatured) || DINE_ITEMS[0];
  const popularDine = DINE_ITEMS.filter((item) => item.isPopular);

  return (
    <div className="space-y-6 pb-6 animate-fade-in" id="home-view-container">
      {/* Welcome & Title Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-3 px-4"
        id="home-welcome-section"
      >
        <span 
          className="text-amber-500 font-extrabold text-[8.5px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "'General Sans', sans-serif" }}
        >
          Exclusive Access
        </span>
        <h1 
          className="text-2xl font-black text-white tracking-tight mt-0.5"
          style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}
        >
          {greeting}
        </h1>
        <p 
          className="text-[#98989A] text-xs font-normal mt-1 leading-relaxed"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
        >
          Welcome to Mgiftna Carwash &amp; Lounge. Your dual sanctuary of culinary mastery and automotive perfection.
        </p>
      </motion.div>

      {/* Primary Action Buttons (Grid Layout for conversion) */}
      <div className="grid grid-cols-2 gap-3 px-4" id="home-primary-actions-grid">
        {/* Dine action card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("dine")}
          className="relative h-32 rounded-xl overflow-hidden cursor-pointer group border border-white/[0.04] shadow-md"
          id="action-card-dine"
        >
          {/* Background Image with dark overlay */}
          <div className="absolute inset-0 bg-black/65 z-10 transition-colors group-hover:bg-black/55" />
          <img
            src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=400&auto=format&fit=crop"
            alt="Lounge Dining"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Content */}
          <div className="absolute inset-0 z-20 p-3.5 flex flex-col justify-end">
            <span className="text-[8.5px] font-bold text-amber-500 uppercase tracking-widest leading-none mb-1">
              Culinary Lounge
            </span>
            <h2 
              className="text-[15px] font-black text-white leading-tight uppercase"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Reserve Table
            </h2>
            <div className="flex items-center gap-1 mt-2 text-[9.5px] font-bold text-amber-500/90 group-hover:text-amber-500 transition-colors">
              <span>EXPLORE</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Wash action card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("wash")}
          className="relative h-32 rounded-xl overflow-hidden cursor-pointer group border border-white/[0.04] shadow-md"
          id="action-card-wash"
        >
          {/* Background Image with dark overlay */}
          <div className="absolute inset-0 bg-black/65 z-10 transition-colors group-hover:bg-black/55" />
          <img
            src="https://res.cloudinary.com/dvvugpu04/image/upload/v1785164183/peeonelove-wash-5144821_moemys.jpg"
            alt="Car Detailing"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Content */}
          <div className="absolute inset-0 z-20 p-3.5 flex flex-col justify-end">
            <span className="text-[8.5px] font-bold text-amber-500 uppercase tracking-widest leading-none mb-1">
              Precision Detail
            </span>
            <h2 
              className="text-[15px] font-black text-white leading-tight uppercase"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Book Wash
            </h2>
            <div className="flex items-center gap-1 mt-2 text-[9.5px] font-bold text-amber-500/90 group-hover:text-amber-500 transition-colors">
              <span>PACKAGES</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tonight’s Feature - Premium Single Editorial Card */}
      <div className="px-4 space-y-2" id="home-feature-section">
        <h3 
          className="text-[9.5px] font-bold tracking-[0.2em] text-[#71717A] uppercase"
          style={{ fontFamily: "'General Sans', sans-serif" }}
        >
          Tonight's Feature
        </h3>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onSelectItem(featuredItem)}
          className="relative rounded-2xl overflow-hidden border border-white/[0.05] bg-[#111112] shadow-xl cursor-pointer group"
          id="home-feature-card"
        >
          {/* Image */}
          <div className="aspect-[16/10] w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-black/20 z-10" />
            <motion.img
              src={featuredItem.image}
              alt={featuredItem.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              initial={{ scale: 1.05, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {/* Absolute Badges on Image */}
            <div className="absolute top-3 left-3 z-20 bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded text-amber-500 text-[8px] font-bold uppercase tracking-wider">
              Chef's Choice
            </div>
          </div>

          {/* Card Meta Content */}
          <div className="p-4 space-y-1.5">
            <div className="flex justify-between items-baseline">
              <h4 
                className="text-base font-bold text-white group-hover:text-amber-500 transition-colors"
                style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}
              >
                {featuredItem.name}
              </h4>
              <span 
                className="text-base font-black text-amber-500"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                R{featuredItem.price}0
              </span>
            </div>
            <p 
              className="text-[#98989A] text-xs leading-relaxed line-clamp-2"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {featuredItem.description}
            </p>
            
            {/* Action text */}
            <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-bold text-neutral-400 group-hover:text-white transition-colors">
              <span>VIEW RECIPE &amp; DETAILS</span>
              <span className="text-amber-500 font-extrabold uppercase tracking-widest text-[9px]">
                ORDER NOW
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popular Menu - Compact Editorial List */}
      <div className="space-y-2.5" id="home-popular-menu-section">
        <div className="flex justify-between items-center px-4">
          <h3 
            className="text-[9.5px] font-bold tracking-[0.2em] text-[#71717A] uppercase"
            style={{ fontFamily: "'General Sans', sans-serif" }}
          >
            Popular Culinary Delights
          </h3>
          <button 
            onClick={() => onNavigate("dine")}
            className="text-[9px] font-bold tracking-wider text-amber-500 uppercase flex items-center gap-0.5 active:opacity-75"
          >
            <span>ALL</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Elegant Vertical List */}
        <div 
          className="space-y-3 px-4"
          id="popular-dine-list"
        >
          {popularDine.slice(0, 3).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectItem(item)}
              className="bg-[#111112] rounded-xl overflow-hidden border border-white/[0.04] p-3 flex gap-3 items-center cursor-pointer hover:border-white/[0.08]"
              id={`popular-item-${item.id}`}
            >
              <div className="w-[72px] h-[72px] rounded-lg overflow-hidden shrink-0 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 
                    className="text-xs font-bold text-white truncate"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {item.name}
                  </h4>
                  <span 
                    className="text-xs font-black text-amber-500 shrink-0"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    R{item.price}0
                  </span>
                </div>
                <p 
                  className="text-neutral-400 text-[10px] line-clamp-2 leading-relaxed"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Car Wash Packages - Vertical List */}
      <div className="space-y-2.5" id="home-car-wash-section">
        <div className="flex justify-between items-center px-4">
          <h3 
            className="text-[9.5px] font-bold tracking-[0.2em] text-[#71717A] uppercase"
            style={{ fontFamily: "'General Sans', sans-serif" }}
          >
            Bespoke Detailing Packages
          </h3>
          <button 
            onClick={() => onNavigate("wash")}
            className="text-[9px] font-bold tracking-wider text-amber-500 uppercase flex items-center gap-0.5 active:opacity-75"
          >
            <span>COMPARE</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Vertical Cards */}
        <div 
          className="space-y-3 px-4"
          id="wash-packages-list-home"
        >
          {WASH_PACKAGES.slice(0, 3).map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectWash(pkg)}
              className="bg-[#111112] rounded-xl overflow-hidden border border-white/[0.04] p-3.5 flex flex-col justify-between cursor-pointer hover:border-white/[0.08]"
              id={`popular-wash-${pkg.id}`}
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h4 
                    className="text-xs font-extrabold text-white uppercase tracking-tight"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {pkg.name}
                  </h4>
                  <div className="flex flex-col items-end shrink-0">
                    <span 
                      className="text-xs font-black text-amber-500"
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      R{pkg.price}
                    </span>
                    <span className="text-[8px] text-[#A3A3A3] font-semibold uppercase flex items-center gap-0.5 mt-0.5 leading-none">
                      <Clock className="w-2 h-2" />
                      {pkg.duration}
                    </span>
                  </div>
                </div>
                <p 
                  className="text-neutral-400 text-[10px] leading-relaxed line-clamp-2"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {pkg.description}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-white/[0.03] flex items-center justify-between text-[8.5px] font-bold text-amber-500/80 uppercase tracking-widest">
                <span>View Treatment Details</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
