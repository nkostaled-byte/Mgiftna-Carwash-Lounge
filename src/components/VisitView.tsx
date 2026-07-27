import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Phone, MessageSquare, Mail, Compass, ExternalLink, Smartphone, Eye, Download } from "lucide-react";
import { BUSINESS_DETAILS } from "../data";

export default function VisitView() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('pwa-install-installed') === 'true') {
      setIsInstalled(true);
    }
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-install-installed', 'true');
        setIsInstalled(true);
      }
    } else {
      alert("To install Mgiftana Carwash & Lounge as an app, tap your browser's menu (...) and select 'Add to Home Screen' or 'Install App'.");
    }
  };

  const handleTestSplash = () => {
    setShowSplash(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 2800);
  };

  const handleOpenMaps = () => {
    // Standard Clayville location coordinates or search query
    window.open("https://maps.google.com/?q=" + encodeURIComponent(BUSINESS_DETAILS.address), "_blank");
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hi Mgiftna Carwash & Lounge, I am looking to inquire about your exclusive Lounge & Detailing packages today.");
    window.open(`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=${text}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, "")}`, "_self");
  };

  const handleEmail = () => {
    window.open(`mailto:${BUSINESS_DETAILS.email}`, "_self");
  };

  return (
    <div className="space-y-4 pb-6 px-4 animate-fade-in" id="visit-view-container">
      {/* Title Header */}
      <div className="pt-1.5" id="visit-title-section">
        <span className="text-[#F59E0B] font-extrabold text-[8.5px] uppercase tracking-[0.25em]" style={{ fontFamily: "'General Sans', sans-serif" }}>
          Private Lounge &amp; Studio
        </span>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5" style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}>
          Visit Sanctuary
        </h1>
        <p className="text-neutral-500 text-[11.5px] mt-1 leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          A private, secure sanctuary for gourmands and automotive enthusiasts. Located in the heart of Clayville.
        </p>
      </div>

      {/* INTEGRATED PREMIUM DARK MAP CARD (Uber/Airbnb Style) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="border border-white/[0.05] bg-[#111112] rounded-2xl overflow-hidden shadow-xl"
        id="integrated-map-card"
      >
        {/* Map Viewport Container */}
        <div className="relative aspect-[16/10] w-full" id="visit-map-viewport">
          {/* Grayscale filter to produce Uber-like aesthetic dark map */}
          <div className="w-full h-full grayscale invert-[93%] hue-rotate-[185deg] contrast-[95%] brightness-[85%]">
            <iframe
              src={BUSINESS_DETAILS.mapsIframeUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mgiftna Carwash & Lounge Map"
              id="visit-map-iframe"
            />
          </div>
          
          {/* Custom Gold pulsing location pin labeled precisely "Mgiftna Carwash & Lounge" */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center" id="custom-pin-overlay">
            <div className="flex flex-col items-center gap-1 -translate-y-3">
              {/* Premium Floating Label */}
              <div className="bg-[#0B0B0C] border border-[#F59E0B]/30 px-2 py-0.5 rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-center gap-1">
                <span className="w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-white uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  Mgiftna Carwash &amp; Lounge
                </span>
              </div>
              
              {/* Custom Pin Dot & Pulsing Accent */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-5 h-5 bg-[#F59E0B]/20 rounded-full animate-ping" />
                <span className="absolute w-2.5 h-2.5 bg-[#F59E0B]/40 rounded-full" />
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full border border-black shadow-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Info & CTA details section */}
        <div className="p-4 space-y-3" id="map-details-container">
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center text-[#F59E0B] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest block">
                Physical Location
              </span>
              <p 
                className="text-white text-xs font-semibold leading-relaxed"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {BUSINESS_DETAILS.address}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenMaps}
            className="w-full bg-[#1A1A1C] hover:bg-[#252528] active:scale-98 text-neutral-200 text-[10px] font-black py-2.5 rounded-xl uppercase tracking-wider border border-white/[0.02] flex items-center justify-center gap-1.5 transition-all"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
            id="visit-directions-btn"
          >
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </button>
        </div>
      </motion.div>

      {/* HOURS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="bg-[#111112] border border-white/[0.04] rounded-2xl p-4 space-y-3 shadow-lg"
        id="visit-hours-block"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-[#F59E0B] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest block">
              Lounge &amp; Detail Suite
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              Operating Hours
            </h3>
          </div>
        </div>

        <div className="border-t border-white/[0.03] pt-2.5 space-y-2 text-xs" id="hours-table">
          {BUSINESS_DETAILS.hours.map((hr, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
              <span className="text-neutral-400 font-semibold uppercase text-[10px]">{hr.days}</span>
              <span className="text-white font-black text-[11px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>{hr.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ONE-TAP CONTACT CONNECTOR DIRECTORY */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="space-y-2.5"
        id="visit-contact-section"
      >
        <h3 
          className="text-[9.5px] font-bold tracking-[0.2em] text-[#71717A] uppercase"
          style={{ fontFamily: "'General Sans', sans-serif" }}
        >
          One-Tap Direct Inquiries
        </h3>

        <div className="grid grid-cols-3 gap-2" id="contact-methods-grid">
          {/* WhatsApp button */}
          <button
            onClick={handleWhatsApp}
            className="bg-[#111112] hover:bg-[#151516] active:scale-95 border border-white/[0.04] py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
            id="contact-whatsapp-btn"
          >
            <MessageSquare className="w-4.5 h-4.5 text-emerald-400" />
            <span className="text-[8.5px] font-black text-neutral-300 uppercase tracking-wider" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              WhatsApp
            </span>
          </button>

          {/* Call button */}
          <button
            onClick={handleCall}
            className="bg-[#111112] hover:bg-[#151516] active:scale-95 border border-white/[0.04] py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
            id="contact-call-btn"
          >
            <Phone className="w-4.5 h-4.5 text-[#F59E0B]" />
            <span className="text-[8.5px] font-black text-neutral-300 uppercase tracking-wider" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              Voice Call
            </span>
          </button>

          {/* Email button */}
          <button
            onClick={handleEmail}
            className="bg-[#111112] hover:bg-[#151516] active:scale-95 border border-white/[0.04] py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
            id="contact-email-btn"
          >
            <Mail className="w-4.5 h-4.5 text-sky-400" />
            <span className="text-[8.5px] font-black text-neutral-300 uppercase tracking-wider" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              Email
            </span>
          </button>
        </div>
      </motion.div>

      {/* PWA & Splash Screen Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="bg-[#111112] border border-white/[0.04] rounded-2xl p-4 space-y-3.5 shadow-lg"
        id="pwa-contact-section"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-[#F59E0B] shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest block">
              Progressive Web App
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              App Installation &amp; Splash
            </h3>
          </div>
        </div>

        <p className="text-neutral-400 text-[11px] leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          Experience Mgiftana as a lightning-fast native application with offline support and custom startup splash screen.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleInstallClick}
            disabled={isInstalled}
            className={`w-full py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              isInstalled 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default" 
                : "bg-amber-500 hover:bg-amber-400 text-black active:scale-98 shadow-lg shadow-amber-500/10"
            }`}
            style={{ fontFamily: "'Satoshi', sans-serif" }}
            id="install-app-contact-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstalled ? "App Installed" : "Install App"}</span>
          </button>

          <button
            onClick={handleTestSplash}
            className="w-full bg-[#1A1A1C] hover:bg-[#252528] active:scale-98 text-neutral-200 text-[10px] font-black py-2.5 px-3 rounded-xl uppercase tracking-wider border border-white/[0.02] flex items-center justify-center gap-1.5 transition-all"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
            id="test-splash-btn"
          >
            <Eye className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Preview Splash</span>
          </button>
        </div>
      </motion.div>

      {/* Splash Screen Fullscreen Simulator Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center select-none"
            id="pwa-splash-simulator"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center space-y-5"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-[#F59E0B]/20 rounded-3xl blur-xl animate-pulse" />
                <img
                  src="https://res.cloudinary.com/dvvugpu04/image/upload/v1785159774/Mgiftnana_logo_uvjolg.png"
                  alt="Mgiftana Logo"
                  className="w-24 h-24 rounded-2xl object-cover relative z-10 border border-[#F59E0B]/30 shadow-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}>
                  Mgiftana Carwash &amp; Lounge
                </h1>
                <p className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'General Sans', sans-serif" }}>
                  Luxury Detailing &amp; Culinary Lounge
                </p>
              </div>

              <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="w-full h-full bg-[#F59E0B]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
