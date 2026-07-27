import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { 
  Utensils, 
  Car, 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Users,
  Check,
  X,
  Plus
} from "lucide-react";
import { DINE_ITEMS, WASH_PACKAGES, BUSINESS_DETAILS, EVENT_ITEMS } from "../data";
import { DineItem, WashPackage } from "../types";

const DINE_CATEGORY_DETAILS: Record<string, { image: string; title: string; tag: string; price: string; description: string }> = {
  all: {
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    title: "Dry-Aged Wagyu Ribeye",
    tag: "SIGNATURE PLATTER",
    price: "R680",
    description: "400g of dry-aged Japanese Wagyu, seared over charcoal, basted with dynamic bone marrow butter, served with roasted heirloom garlic and hand-harvested rock salt."
  },
  grills: {
    image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop",
    title: "Tomahawk Caveman Steak",
    tag: "FLAME GRILLS",
    price: "R750",
    description: "800g prime Ribeye on the bone, flame-grilled over open hardwood coals, glazed with garlic-herb brush, served with smoked maldon sea salt flakes."
  },
  platters: {
    image: "https://res.cloudinary.com/dvvugpu04/image/upload/v1785169583/Hammer-and-Tongs_Platter-Large_dw3kmi.jpg",
    title: "Bespoke Grand Platter",
    tag: "PLATTERS",
    price: "R1200",
    description: "A colossal curated display of flame-grilled ribs, chicken wings, boerewors, roasted marrow bones, accompanied by artisanal sides and house dipping sauces."
  },
  cocktails: {
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
    title: "24K Gold Old Fashioned",
    tag: "COCKTAILS",
    price: "R240",
    description: "Smoked bourbon, rich Angostura bitters, pure Madagascar vanilla pod, finished with edible 24K gold leaf flurries and a slow-melting clear ice sphere."
  },
  wine: {
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    title: "Rupert & Rothschild Classique",
    tag: "WINE VINTAGES",
    price: "R550",
    description: "An elegant South African Bordeaux-style blend offering red plum and raspberry aromas, smooth round tannins, and a long wood-spiced luxury finish."
  },
  desserts: {
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    title: "Decadent Gold Soufflé",
    tag: "DESSERTS",
    price: "R180",
    description: "Warm dark Belgian chocolate soufflé, molten gold-dusted lava center, served with Madagascar vanilla bean gelato and wild macerated berries."
  }
};

