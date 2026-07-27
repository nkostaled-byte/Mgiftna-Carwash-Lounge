import React from "react";
import { Menu } from "lucide-react";
import { ScreenType } from "../types";

interface HeaderProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenMenu: () => void;
}

export default function Header({ onNavigate, onOpenMenu }: HeaderProps) {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1A1A1A]/80 h-14 flex items-center justify-between px-4 transition-all duration-300 select-none"
      id="app-header"
    >
      {/* Brand Section */}
      <div 
        className="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity"
        onClick={() => onNavigate("home")}
        id="header-brand"
      >
        {/* Logo */}
        <img
          src="https://res.cloudinary.com/dvvugpu04/image/upload/v1785159774/Mgiftnana_logo_uvjolg.png"
          alt="Mgiftana Logo"
          className="w-8 h-8 rounded-md object-cover"
          id="header-logo"
        />
        
        {/* Brand Text */}
        <div className="flex flex-col justify-center" id="header-title-container">
          <span 
            className="text-[13px] font-black leading-none tracking-tight text-white uppercase"
            style={{ fontFamily: "'Satoshi', 'General Sans', sans-serif" }}
          >
            Mgiftna
          </span>
          <span 
            className="text-[8px] text-[#A3A3A3] font-semibold uppercase tracking-[0.12em] leading-none mt-0.5"
            style={{ fontFamily: "'General Sans', sans-serif" }}
          >
            Carwash &amp; Lounge
          </span>
        </div>
      </div>

      {/* Navigation CTA / Menu Triggers */}
      <div className="flex items-center gap-2.5" id="header-actions">
        {/* Primary CTA */}
        <button
          onClick={() => onNavigate("book")}
          className="bg-[#F59E0B] hover:bg-[#D97706] active:scale-95 text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(245,158,11,0.15)] whitespace-nowrap"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          id="header-book-btn"
        >
          BOOK
        </button>

        {/* Hamburger Menu Trigger */}
        <button
          onClick={onOpenMenu}
          className="text-neutral-400 hover:text-white active:scale-90 p-1 transition-all duration-200"
          aria-label="Toggle menu"
          id="header-menu-btn"
        >
          <Menu className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </header>
  );
}
