import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, UserCheck, X, CheckCircle2, MapPin, Share2, Maximize2 } from "lucide-react";
import { EVENT_ITEMS, EventItem } from "../data";
import OptimizedImage from "./OptimizedImage";

interface EventsViewProps {
  onNavigateToBook: (presetType: "dine" | "wash", selectedExperienceName?: string) => void;
}

export default function EventsView({ onNavigateToBook }: EventsViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showRsvpSuccess, setShowRsvpSuccess] = useState(false);
  const [rsvpedEvents, setRsvpedEvents] = useState<string[]>([]);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const [rsvpMode, setRsvpMode] = useState<"standard" | "vip">("standard");
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Load RSVP list from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mgiftanas_rsvps");
    if (saved) {
      try {
        setRsvpedEvents(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !rsvpName || !rsvpEmail) return;

    const updated = [...rsvpedEvents, selectedEvent.id];
    setRsvpedEvents(updated);
    localStorage.setItem("mgiftanas_rsvps", JSON.stringify(updated));

    // Also add to global bookings if appropriate
    const savedBookings = localStorage.getItem("mgiftanas_bookings");
    let bookingsList = [];
    if (savedBookings) {
      try {
        bookingsList = JSON.parse(savedBookings);
      } catch (e) {}
    }

    const newBooking = {
      id: "evt-reg-" + Math.random().toString(36).substr(2, 6),
      type: "dine" as const,
      date: selectedEvent.date,
      time: selectedEvent.time,
      guests: 2,
      tableName: `Event: ${selectedEvent.name}`,
      eventId: selectedEvent.id,
      email: rsvpEmail,
      phone: "N/A",
      status: "confirmed" as const,
      createdAt: new Date().toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    };

    localStorage.setItem("mgiftanas_bookings", JSON.stringify([newBooking, ...bookingsList]));

    setShowRsvpSuccess(true);
    setRsvpName("");
    setRsvpEmail("");
  };

  const isRsvped = (eventId: string) => rsvpedEvents.includes(eventId);

  const handleShare = (event: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      // Fallback
      navigator.clipboard.writeText(`${event.name} — ${event.date} at Mgiftna Carwash & Lounge`);
      setCopiedEventId(event.id);
      setTimeout(() => setCopiedEventId(null), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-6 px-4 animate-fade-in" id="events-view-container">
      {/* Title Header */}
      <div className="pt-1.5" id="events-title-section">
        <span className="text-amber-500 font-extrabold text-[8.5px] uppercase tracking-[0.25em]" style={{ fontFamily: "'General Sans', sans-serif" }}>
          Curated Experiences
        </span>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5" style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}>
          Lounge Events
        </h1>
        <p className="text-neutral-500 text-[11.5px] mt-1 leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          Exclusive member gatherings, live acoustic performances, fine wine tastings, and automotive masterclasses.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-4" id="events-list">
        {EVENT_ITEMS.map((item) => {
          const registered = isRsvped(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEvent(item)}
              className="bg-[#111112] rounded-xl overflow-hidden border border-white/[0.04] shadow-md cursor-pointer group"
              id={`event-card-${item.id}`}
            >
              {/* Image Banner */}
              <div className="aspect-[16/10] w-full relative overflow-hidden">
                <OptimizedImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top group-hover:scale-101 transition-transform duration-700"
                  isBelowFold={true}
                  priority="low"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                
                {/* Status badge */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {registered && (
                    <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <UserCheck className="w-2.5 h-2.5" />
                      <span>RSVP Registered</span>
                    </span>
                  )}
                </div>

                {/* Share Button with Inline Copied Feedback */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <AnimatePresence>
                    {copiedEventId === item.id && (
                      <motion.span
                        initial={{ opacity: 0, x: 5, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#F59E0B] text-black text-[7.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                      >
                        Copied
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={(e) => handleShare(item, e)}
                    className="bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                    aria-label="Share event"
                    id={`share-btn-${item.id}`}
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Date overlay block */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-amber-500 font-bold uppercase tracking-wider block leading-none">
                      Date &amp; Time
                    </span>
                    <span className="text-white text-xs font-bold uppercase tracking-tight flex items-center gap-1" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {item.date}
                    </span>
                  </div>
                  <span className="text-[8px] text-neutral-400 font-bold uppercase flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5 text-amber-500" />
                    {item.time.split(" - ")[0]}
                  </span>
                </div>
              </div>

              {/* Title & short description */}
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
                <div className="pt-2.5 border-t border-white/[0.03] flex items-center justify-between text-[9px] font-bold text-neutral-400 group-hover:text-white transition-colors uppercase tracking-wider">
                  <span>View Details &amp; Registration</span>
                  <span className="text-[#F59E0B] font-extrabold">SECURE PASS</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FULLSCREEN EVENT DETAILS OVERLAY */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 overflow-y-auto scrollbar-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
            style={{ scrollbarWidth: "none" }}
            id="event-detail-overlay"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedEvent(null);
                setShowRsvpSuccess(false);
              }}
              className="fixed top-[calc(1rem+env(safe-area-inset-top))] right-[calc(1rem+env(safe-area-inset-right))] z-50 bg-black/60 hover:bg-neutral-900 active:scale-95 text-white w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all duration-200 cursor-pointer"
              id="event-detail-close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Body */}
            <div className="w-full max-w-lg mx-auto bg-[#0A0A0A] min-h-[100dvh] pb-[calc(4rem+env(safe-area-inset-bottom))] relative" id="event-detail-content">
              {/* Cinematic Cover Image */}
              <div 
                className="relative h-[38vh] w-full bg-[#0A0A0A] cursor-pointer group"
                onClick={() => setIsImageExpanded(true)}
              >
                <OptimizedImage
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="w-full h-full object-contain object-top"
                  isBelowFold={true}
                  priority="low"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/35 pointer-events-none" />
                
                <div className="absolute bottom-3 right-3 bg-black/70 hover:bg-black text-amber-500 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all">
                  <Maximize2 className="w-3 h-3" />
                  <span>Tap to View Flyer</span>
                </div>
              </div>

              {/* Event detail description */}
              <div className="px-5 space-y-4 -mt-4 relative z-10">
                <div className="space-y-1">
                  <h2 
                    className="text-lg font-black text-white uppercase tracking-tight leading-tight pt-0.5"
                    style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}
                  >
                    {selectedEvent.name}
                  </h2>
                </div>

                {/* Timing details list */}
                <div className="grid grid-cols-2 gap-3 border-t border-b border-white/[0.04] py-3 text-[11px]" id="event-timing-grid">
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 text-[8px] font-bold uppercase tracking-wider block">Scheduled Date</span>
                    <span className="text-neutral-200 font-bold uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {selectedEvent.date}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 text-[8px] font-bold uppercase tracking-wider block">Event Hours</span>
                    <span className="text-neutral-200 font-bold uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {selectedEvent.time}
                    </span>
                  </div>
                </div>

                {/* Event Description */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block">Experience Details</span>
                  <p 
                    className="text-[#D1D1D6] text-xs leading-relaxed"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {selectedEvent.description}
                  </p>
                </div>

                {/* RSVP / Registration Form */}
                <div className="border-t border-white/[0.04] pt-4 space-y-3.5" id="event-rsvp-section">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                      <UserCheck className="w-4 h-4 text-amber-500" />
                      Secure VIP pass
                    </h3>
                  </div>

                  {/* Booking Type Selector */}
                  <div className="grid grid-cols-2 gap-2 bg-[#111112] p-1 rounded-xl border border-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => setRsvpMode("standard")}
                      className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        rsvpMode === "standard"
                          ? "bg-[#F59E0B] text-black shadow-md"
                          : "text-neutral-400 hover:text-white"
                      }`}
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                      id="rsvp-mode-standard"
                    >
                      Standard RSVP
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpMode("vip")}
                      className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        rsvpMode === "vip"
                          ? "bg-[#F59E0B] text-black shadow-md"
                          : "text-neutral-400 hover:text-white"
                      }`}
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                      id="rsvp-mode-vip"
                    >
                      VIP Section Booking
                    </button>
                  </div>

                  {rsvpMode === "vip" ? (
                    <div className="bg-[#111112] border border-amber-500/20 p-4 rounded-xl text-center space-y-3">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center text-[#F59E0B] mx-auto">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white uppercase tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                          Exclusive VIP Table &amp; Lounge Section
                        </h4>
                        <p className="text-neutral-400 text-[10.5px] leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                          Secure a dedicated VIP booth with private bottle service and dedicated host for {selectedEvent.name}.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEvent(null);
                          onNavigateToBook("dine", `VIP: ${selectedEvent.name}`);
                        }}
                        className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.99] text-black font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all duration-200"
                        style={{ fontFamily: "'Satoshi', sans-serif" }}
                        id="book-vip-section-btn"
                      >
                        Proceed to VIP Table Booking
                      </button>
                    </div>
                  ) : isRsvped(selectedEvent.id) || showRsvpSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-xl text-center space-y-2"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                        RSVP Registration Confirmed
                      </h4>
                      <p className="text-neutral-500 text-[10px] leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                        We have registered your private pass for this event. A confirmation code has been added to your local device wallet. No further action is required.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-3" id="rsvp-form">
                      <div className="space-y-1">
                        <label className="text-[8.5px] font-black text-neutral-400 uppercase tracking-widest">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alexander Mercer"
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          className="w-full bg-[#111112] border border-white/[0.04] text-white px-3.5 py-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-500/40"
                          style={{ fontFamily: "'Satoshi', sans-serif" }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] font-black text-neutral-400 uppercase tracking-widest">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. alex@mercer.com"
                          value={rsvpEmail}
                          onChange={(e) => setRsvpEmail(e.target.value)}
                          className="w-full bg-[#111112] border border-white/[0.04] text-white px-3.5 py-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-500/40"
                          style={{ fontFamily: "'Satoshi', sans-serif" }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.99] text-black font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all duration-200"
                        style={{ fontFamily: "'Satoshi', sans-serif" }}
                        id="rsvp-submit-btn"
                      >
                        Confirm RSVP
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Flyer Lightbox */}
      <AnimatePresence>
        {isImageExpanded && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
            onClick={() => setIsImageExpanded(false)}
            id="flyer-lightbox-overlay"
          >
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-[calc(1.25rem+env(safe-area-inset-top))] right-[calc(1.25rem+env(safe-area-inset-right))] bg-white/10 hover:bg-white/20 text-white w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md transition-all z-10 cursor-pointer"
              id="close-lightbox-btn"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative max-w-4xl w-full max-h-[85dvh] flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
              <OptimizedImage
                src={selectedEvent.image}
                alt={selectedEvent.name}
                className="max-h-[80dvh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                isBelowFold={true}
                priority="low"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mt-4">
              {selectedEvent.name} — Event Flyer
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