export default function DesktopLayout() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedDineItem, setSelectedDineItem] = useState<DineItem | null>(null);
  const [selectedWashPkg, setSelectedWashPkg] = useState<WashPackage | null>(null);
  
  // Booking Drawer & Form state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"dine" | "wash">("dine");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [bookingDate, setBookingDate] = useState("2026-07-30");
  const [bookingTime, setBookingTime] = useState("19:00");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [vehicleReg, setVehicleReg] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  // Selected Category filter for Dine menu
  const [selectedDineCategory, setSelectedDineCategory] = useState<"all" | "grills" | "platters" | "cocktails" | "wine" | "desserts">("all");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "dine", "wash", "events", "book", "visit"];
      const scrollPosition = window.scrollY + 300;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenBooking = (type: "dine" | "wash", packageId: string = "") => {
    setBookingType(type);
    if (packageId) {
      setSelectedPackageId(packageId);
    } else {
      setSelectedPackageId(type === "dine" ? DINE_ITEMS[0].id : WASH_PACKAGES[0].id);
    }
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessModal(true);
    setIsBookingOpen(false);
  };

  // Filtered menu items
  const filteredDineItems = selectedDineCategory === "all" 
    ? DINE_ITEMS 
    : DINE_ITEMS.filter(item => item.category === selectedDineCategory);

  // Scroll animations for parallax
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroImageY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const washParallaxY = useTransform(scrollYProgress, [0.2, 0.6], [-40, 40]);
  const dineParallaxY = useTransform(scrollYProgress, [0.1, 0.5], [30, -30]);

  return (
    <div ref={containerRef} className="hidden lg:block min-h-screen bg-[#060606] text-[#F3F4F6] selection:bg-amber-500/30 font-sans antialiased relative">
      
      {/* Editorial Top Navigation */}
      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 bg-[#060606]/45 backdrop-blur-md border-b border-white/[0.04] transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto px-12 h-20 flex items-center justify-between">
          
          {/* Logo Column */}
          <div 
            onClick={() => handleScrollTo("home")}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-10 h-10 overflow-hidden rounded-sm border border-amber-500/20 group-hover:border-amber-500/40 transition-colors duration-500">
              <img 
                src="https://res.cloudinary.com/dvvugpu04/image/upload/v1785159774/Mgiftnana_logo_uvjolg.png" 
                alt="Mgiftna Logo" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-[0.25em] text-white uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                MGIFTNA
              </span>
              <span className="text-[9px] text-[#A3A3A3] font-medium uppercase tracking-[0.3em] mt-0.5">
                CARWASH & LOUNGE
              </span>
            </div>
          </div>

          {/* Minimalist Navigation Links */}
          <nav className="flex items-center gap-10">
            {[
              { id: "home", label: "Home" },
              { id: "dine", label: "Dine & Grill" },
              { id: "wash", label: "Car Wash" },
              { id: "events", label: "Events" },
              { id: "visit", label: "Visit & Map" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="relative py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 group"
              >
                <span className={activeSection === item.id ? "text-amber-500" : "text-[#A3A3A3] hover:text-white"}>
                  {item.label}
                </span>
                {activeSection === item.id && (
                  <motion.div 
                    layoutId="activeNavLine" 
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-amber-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenBooking("dine")}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A3A3] hover:text-white transition-colors duration-300"
            >
              Reserve Table
            </button>
            <button
              onClick={() => handleOpenBooking("wash")}
              className="px-6 py-3 border border-white/10 hover:border-white text-white text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black rounded-none"
            >
              Book Wash
            </button>
          </div>
        </div>
      </motion.header>

      {/* Floating Vertical Timeline Index indicator (Awwwards-style right edge) */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 items-end">
        {[
          { id: "home", num: "01", label: "INTRODUCTION" },
          { id: "dine", num: "02", label: "DINE & GRILL" },
          { id: "wash", num: "03", label: "CAR WASH" },
          { id: "events", num: "04", label: "EVENTS" },
          { id: "visit", num: "05", label: "VISIT & MAP" },
        ].map((item, i) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleScrollTo(item.id)}
              className="flex items-center gap-4 group text-right transition-all duration-500"
            >
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-mono tracking-wider transition-colors duration-300 ${isActive ? "text-amber-500" : "text-[#525252] group-hover:text-white"}`}>
                  {item.num}
                </span>
                <span className="text-[8px] font-semibold tracking-[0.2em] text-[#404040] group-hover:text-[#A3A3A3] transition-colors duration-300 opacity-0 group-hover:opacity-100 h-0 group-hover:h-3 overflow-hidden">
                  {item.label}
                </span>
              </div>
              <div className={`h-[1px] transition-all duration-500 ${isActive ? "w-10 bg-amber-500" : "w-4 bg-[#262626] group-hover:w-8 group-hover:bg-[#525252]"}`} />
            </button>
          );
        })}
      </div>

      {/* Sections Container */}
      <div className="relative">
        
        {/* ========================================================== */}
        {/* HERO SECTION: FULL-WIDTH CINEMATIC PARALLAX EXPERIENCE */}
        {/* ========================================================== */}
        <section 
          id="home" 
          className="relative h-screen min-h-[750px] w-full flex items-center overflow-hidden px-12 xl:px-24 z-10"
        >
          {/* Full-bleed Cinematic Parallax Background */}
          {/* NOTE FOR USER: Replace this div container with a <video autoplay loop muted playsinline className="absolute inset-0 w-full h-full object-cover"> tag for a full cinematic live video background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div 
              style={{ y: heroImageY }}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-[120%] relative"
            >
              <video
                src="https://res.cloudinary.com/dvvugpu04/video/upload/v1785169278/5644-183850491_medium_twj7b8.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.38] contrast-[1.1]"
              />
              
              {/* Premium dark gradient overlays for impeccable typography contrast and side vignette blending */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060606] to-transparent" />
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto w-full z-10 relative">
            <div className="max-w-3xl flex flex-col justify-center space-y-10">
              
              {/* Elegant Label */}
              <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-amber-500 text-[10px] font-semibold uppercase tracking-[0.4em] block"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  RESTAURANT • LOUNGE • AUTOMOTIVE DETAIL
                </motion.span>
              </div>

              {/* Master Typography Reveal (Apple / Porsche style) */}
              <div className="flex flex-col space-y-1">
                {[
                  { text: "GOOD TASTE.", color: "text-white" },
                  { text: "CLEAN LINES.", color: "text-white" },
                  { text: "NIGHTLIFE.", color: "text-amber-500" }
                ].map((line, i) => (
                  <div key={i} className="overflow-hidden h-[54px] lg:h-[72px] xl:h-[84px] flex items-center">
                    <motion.h1
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1.4, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      className={`text-[46px] lg:text-[64px] xl:text-[76px] font-normal leading-none tracking-tight uppercase ${line.color}`}
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {line.text}
                    </motion.h1>
                  </div>
                ))}
              </div>

              {/* Tagline Paragraph Reveal */}
              <div className="overflow-hidden">
                <motion.p
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[#A3A3A3] text-sm md:text-base leading-relaxed max-w-xl font-light"
                  style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                >
                  A harmonious dual sanctuary located in Clayville. Enjoy flame-kissed dry-aged steaks, crafted signature gold cocktails, and master-level luxury car detailing—all executed under one single aesthetic canopy.
                </motion.p>
              </div>

              {/* CTAs Reveal */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-6 pt-4"
              >
                <button
                  onClick={() => handleScrollTo("dine")}
                  className="group px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 flex items-center gap-3 rounded-none"
                >
                  Explore Dining
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => handleScrollTo("wash")}
                  className="group px-8 py-4 border border-white/10 hover:border-white/40 text-white text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 flex items-center gap-3 rounded-none"
                >
                  Book Wash
                  <Car className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Luxury scroll indicator badge at bottom */}
          <div className="absolute bottom-8 left-12 xl:left-24 z-10">
            <span className="text-[9px] font-semibold tracking-[0.3em] text-[#525252] animate-pulse uppercase">SCROLL TO DISCOVER</span>
          </div>
        </section>


        {/* ========================================================== */}
        {/* DINE & GRILL SECTION: EDITORIAL LAYOUT */}
        {/* ========================================================== */}
        <section 
          id="dine" 
          className="relative min-h-screen py-32 px-12 xl:px-24 border-t border-white/[0.03]"
        >
          {/* Huge background luxury layout letters */}
          <div className="absolute right-10 top-24 select-none opacity-[0.015] pointer-events-none">
            <span className="text-[320px] font-normal leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              DINE
            </span>
          </div>

          <div className="max-w-7xl mx-auto w-full space-y-24">
            
            {/* Header part with Vertical indicator */}
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Left rotated title bar */}
              <div className="col-span-1 hidden lg:flex items-center justify-center pt-2">
                <div className="rotate-90 origin-center whitespace-nowrap">
                  <span className="text-[#525252] text-[10px] font-semibold uppercase tracking-[0.5em]">
                    OUR KITCHEN • DINE
                  </span>
                </div>
              </div>

              {/* Main title & description */}
              <div className="col-span-11 space-y-6">
                <div className="overflow-hidden">
                  <motion.h2 
                    initial={{ y: "80%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl lg:text-5xl xl:text-6xl font-light text-white uppercase tracking-tight"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Culinary Masterpieces & <span className="italic text-amber-500">Fine Spirits</span>
                  </motion.h2>
                </div>
                
                <p className="text-[#A3A3A3] text-sm leading-relaxed max-w-2xl font-light" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                  Every cut of meat is hand-selected and dry-aged on site for optimal marbling and intensity. Savor plates finished over charcoal fires, then complement your meal with custom cold-smoked spirits.
                </p>
              </div>
            </div>

            {/* Straight Horizontal Category Tabs */}
            <div className="border-b border-white/[0.04] pb-2 flex justify-start lg:justify-center items-center overflow-x-auto scrollbar-none w-full">
              <div className="flex gap-2 md:gap-8 whitespace-nowrap pb-3">
                {[
                  { id: "all", label: "ALL DISHES" },
                  { id: "grills", label: "FLAME GRILLS" },
                  { id: "platters", label: "PLATTERS" },
                  { id: "cocktails", label: "COCKTAILS" },
                  { id: "wine", label: "WINE VINTAGES" },
                  { id: "desserts", label: "DESSERTS" },
                ].map((cat) => {
                  const isActive = selectedDineCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedDineCategory(cat.id as any)}
                      className="relative px-4 md:px-6 py-4 text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase transition-colors duration-300"
                    >
                      <span className={isActive ? "text-amber-500 font-bold" : "text-[#737373] hover:text-white"}>
                        {cat.label}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="activeDineTab" 
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asymmetric Editorial Layout: Grid Columns */}
            <div className="grid grid-cols-12 gap-12 xl:gap-20 items-stretch">
              
              {/* Left Column: Featured culinary image with clip path zoom reveal */}
              <div className="col-span-12 lg:col-span-6 flex flex-col justify-between space-y-8">
                <div className="relative overflow-hidden h-[450px] rounded-2xl bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/[0.04]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedDineCategory}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img 
                        src={DINE_CATEGORY_DETAILS[selectedDineCategory]?.image || DINE_CATEGORY_DETAILS.all.image}
                        alt={DINE_CATEGORY_DETAILS[selectedDineCategory]?.title || DINE_CATEGORY_DETAILS.all.title}
                        className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.05] transition-transform duration-[1200ms] hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Elegant Gradient Scrim overlay to protect text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Bottom Text */}
                  <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-amber-500 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {DINE_CATEGORY_DETAILS[selectedDineCategory]?.tag || DINE_CATEGORY_DETAILS.all.tag}
                      </p>
                      <h4 className="text-3xl text-white font-normal tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {DINE_CATEGORY_DETAILS[selectedDineCategory]?.title || DINE_CATEGORY_DETAILS.all.title}
                      </h4>
                    </div>
                    <span className="text-amber-500 font-serif text-xl font-medium">
                      {DINE_CATEGORY_DETAILS[selectedDineCategory]?.price || DINE_CATEGORY_DETAILS.all.price}
                    </span>
                  </div>
                </div>

                {/* Left Column: Subtle Editorial Sub-caption - Rounded, Soft Shadow, Hover Zoom, Premium spacing, No rigid card borders */}
                <div className="pt-6 flex flex-col justify-between space-y-6">
                  <p className="text-sm text-[#A3A3A3] font-light leading-relaxed pl-4 border-l border-amber-500/30">
                    "{DINE_CATEGORY_DETAILS[selectedDineCategory]?.description || DINE_CATEGORY_DETAILS.all.description}"
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-mono text-[#525252] uppercase tracking-[0.2em]">EXQUISITE CRAFTSMANSHIP</span>
                    <button 
                      onClick={() => handleOpenBooking("dine")}
                      className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      Reserve Table
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Refined Interactive Menu */}
              <div className="col-span-12 lg:col-span-6 flex flex-col justify-between pt-4">
                
                {/* Staggered Minimal Menu Lists - No heavy cards! */}
                <div className="flex-1 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filteredDineItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        onClick={() => setSelectedDineItem(item)}
                        className="group flex flex-col py-5 px-4 hover:bg-white/[0.02] border-b border-white/[0.04] cursor-pointer transition-colors duration-300"
                      >
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-[#404040] group-hover:text-amber-500 transition-colors duration-300">
                              0{index + 1}
                            </span>
                            <span className="text-sm font-light text-white group-hover:text-amber-500 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-amber-500 font-serif">R{item.price * 10}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#404040] group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                        {item.isPopular && (
                          <span className="text-[8px] tracking-[0.25em] text-amber-500/70 font-semibold uppercase mt-1 pl-7">
                            RECOMMENDED
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-8 pt-8 border-t border-white/[0.04] flex items-center justify-between">
                  <p className="text-[11px] text-[#525252] font-mono uppercase">PRICING SHOWN IN ZAR (SOUTH AFRICAN RAND)</p>
                  <button 
                    onClick={() => handleOpenBooking("dine")}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors duration-300"
                  >
                    Reserve Table Now &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================== */}
        {/* CAR WASH DETAIL SECTION: CINEMATIC PARALLAX */}
        {/* ========================================================== */}
        <section 
          id="wash" 
          className="relative min-h-screen py-32 px-12 xl:px-24 bg-gradient-to-b from-transparent to-[#070707] border-t border-white/[0.03]"
        >
          {/* Big background outline letter */}
          <div className="absolute left-10 top-24 select-none opacity-[0.015] pointer-events-none">
            <span className="text-[320px] font-normal leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              SHINE
            </span>
          </div>

          <div className="max-w-7xl mx-auto w-full space-y-24">
            
            {/* Header Column */}
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-1 hidden lg:flex items-center justify-center pt-2">
                <div className="rotate-90 origin-center whitespace-nowrap">
                  <span className="text-[#525252] text-[10px] font-semibold uppercase tracking-[0.5em]">
                    PRECISION DETAILED CARE
                  </span>
                </div>
              </div>

              <div className="col-span-11 space-y-6">
                <div className="overflow-hidden">
                  <motion.h2 
                    initial={{ y: "80%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl lg:text-5xl xl:text-6xl font-light text-white uppercase tracking-tight"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Bespoke Automotive <span className="italic text-amber-500">Detailing</span>
                  </motion.h2>
                </div>
                
                <p className="text-[#A3A3A3] text-sm leading-relaxed max-w-2xl font-light" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                  Your vehicle deserves more than just a quick rinse. Our team employs multi-stage chemical decontamination, dual-bucket scratchless wash procedures, leather feeding, and professional 9H ceramic coatings.
                </p>
              </div>
            </div>

            {/* Alternating Horizontal Rows - Clean, luxurious, non-card styling */}
            <div className="space-y-16">
              {WASH_PACKAGES.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group grid grid-cols-12 gap-8 py-8 px-6 hover:bg-white/[0.01] border-b border-white/[0.04] transition-all duration-500 items-center relative"
                >
                  {/* Subtle hover reveal backdrop overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Left Column: Number and Title */}
                  <div className="col-span-12 lg:col-span-4 space-y-2">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">0{idx + 1} / PACKAGE</span>
                    <h3 className="text-2xl text-white font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#737373] tracking-widest uppercase">{pkg.duration}</p>
                  </div>

                  {/* Middle Column: Short Description */}
                  <div className="col-span-12 lg:col-span-5 pr-0 lg:pr-8">
                    <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Right Column: Price & CTA */}
                  <div className="col-span-12 lg:col-span-3 flex items-center justify-between lg:justify-end gap-10">
                    <div className="flex flex-col items-start lg:items-end">
                      <span className="text-[8px] font-semibold text-[#525252] tracking-widest uppercase">INVESTMENT</span>
                      <span className="text-2xl text-amber-500 font-serif">R{pkg.price}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedWashPkg(pkg)}
                        className="px-4 py-2.5 border border-white/10 hover:border-amber-500/40 text-[10px] font-semibold tracking-widest uppercase text-[#A3A3A3] hover:text-amber-500 transition-colors duration-300"
                      >
                        VIEW FEAT
                      </button>
                      <button
                        onClick={() => handleOpenBooking("wash", pkg.id)}
                        className="p-3 bg-white text-black hover:bg-amber-500 hover:text-black transition-colors duration-300"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visual parallax center photo break */}
            <div className="relative h-[320px] rounded-sm overflow-hidden border border-white/[0.04]">
              <motion.img 
                style={{ y: washParallaxY }}
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop" 
                alt="Gloss Detail" 
                className="absolute inset-0 w-full h-[150%] object-cover object-center filter brightness-[0.6] contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-black/35" />
              <div className="absolute bottom-8 left-12">
                <span className="text-amber-500 text-[10px] font-semibold uppercase tracking-[0.3em]">CRAFTED PRECISION</span>
                <h3 className="text-3xl text-white font-normal mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Unrivaled Gloss, Hand-Applied Layers
                </h3>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================== */}
        {/* EVENTS SECTION: STAGGERED OVERLAPPING POSTERS */}
        {/* ========================================================== */}
        <section 
          id="events" 
          className="relative min-h-screen py-32 px-12 xl:px-24 border-t border-white/[0.03]"
        >
          {/* Big background outline letters */}
          <div className="absolute right-10 top-24 select-none opacity-[0.015] pointer-events-none">
            <span className="text-[320px] font-normal leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              NIGHTS
            </span>
          </div>

          <div className="max-w-7xl mx-auto w-full space-y-24">
            
            {/* Title Row */}
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-1 hidden lg:flex items-center justify-center pt-2">
                <div className="rotate-90 origin-center whitespace-nowrap">
                  <span className="text-[#525252] text-[10px] font-semibold uppercase tracking-[0.5em]">
                    CALENDAR • CURATED VIBES
                  </span>
                </div>
              </div>

              <div className="col-span-11 space-y-6">
                <div className="overflow-hidden">
                  <motion.h2 
                    initial={{ y: "80%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl lg:text-5xl xl:text-6xl font-light text-white uppercase tracking-tight"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Vibrant Evenings & <span className="italic text-amber-500">Live Showcases</span>
                  </motion.h2>
                </div>
                
                <p className="text-[#A3A3A3] text-sm leading-relaxed max-w-2xl font-light" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                  Mgiftna regularly curates selective weekend sessions, bespoke wine tastings, live showcases with award-winning artists, and high-profile social events. Secure your reservation beforehand to ensure access.
                </p>
              </div>
            </div>

            {/* Overlapping, Beautifully Handcrafted Poster Layout */}
            <div className="grid grid-cols-12 gap-12 items-stretch pt-8">
              {EVENT_ITEMS.map((evt, idx) => {
                // Different vertical offset speeds to create overlapping motion on scroll
                const offsetClass = idx === 1 ? "lg:-translate-y-8" : idx === 2 ? "lg:translate-y-8" : "";
                
                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.2, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className={`col-span-12 md:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-6 transition-transform duration-1000 ${offsetClass}`}
                  >
                    {/* Event image container */}
                    <div className="relative group overflow-hidden h-[450px] bg-[#0d0d0d] border border-white/[0.04]">
                      <motion.img 
                        src={evt.image} 
                        alt={evt.name} 
                        className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 group-hover:brightness-[0.8] transition-all duration-[2000ms]"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient card wash over */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Floating bottom detailed metadata */}
                      <div className="absolute bottom-8 left-8 right-8 space-y-2">
                        <p className="text-amber-500 text-[10px] font-mono tracking-widest uppercase">{evt.date} • {evt.time}</p>
                        <h4 className="text-2xl text-white font-light uppercase tracking-wide leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {evt.name}
                        </h4>
                      </div>
                    </div>

                    {/* Brief description under the poster with nice whitespace spacing */}
                    <div className="px-2 space-y-4">
                      <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                        {evt.description}
                      </p>
                      <button 
                        onClick={() => handleOpenBooking("dine", evt.name)}
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors duration-300 flex items-center gap-2 group"
                      >
                        SECURE TICKET & RESERVATION
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ========================================================== */}
        {/* INTERACTIVE VISIT & CONTACT SECTION */}
        {/* ========================================================== */}
        <section 
          id="visit" 
          className="relative min-h-screen py-32 px-12 xl:px-24 border-t border-white/[0.03] bg-gradient-to-b from-[#060606] to-[#030303]"
        >
          {/* Big background outline letter */}
          <div className="absolute left-10 top-24 select-none opacity-[0.015] pointer-events-none">
            <span className="text-[320px] font-normal leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              FIND
            </span>
          </div>

          <div className="max-w-7xl mx-auto w-full space-y-24">
            
            {/* Header */}
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-1 hidden lg:flex items-center justify-center pt-2">
                <div className="rotate-90 origin-center whitespace-nowrap">
                  <span className="text-[#525252] text-[10px] font-semibold uppercase tracking-[0.5em]">
                    VISIT • GEOGRAPHY
                  </span>
                </div>
              </div>

              <div className="col-span-11 space-y-6">
                <div className="overflow-hidden">
                  <motion.h2 
                    initial={{ y: "80%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl lg:text-5xl xl:text-6xl font-light text-white uppercase tracking-tight"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Locate the Sanctuary & <span className="italic text-amber-500">Contact Us</span>
                  </motion.h2>
                </div>
                
                <p className="text-[#A3A3A3] text-sm leading-relaxed max-w-2xl font-light" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                  Join us at our beautiful physical space. Find detailed hours below, maps integration, or initiate a secure contact inquiry instantly.
                </p>
              </div>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-12 gap-12 xl:gap-20 items-stretch">
              
              {/* Left Column: Direct Location details & hours */}
              <div className="col-span-12 lg:col-span-5 flex flex-col justify-between space-y-12">
                
                {/* Contact Columns */}
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-2">
                      <span className="text-[9px] font-semibold tracking-widest text-[#525252] uppercase block">OUR ADDRESS</span>
                      <p className="text-sm text-[#F3F4F6] font-light leading-relaxed">
                        {BUSINESS_DETAILS.address}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-semibold tracking-widest text-[#525252] uppercase block">CONTACT LINES</span>
                      <p className="text-sm text-[#F3F4F6] font-light">
                        Landline: {BUSINESS_DETAILS.phone}
                      </p>
                      <a 
                        href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-amber-500 hover:text-white transition-colors duration-300 flex items-center gap-1.5 pt-1"
                      >
                        <MessageCircle className="w-4 h-4 text-amber-500" />
                        WhatsApp: +27 {BUSINESS_DETAILS.whatsapp.substring(1)}
                      </a>
                    </div>
                  </div>

                  {/* Hours Grid */}
                  <div className="space-y-4 pt-6 border-t border-white/[0.04]">
                    <span className="text-[9px] font-semibold tracking-widest text-[#525252] uppercase block">OPERATION CALENDAR</span>
                    <div className="space-y-3">
                      {BUSINESS_DETAILS.hours.map((h, i) => (
                        <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-white/[0.02]">
                          <span className="text-[#A3A3A3] font-light">{h.days}</span>
                          <span className="text-white font-medium">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Instant Social links */}
                <div className="space-y-4 pt-8 border-t border-white/[0.04]">
                  <span className="text-[9px] font-semibold tracking-widest text-[#525252] uppercase block">SOCIAL DIRECTORY</span>
                  <div className="flex gap-4">
                    <a href="#" className="text-xs text-[#A3A3A3] hover:text-amber-500 tracking-wider uppercase transition-colors">INSTAGRAM</a>
                    <span className="text-[#262626]">•</span>
                    <a href="#" className="text-xs text-[#A3A3A3] hover:text-amber-500 tracking-wider uppercase transition-colors">FACEBOOK</a>
                    <span className="text-[#262626]">•</span>
                    <a href="#" className="text-xs text-[#A3A3A3] hover:text-amber-500 tracking-wider uppercase transition-colors">TIKTOK</a>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Dark Interactive Map */}
              <div 
                onClick={() => window.open("https://maps.google.com/?q=" + encodeURIComponent(BUSINESS_DETAILS.address), "_blank")}
                className="group col-span-12 lg:col-span-7 h-[500px] relative rounded-[24px] overflow-hidden border border-white/[0.08] bg-[#0c0c0c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] cursor-pointer transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_30px_70px_-10px_rgba(245,158,11,0.08)]"
              >
                {/* Map Wrapper with Grayscale Filter */}
                <div className="w-full h-full grayscale invert-[93%] hue-rotate-[185deg] contrast-[95%] brightness-[80%] transition-all duration-500 group-hover:brightness-[95%] group-hover:contrast-[100%] scale-[1.02]">
                  <iframe 
                    src={BUSINESS_DETAILS.mapsIframeUrl} 
                    title="Mgiftna Location Map"
                    className="w-full h-full border-0 pointer-events-none"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                
                {/* Custom Gold pulsing location pin with Business Name */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="flex items-center gap-3 bg-[#0B0B0C]/90 border border-[#F59E0B]/40 px-4 py-2.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-md -translate-y-4">
                    {/* Custom Pin Dot & Pulsing Accent */}
                    <div className="relative flex items-center justify-center shrink-0 w-6 h-6">
                      <span className="absolute w-6 h-6 bg-[#F59E0B]/25 rounded-full animate-ping" />
                      <span className="absolute w-3.5 h-3.5 bg-[#F59E0B]/40 rounded-full" />
                      <div className="w-3 h-3 bg-[#F59E0B] rounded-full border border-black shadow-lg z-10" />
                    </div>
                    
                    {/* Premium Business Name Label beside the pin */}
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-white uppercase tracking-[0.15em] whitespace-nowrap" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                        Mgiftana Carwash &amp; Lounge
                      </span>
                      <span className="text-[8px] font-bold text-amber-500/80 uppercase tracking-widest mt-0.5" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                        Private Lounge &amp; Detail Suite
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Action Button inside the map */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent container click from opening a second tab
                    window.open("https://maps.google.com/?q=" + encodeURIComponent(BUSINESS_DETAILS.address), "_blank");
                  }}
                  className="absolute bottom-6 right-6 bg-[#0B0B0C]/85 hover:bg-amber-500 hover:text-black hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 text-white border border-white/[0.08] px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2.5 backdrop-blur-md transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-20 cursor-pointer"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>


      {/* ========================================================== */}
      {/* DETAILED OVERLAY MODALS / DRAWER PANEL */}
      {/* ========================================================== */}
      
      {/* Booking Drawer Sheet */}
      <AnimatePresence>
        {isBookingOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-[#0a0a0a] border-l border-white/[0.05] p-12 overflow-y-auto z-50 flex flex-col justify-between space-y-10"
            >
              {/* Top part */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">SECURE BOOKING RESERVATION</span>
                  <button 
                    onClick={() => setIsBookingOpen(false)}
                    className="p-2 text-[#737373] hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl text-white font-normal uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Select Your <span className="italic text-amber-500">Sanctuary Vibe</span>
                  </h3>
                  
                  {/* Selector Segment */}
                  <div className="flex border border-white/[0.04] p-1 bg-white/[0.01]">
                    <button
                      type="button"
                      onClick={() => setBookingType("dine")}
                      className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-widest transition-colors ${bookingType === "dine" ? "bg-amber-500 text-black" : "text-[#737373] hover:text-white"}`}
                    >
                      Dine & Grill Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType("wash")}
                      className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-widest transition-colors ${bookingType === "wash" ? "bg-amber-500 text-black" : "text-[#737373] hover:text-white"}`}
                    >
                      Car Wash Detailing
                    </button>
                  </div>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleBookingSubmit} className="space-y-6 pt-4">
                  
                  {/* Select Service/Package */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">CHOOSE SPECIFIC SELECTION</label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.05] p-4 text-xs text-white uppercase tracking-widest focus:border-amber-500/60 focus:outline-none rounded-none"
                    >
                      {bookingType === "dine" ? (
                        <>
                          <option value="general-reservation" className="bg-[#0a0a0a]">GENERAL LOUNGE TABLE</option>
                          {DINE_ITEMS.map(item => (
                            <option key={item.id} value={item.id} className="bg-[#0a0a0a]">{item.name.toUpperCase()}</option>
                          ))}
                        </>
                      ) : (
                        WASH_PACKAGES.map(pkg => (
                          <option key={pkg.id} value={pkg.id} className="bg-[#0a0a0a]">{pkg.name.toUpperCase()}</option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Personal details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">FULL NAME</label>
                      <input 
                        type="text" 
                        required 
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="E.g., Lerato Nkosi"
                        className="w-full bg-transparent border-b border-white/[0.08] focus:border-amber-500 py-3 text-xs text-white focus:outline-none placeholder:text-[#404040]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">CONTACT EMAIL</label>
                      <input 
                        type="email" 
                        required 
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="lerato@domain.co.za"
                        className="w-full bg-transparent border-b border-white/[0.08] focus:border-amber-500 py-3 text-xs text-white focus:outline-none placeholder:text-[#404040]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">WHATSAPP / MOBILE NUMBER</label>
                      <input 
                        type="tel" 
                        required 
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="072 345 6789"
                        className="w-full bg-transparent border-b border-white/[0.08] focus:border-amber-500 py-3 text-xs text-white focus:outline-none placeholder:text-[#404040]"
                      />
                    </div>
                  </div>

                  {/* Operational details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">PREFERRED DATE</label>
                      <input 
                        type="date" 
                        required 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/[0.05] p-3 text-xs text-white focus:border-amber-500/60 focus:outline-none rounded-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">ARRIVAL TIME</label>
                      <input 
                        type="time" 
                        required 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/[0.05] p-3 text-xs text-white focus:border-amber-500/60 focus:outline-none rounded-none"
                      />
                    </div>
                  </div>

                  {bookingType === "dine" ? (
                    <div className="space-y-2">
                      <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">NUMBER OF GUESTS</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="20" 
                        required 
                        value={bookingGuests}
                        onChange={(e) => setBookingGuests(parseInt(e.target.value) || 2)}
                        className="w-full bg-white/[0.02] border border-white/[0.05] p-3 text-xs text-white focus:border-amber-500/60 focus:outline-none rounded-none"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">VEHICLE MAKE & MODEL</label>
                        <input 
                          type="text" 
                          required 
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          placeholder="E.g., VW Golf 8 R"
                          className="w-full bg-transparent border-b border-white/[0.08] focus:border-amber-500 py-3 text-xs text-white focus:outline-none placeholder:text-[#404040]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-semibold text-[#525252] tracking-widest uppercase">REGISTRATION NUMBER</label>
                        <input 
                          type="text" 
                          required 
                          value={vehicleReg}
                          onChange={(e) => setVehicleReg(e.target.value)}
                          placeholder="E.g., ND 123-456"
                          className="w-full bg-transparent border-b border-white/[0.08] focus:border-amber-500 py-3 text-xs text-white focus:outline-none placeholder:text-[#404040]"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none pt-4"
                  >
                    CONFIRM RESERVATION
                  </button>
                </form>
              </div>

              {/* Bottom detail footer */}
              <div className="pt-6 border-t border-white/[0.04]">
                <p className="text-[10px] text-[#525252] leading-relaxed">
                  Upon submission, our host desk will process your slot. An instant confirmation SMS/WhatsApp will be dispatched shortly after.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dine Detail Modal Overlay */}
      <AnimatePresence>
        {selectedDineItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDineItem(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-50 max-w-3xl w-full bg-[#0a0a0a] border border-white/[0.05] p-10 grid grid-cols-1 md:grid-cols-2 gap-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <button 
                onClick={() => setSelectedDineItem(null)}
                className="absolute top-6 right-6 text-[#737373] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="relative h-[300px] md:h-full bg-[#0d0d0d] overflow-hidden">
                <img 
                  src={selectedDineItem.image} 
                  alt={selectedDineItem.name} 
                  className="w-full h-full object-cover filter brightness-[0.8]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[8px] font-bold tracking-[0.2em] text-amber-500 border border-amber-500/20 bg-amber-500/[0.02] px-2 py-1 uppercase inline-block">
                    {selectedDineItem.category}
                  </span>
                  <h3 className="text-3xl text-white font-normal leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {selectedDineItem.name}
                  </h3>
                  <p className="text-sm text-amber-500 font-serif">R{selectedDineItem.price * 10}</p>
                  <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                    {selectedDineItem.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-semibold text-[#525252] tracking-wider uppercase block">FINE INGREDIENTS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDineItem.ingredients?.map((ing, i) => (
                        <span key={i} className="text-[9px] text-[#8C8C8C] border border-white/[0.05] px-2.5 py-1">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDineItem(null);
                    handleOpenBooking("dine", selectedDineItem.id);
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none text-center"
                >
                  RESERVE A TABLE
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wash Package Detail Modal Overlay */}
      <AnimatePresence>
        {selectedWashPkg && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWashPkg(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-50 max-w-3xl w-full bg-[#0a0a0a] border border-white/[0.05] p-10 grid grid-cols-1 md:grid-cols-2 gap-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <button 
                onClick={() => setSelectedWashPkg(null)}
                className="absolute top-6 right-6 text-[#737373] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="relative h-[300px] md:h-full bg-[#0d0d0d] overflow-hidden">
                <img 
                  src={selectedWashPkg.image} 
                  alt={selectedWashPkg.name} 
                  className="w-full h-full object-cover filter brightness-[0.8]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[8px] font-bold tracking-[0.2em] text-amber-500 border border-amber-500/20 bg-amber-500/[0.02] px-2 py-1 uppercase inline-block">
                    {selectedWashPkg.duration}
                  </span>
                  <h3 className="text-3xl text-white font-normal leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {selectedWashPkg.name}
                  </h3>
                  <p className="text-xl text-amber-500 font-serif">R{selectedWashPkg.price}</p>
                  <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                    {selectedWashPkg.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-semibold text-[#525252] tracking-wider uppercase block">TREATMENT PROTOCOLS</span>
                    <ul className="space-y-1.5">
                      {selectedWashPkg.features.map((feat, i) => (
                        <li key={i} className="text-[10px] text-[#8C8C8C] flex items-start gap-2">
                          <Check className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedWashPkg(null);
                    handleOpenBooking("wash", selectedWashPkg.id);
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none text-center"
                >
                  BOOK DETAILED APPOINTMENT
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Booking Modal Dialog */}
      <AnimatePresence>
        {successModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuccessModal(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed z-50 max-w-md w-full bg-[#0a0a0a] border border-white/[0.05] p-10 text-center space-y-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-amber-500/5 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5 text-amber-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl text-white font-normal uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Reservation <span className="italic text-amber-500">Processed</span>
                </h3>
                <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                  Thank you, <span className="text-white font-medium">{bookingName}</span>. Your reservation for <span className="text-amber-500 font-medium">{bookingType === "dine" ? "Dine & Grill" : "Car Detailing"}</span> has been transmitted.
                </p>
              </div>

              {/* Informative details block */}
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] text-left text-[10px] space-y-2 font-mono text-[#8C8C8C]">
                <p>STATUS: UNCONFIRMED (PENDING DESK REVIEW)</p>
                <p>DATE: {bookingDate}</p>
                <p>TIME: {bookingTime}</p>
                {bookingType === "dine" ? (
                  <p>COVERS: {bookingGuests} GUESTS</p>
                ) : (
                  <>
                    <p>VEHICLE: {vehicleModel.toUpperCase()}</p>
                    <p>REGISTRATION: {vehicleReg.toUpperCase()}</p>
                  </>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hi,%20I've%20just%20submitted%20a%20booking%20reservation%20for%20${bookingType === "dine" ? "Dining" : "Car%20Wash"}%20on%20${bookingDate}%20at%20${bookingTime}%20under%20the%20name%20${encodeURIComponent(bookingName)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366]/20 hover:bg-[#25D366]/35 text-[#25D366] text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  INSTANT WHATSAPP UPDATE
                </a>
                <button
                  onClick={() => setSuccessModal(false)}
                  className="w-full py-3 border border-white/10 hover:border-white text-white text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none"
                >
                  CLOSE DIALOG
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
