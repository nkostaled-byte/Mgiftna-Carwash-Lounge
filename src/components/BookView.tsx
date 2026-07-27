import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, Clock, Users, Car, CheckCircle2, Trash2, ShieldAlert, Info } from "lucide-react";
import { Booking } from "../types";
import { WASH_PACKAGES, DINE_ITEMS, EVENT_ITEMS } from "../data";

interface BookViewProps {
  initialType?: "dine" | "wash";
  initialItemName?: string;
  onClearPresets?: () => void;
}

export default function BookView({ initialType = "dine", initialItemName = "", onClearPresets }: BookViewProps) {
  const [bookingType, setBookingType] = useState<"dine" | "wash">(initialType);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [guests, setGuests] = useState(2);
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleType, setVehicleType] = useState("Sedan / Coupe");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState(initialItemName);
  const [formError, setFormError] = useState("");
  
  // Local storage bookings list
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);

  // Sync initial presets when they change
  useEffect(() => {
    setBookingType(initialType);
    setFormError("");
    if (initialItemName) {
      setSelectedService(initialItemName);
    }
  }, [initialType, initialItemName]);

  // Load existing bookings on mount
  useEffect(() => {
    const saved = localStorage.getItem("mgiftanas_bookings");
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load bookings", e);
      }
    }
  }, []);

  // Standard time slots
  const dineSlots = ["12:00 PM", "1:30 PM", "3:00 PM", "6:00 PM", "7:30 PM", "9:00 PM", "10:30 PM"];
  const washSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"];
  const slots = bookingType === "dine" ? dineSlots : washSlots;

  const vehicleTypes = ["Sedan / Coupe", "SUV / Crossover", "Supercar / Exotic", "Luxury Sedan"];

  // Handle Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!date || !timeSlot) {
      setFormError("Please select a date and preferred time slot.");
      return;
    }
    if (bookingType === "wash" && !vehicleModel) {
      setFormError("Please specify your vehicle model to proceed.");
      return;
    }
    if (!email || !phone) {
      setFormError("Please provide your email and phone number.");
      return;
    }

    const newBooking: Booking = {
      id: "bk-" + Math.random().toString(36).substr(2, 9),
      type: bookingType,
      date,
      time: timeSlot,
      guests: bookingType === "dine" ? guests : undefined,
      packageName: bookingType === "wash" ? (selectedService || "Standard Detail") : undefined,
      tableName: bookingType === "dine" ? (selectedService || "Standard Lounge Table") : undefined,
      vehicleModel: bookingType === "wash" ? vehicleModel : undefined,
      vehicleType: bookingType === "wash" ? vehicleType : undefined,
      email,
      phone,
      status: "confirmed",
      createdAt: new Date().toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem("mgiftanas_bookings", JSON.stringify(updatedBookings));
    
    // Show premium overlay success state
    setLastCreatedBooking(newBooking);
    setShowSuccess(true);

    // Reset Form Fields
    setDate("");
    setTimeSlot("");
    setVehicleModel("");
    setEmail("");
    setPhone("");
    if (onClearPresets) onClearPresets();
    setSelectedService("");
  };

  // Delete Booking
  const handleDeleteBooking = (id: string) => {
    const bookingToDelete = bookings.find((b) => b.id === id);
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("mgiftanas_bookings", JSON.stringify(updated));

    if (bookingToDelete) {
      let targetEventId = bookingToDelete.eventId;
      if (!targetEventId && bookingToDelete.tableName && bookingToDelete.tableName.startsWith("Event: ")) {
        const eventName = bookingToDelete.tableName.replace("Event: ", "");
        const found = EVENT_ITEMS.find((ev) => ev.name === eventName);
        if (found) {
          targetEventId = found.id;
        }
      }

      if (targetEventId) {
        const savedRsvps = localStorage.getItem("mgiftanas_rsvps");
        if (savedRsvps) {
          try {
            const rsvps: string[] = JSON.parse(savedRsvps);
            const updatedRsvps = rsvps.filter((eId) => eId !== targetEventId);
            localStorage.setItem("mgiftanas_rsvps", JSON.stringify(updatedRsvps));
          } catch (e) {}
        }
      }
    }
  };

  return (
    <div className="space-y-4 pb-6 px-4 animate-fade-in relative" id="book-view-container">
      {/* Title Header */}
      <div className="pt-1.5" id="book-title-section">
        <span className="text-amber-500 font-extrabold text-[8.5px] uppercase tracking-[0.25em]" style={{ fontFamily: "'General Sans', sans-serif" }}>
          Instant Priority Access
        </span>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5" style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}>
          Reserve Space
        </h1>
        <p className="text-neutral-500 text-[11.5px] mt-1 leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          Reserve your table at the lounge or schedule a high-precision automotive detailing slot.
        </p>
      </div>

      {/* SEGMENTED CONTROL (Reserve Table vs Book Wash) */}
      <div className="bg-[#111112] border border-white/[0.04] p-1 rounded-xl flex" id="booking-type-segmented">
        <button
          onClick={() => {
            setBookingType("dine");
            if (onClearPresets) onClearPresets();
            setSelectedService("");
          }}
          className={`flex-1 py-2 text-center text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${
            bookingType === "dine"
              ? "bg-[#F59E0B] text-black shadow-md font-black"
              : "text-neutral-400 hover:text-white"
          }`}
          style={{ fontFamily: "'General Sans', sans-serif" }}
          id="segment-dine"
        >
          Reserve Table
        </button>
        <button
          onClick={() => {
            setBookingType("wash");
            if (onClearPresets) onClearPresets();
            setSelectedService("");
          }}
          className={`flex-1 py-2 text-center text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${
            bookingType === "wash"
              ? "bg-[#F59E0B] text-black shadow-md font-black"
              : "text-neutral-400 hover:text-white"
          }`}
          style={{ fontFamily: "'General Sans', sans-serif" }}
          id="segment-wash"
        >
          Book Wash
        </button>
      </div>

      {/* Preset Item Highlight Banner */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center justify-between"
          id="preset-indicator-banner"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
                Pre-selected experience:
              </span>
              <span className="text-white text-xs font-bold uppercase tracking-tight mt-1 leading-none" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {selectedService}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedService("");
              if (onClearPresets) onClearPresets();
            }}
            className="text-[8.5px] text-amber-500/80 hover:text-amber-500 font-extrabold uppercase tracking-wider underline px-2 py-0.5"
          >
            Clear
          </button>
        </motion.div>
      )}

      {/* THE CONVERSION FORM */}
      <form onSubmit={handleSubmit} className="space-y-4" id="booking-form">
        {/* Date Selection */}
        <div className="space-y-1.5 w-full" id="form-group-date">
          <label 
            className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1"
            style={{ fontFamily: "'General Sans', sans-serif" }}
          >
            <CalendarIcon className="w-3 h-3 text-amber-500" />
            Select Date
          </label>
          <div className="w-full relative block overflow-hidden rounded-xl">
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="box-border w-full max-w-full min-w-0 bg-[#111112] border border-white/[0.04] text-white px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-500/40 transition-colors block"
              style={{ colorScheme: "dark", fontFamily: "'Satoshi', sans-serif", boxSizing: "border-box", minWidth: "0", maxWidth: "100%" }}
            />
          </div>
        </div>

        {/* Time Selection Slots (Luxury Button Grid) */}
        <div className="space-y-1.5" id="form-group-time">
          <label 
            className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1"
            style={{ fontFamily: "'General Sans', sans-serif" }}
          >
            <Clock className="w-3 h-3 text-amber-500" />
            Preferred Time Slot
          </label>
          <div className="grid grid-cols-3 gap-1.5" id="time-slots-grid">
            {slots.map((slot) => {
              const isSelected = timeSlot === slot;
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => {
                    setTimeSlot(slot);
                    setFormError("");
                  }}
                  className={`py-1.5 text-center rounded-lg text-[10px] font-bold uppercase transition-all duration-200 border ${
                    isSelected
                      ? "bg-[#F59E0B] text-black border-[#F59E0B] shadow-sm"
                      : "bg-[#111112] text-neutral-300 border-white/[0.04] hover:text-white"
                  }`}
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {slot.replace(" ", "")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-2 gap-3" id="form-group-contact">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'General Sans', sans-serif" }}>Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111112] border border-white/[0.04] text-white px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-500/40 placeholder-neutral-600 transition-colors"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'General Sans', sans-serif" }}>Phone</label>
            <input
              type="tel"
              required
              placeholder="082 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#111112] border border-white/[0.04] text-white px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-500/40 placeholder-neutral-600 transition-colors"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            />
          </div>
        </div>

        {/* Dynamic Fields: Dine (Guests selection) */}
        {bookingType === "dine" && (
          <div className="space-y-1.5 animate-fade-in" id="form-group-guests">
            <label 
              className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1"
              style={{ fontFamily: "'General Sans', sans-serif" }}
            >
              <Users className="w-3 h-3 text-amber-500" />
              Number of Guests
            </label>
            <div className="flex gap-2 items-center" id="guest-selectors">
              <select
                value={guests}
                onChange={(e) => {
                  setGuests(parseInt(e.target.value, 10));
                  setFormError("");
                }}
                className="bg-[#111112] border border-white/[0.04] text-white px-3.5 py-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-500/40"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((n) => (
                  <option key={n} value={n} className="bg-[#1A1A1C] text-white">
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>

              <div className="flex-1 flex items-center gap-2 bg-[#111112] border border-white/[0.04] px-3 py-1.5 rounded-xl">
                <span className="text-[9px] text-neutral-400 font-bold uppercase whitespace-nowrap">Guests:</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={guests}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) {
                      setGuests(val);
                    } else if (e.target.value === "") {
                      setGuests(1);
                    }
                    setFormError("");
                  }}
                  placeholder="Exact"
                  className="w-full bg-transparent text-white text-xs font-semibold outline-none"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Fields: Wash (Vehicle specs) */}
        {bookingType === "wash" && (
          <div className="space-y-3 animate-fade-in" id="form-group-vehicle">
            {/* Vehicle Model Input */}
            <div className="space-y-1.5">
              <label 
                className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1"
                style={{ fontFamily: "'General Sans', sans-serif" }}
              >
                <Car className="w-3 h-3 text-amber-500" />
                Vehicle Model
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Porsche 911 GT3 RS"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full bg-[#111112] border border-white/[0.04] text-white px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-500/40 placeholder-neutral-600 transition-colors"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              />
            </div>

            {/* Vehicle Category Segmented */}
            <div className="space-y-1.5">
              <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest block">
                Vehicle Classification
              </span>
              <div className="grid grid-cols-2 gap-1.5" id="vehicle-types-grid">
                {vehicleTypes.map((vType) => {
                  const isSelected = vehicleType === vType;
                  return (
                    <button
                      type="button"
                      key={vType}
                      onClick={() => setVehicleType(vType)}
                      className={`py-1.5 text-center rounded-lg text-[10px] font-bold uppercase transition-all duration-200 border ${
                        isSelected
                          ? "bg-[#F59E0B] text-black border-[#F59E0B]"
                          : "bg-[#111112] text-neutral-300 border-white/[0.04]"
                      }`}
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      {vType}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Error Warning Banner */}
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold"
            id="form-error-banner"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>{formError}</span>
          </motion.div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.99] text-black font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all duration-200"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          id="booking-submit-btn"
        >
          Confirm Priority Request
        </button>
      </form>

      {/* USER BOOKING HISTORY (PWA Ticket View) */}
      <div className="space-y-3.5 border-t border-white/[0.04] pt-4" id="bookings-history-section">
        <h3 
          className="text-[10px] font-bold tracking-[0.15em] text-[#71717A] uppercase"
          style={{ fontFamily: "'General Sans', sans-serif" }}
        >
          My Active Registrations
        </h3>

        {bookings.length === 0 ? (
          <div className="bg-[#111112] border border-white/[0.03] rounded-xl p-4 text-center text-neutral-500" id="empty-bookings-box">
            <ShieldAlert className="w-6 h-6 text-neutral-600 mx-auto mb-2 stroke-[1.5]" />
            <p className="text-[11px] leading-normal" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              No active reservations found.<br />Secure priority access using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3" id="bookings-tickets-list">
            {bookings.map((bk) => (
              <motion.div
                key={bk.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#111112] border border-white/[0.04] rounded-xl overflow-hidden shadow-md relative flex flex-col"
                id={`ticket-${bk.id}`}
              >
                {/* Ticket Top accent line */}
                <div className="h-1 w-full bg-[#F59E0B]" />
                
                {/* Ticket Body */}
                <div className="p-3.5 space-y-3">
                  {/* Header details */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-extrabold text-amber-500 uppercase tracking-widest leading-none">
                        {bk.type === "dine" ? "Lounge Dining" : "Detailing Suite"}
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight leading-none mt-0.5" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                        {bk.type === "dine" ? (bk.tableName || "Standard Lounge") : (bk.packageName || "Detailing treatment")}
                      </h4>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                      CONFIRMED
                    </span>
                  </div>

                  {/* Booking parameters grid */}
                  <div className="grid grid-cols-2 gap-2 border-t border-white/[0.03] pt-2.5 text-[11px]">
                    <div>
                      <span className="text-neutral-500 text-[8px] font-semibold uppercase block mb-0.5">Scheduled Date</span>
                      <span className="text-neutral-200 font-bold" style={{ fontFamily: "'Satoshi', sans-serif" }}>{bk.date}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[8px] font-semibold uppercase block mb-0.5">Arrival Window</span>
                      <span className="text-neutral-200 font-bold" style={{ fontFamily: "'Satoshi', sans-serif" }}>{bk.time}</span>
                    </div>
                    {bk.type === "dine" ? (
                      <div>
                        <span className="text-neutral-500 text-[8px] font-semibold uppercase block mb-0.5">Party Size</span>
                        <span className="text-neutral-200 font-bold" style={{ fontFamily: "'Satoshi', sans-serif" }}>{bk.guests} Guests</span>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-neutral-500 text-[8px] font-semibold uppercase block mb-0.5">Vehicle Model</span>
                          <span className="text-neutral-200 font-bold line-clamp-1" style={{ fontFamily: "'Satoshi', sans-serif" }}>{bk.vehicleModel}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-neutral-500 text-[8px] font-semibold uppercase block mb-0.5">Classification</span>
                          <span className="text-neutral-200 font-bold" style={{ fontFamily: "'Satoshi', sans-serif" }}>{bk.vehicleType}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer metadata & actions */}
                  <div className="flex justify-between items-center border-t border-white/[0.03] pt-2 text-[9px]">
                    <span className="text-neutral-600 font-semibold uppercase">
                      ID: {bk.id.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleDeleteBooking(bk.id)}
                      className="text-neutral-500 hover:text-red-500 active:scale-90 flex items-center gap-1 p-0.5 transition-all duration-200 font-bold uppercase tracking-wider"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Release</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN POPUP SUCCESS CONFIRMATION SHEET */}
      <AnimatePresence>
        {showSuccess && lastCreatedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 backdrop-blur-md"
            id="success-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-[#111112] border border-white/[0.04] rounded-xl max-w-sm w-full p-4 text-center space-y-4 shadow-xl relative"
              id="success-modal"
            >
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-extrabold text-white uppercase tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', 'Satoshi', sans-serif" }}>
                  Registration Confirmed
                </h2>
                <p className="text-neutral-400 text-[11.5px] leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  Your VIP reservation ticket has been generated and saved locally to your device wallet.
                </p>
              </div>

              {/* Ticket mini preview */}
              <div className="bg-[#0D0D0E] rounded-xl p-3 text-left border border-white/[0.03] space-y-1.5 text-[10.5px]">
                <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider">Experience</span>
                  <span className="text-amber-500 font-extrabold uppercase tracking-widest">{lastCreatedBooking.type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider">Scheduled</span>
                  <span className="text-white font-semibold" style={{ fontFamily: "'Satoshi', sans-serif" }}>{lastCreatedBooking.date} • {lastCreatedBooking.time}</span>
                </div>
                {lastCreatedBooking.type === "wash" && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-bold uppercase tracking-wider">Vehicle</span>
                    <span className="text-white font-semibold line-clamp-1" style={{ fontFamily: "'Satoshi', sans-serif" }}>{lastCreatedBooking.vehicleModel}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.99] text-black font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-xs transition-all duration-200"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
                id="success-close-btn"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
