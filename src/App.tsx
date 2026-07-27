import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import HomeView from "./components/HomeView";
import DineView from "./components/DineView";
import WashView from "./components/WashView";
import EventsView from "./components/EventsView";
import BookView from "./components/BookView";
import VisitView from "./components/VisitView";
import MenuOverlay from "./components/MenuOverlay";
import { InstallPrompt } from "./components/InstallPrompt";
import DesktopLayout from "./components/DesktopLayout";
import { DineItem, WashPackage, ScreenType } from "./types";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Selected detail item states (for fullscreen overlay drawers)
  const [selectedDineItem, setSelectedDineItem] = useState<DineItem | null>(null);
  const [selectedWashPackage, setSelectedWashPackage] = useState<WashPackage | null>(null);

  // Preset slots passed dynamically when selecting "Reserve" or "Book" on product drawers
  const [bookingPresetType, setBookingPresetType] = useState<"dine" | "wash">("dine");
  const [bookingPresetItemName, setBookingPresetItemName] = useState("");

  // Custom Navigation coordinator that clears presets if navigated manually
  const handleNavigate = (screen: ScreenType, presetType?: "dine" | "wash" | string, selectedItemName?: string) => {
    setCurrentScreen(screen);
    
    if (presetType && selectedItemName) {
      setBookingPresetType(presetType as "dine" | "wash");
      setBookingPresetItemName(selectedItemName);
    }
    
    // Scroll view container smoothly to top when switching screens
    const scrollContainer = document.getElementById("pwa-scroll-viewport");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Helper to trigger booking from subviews with presets
  const handlePresetBooking = (type: "dine" | "wash", selectedExperienceName?: string) => {
    handleNavigate("book", type, selectedExperienceName);
  };

  const handleClearPresets = () => {
    setBookingPresetItemName("");
  };

  // Render active component view
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeView
            onNavigate={(screen, presetType) => handleNavigate(screen, presetType)}
            onSelectItem={(item) => {
              setSelectedDineItem(item);
              setCurrentScreen("dine");
            }}
            onSelectWash={(pkg) => {
              setSelectedWashPackage(pkg);
              setCurrentScreen("wash");
            }}
          />
        );
      case "dine":
        return (
          <DineView
            selectedItem={selectedDineItem}
            onSelectItem={setSelectedDineItem}
            onNavigateToBook={handlePresetBooking}
          />
        );
      case "wash":
        return (
          <WashView
            selectedWash={selectedWashPackage}
            onSelectWash={setSelectedWashPackage}
            onNavigateToBook={handlePresetBooking}
          />
        );
      case "events":
        return (
          <EventsView
            onNavigateToBook={handlePresetBooking}
          />
        );
      case "book":
        return (
          <BookView
            initialType={bookingPresetType}
            initialItemName={bookingPresetItemName}
            onClearPresets={handleClearPresets}
          />
        );
      case "visit":
        return <VisitView />;
      default:
        return <HomeView onNavigate={(screen) => handleNavigate(screen)} onSelectItem={setSelectedDineItem} onSelectWash={setSelectedWashPackage} />;
    }
  };

  return (
    <>
      {/* Dedicated Editorial Desktop Experience (Screens >= 1024px) */}
      <DesktopLayout />

      {/* Untouched Mobile & Tablet Experience (Screens < 1024px) */}
      <div className="lg:hidden min-h-screen w-full bg-[#030303] flex items-center justify-center py-0 md:py-10 selection:bg-amber-500/30 select-none">
        
        {/* 
          iPhone 16 Pro mockup on screen resolutions md and above.
          This provides a flawless high-fidelity presentation for tablets 
          while preserving native edge-to-edge layouts on mobile screens.
        */}
        <div 
          className="relative w-full h-screen md:h-[860px] md:w-[395px] bg-[#0A0A0A] md:rounded-[52px] md:border-[10px] md:border-[#1E1E1E] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
          id="app-device-frame"
        >
          {/* Dynamic Island slot for simulator */}
          <div className="hidden md:block absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#0A0D1A] rounded-full absolute right-5" />
          </div>

          {/* Persistent Top Navigation Bar */}
          <Header 
            onNavigate={(screen) => handleNavigate(screen)} 
            onOpenMenu={() => setIsMenuOpen(true)} 
          />

          {/* Scrollable Viewport Container */}
          <main
            className="flex-1 overflow-y-auto overflow-x-hidden w-full pt-16 pb-[88px] scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: "none" }}
            id="pwa-scroll-viewport"
          >
            {renderActiveScreen()}
          </main>

          {/* Translucent Floating Bottom Nav Bar */}
          <BottomNav 
            currentScreen={currentScreen} 
            onNavigate={(screen) => handleNavigate(screen)} 
          />

          {/* Fullscreen Overlay Drawer Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <MenuOverlay
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onNavigate={(screen) => handleNavigate(screen)}
              />
            )}
          </AnimatePresence>
          
          {/* PWA Install Prompt */}
          <InstallPrompt />
        </div>
      </div>
    </>
  );
}
