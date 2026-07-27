import { DineItem, WashPackage } from "./types";

export const DINE_ITEMS: DineItem[] = [
  {
    id: "dine-1",
    name: "Dry-Aged Wagyu Ribeye",
    category: "grills",
    price: 68,
    description: "400g of dry-aged Japanese Wagyu, seared over charcoal, basted with dynamic bone marrow butter, served with roasted heirloom garlic.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    ingredients: ["A5 Wagyu Beef", "Smoked Sea Salt", "Heirloom Garlic", "Bone Marrow Butter", "Fresh Rosemary"],
    isFeatured: true,
    isPopular: true
  },
  {
    id: "dine-2",
    name: "Signature Tomahawk Feast",
    category: "grills",
    price: 135,
    description: "1.2kg flame-grilled prime Tomahawk steak, carved tableside with truffle-infused chimichurri and hand-harvested maldon salt flakes.",
    image: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Prime Tomahawk", "Black Truffle Oil", "Maldon Sea Salt", "Fresh Parsley & Garlic Chimichurri"],
    isPopular: true
  },
  {
    id: "dine-3",
    name: "Imperial Seafood Platter",
    category: "platters",
    price: 110,
    description: "A decadent sharing selection of butter-poached lobster tails, wild oysters, grilled tiger prawns, and ocean trout sashimi.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Maine Lobster", "Wild-Caught Oysters", "Black Tiger Prawns", "Ocean Trout", "Saffron Aioli"],
    isPopular: true
  },
  {
    id: "dine-4",
    name: "Charcoal Grazing Board",
    category: "platters",
    price: 52,
    description: "Curated artisanal cured meats, oak-smoked local cheeses, honeycomb, house-pickled seasonal berries, and warm olive-oil flatbread.",
    image: "https://res.cloudinary.com/dvvugpu04/image/upload/v1785164811/Grazing-platter-8cd15be_y6l5uh.jpg",
    ingredients: ["Serrano Ham", "Truffle Salami", "Smoked Gouda", "Raw Honeycomb", "Sourdough Flatbread"]
  },
  {
    id: "dine-5",
    name: "Amber Old Fashioned",
    category: "cocktails",
    price: 22,
    description: "Bespoke blend of double-wood Kentucky bourbon, charred orange peel, house bitters, cold-smoked with applewood under a glass cloche.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Kentucky Bourbon", "Charred Orange Peel", "Angostura Bitters", "Smoked Applewood", "Amber Honey Syrup"],
    isFeatured: true,
    isPopular: true
  },
  {
    id: "dine-6",
    name: "Golden Hour Negroni",
    category: "cocktails",
    price: 20,
    description: "Infused dry gin, sweet white vermouth, and premium gentian liqueur, garnished with a 24k gold leaf rim.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Botanical Gin", "White Vermouth", "Suze Liqueur", "24k Edible Gold Leaf", "Dehydrated Grapefruit"],
    isPopular: true
  },
  {
    id: "dine-7",
    name: "Dark Chocolate Lava & Gold",
    category: "desserts",
    price: 18,
    description: "Decadent 72% Valrhona dark chocolate cake with a molten core, paired with hand-churned vanilla bean gelato and dark cocoa soil.",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Valrhona Dark Chocolate", "Vanilla Bean Gelato", "Cocoa Powder", "Gold Flakes", "Fresh Mint Leaf"]
  },
  {
    id: "dine-8",
    name: "Cabernet Sauvignon Vintage 2018",
    category: "wine",
    price: 32, // per glass
    description: "Full-bodied reserve red wine with rich aromas of blackberry, dark chocolate, toasted oak, and a velvet-smooth tannic finish.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Estate Cabernet Grapes", "Oak Barrel Aged", "Napa Valley Vintage 2018"]
  }
];

export const WASH_PACKAGES: WashPackage[] = [
  {
    id: "wash-1",
    name: "Quick Wash & Gloss",
    price: 250,
    duration: "30 Mins",
    description: "High-pressure exterior foam wash, wheel barrel brake dust extraction, hand dry, finished with a premium high-gloss spray sealant.",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800&auto=format&fit=crop",
    features: [
      "pH-neutral high-cling snow foam wash",
      "Two-bucket scratchless touch wash",
      "Deep-clean wheels & tire dressing",
      "Blow-dry seams & mirror housings",
      "Express high-gloss spray sealant coating"
    ]
  },
  {
    id: "wash-2",
    name: "Executive Detail",
    price: 400,
    duration: "1.5 Hours",
    description: "Meticulous deep-cleansing for interior and exterior. Leather conditioning, steam sanitize, clay bar finish, and dual-layer hybrid wax protection.",
    image: "https://res.cloudinary.com/dvvugpu04/image/upload/v1785164183/peeonelove-wash-5144821_moemys.jpg",
    features: [
      "All services in 'Quick Wash & Gloss'",
      "Clay bar paint purification treatment",
      "Full vacuuming & fine crevice brush detailing",
      "Steam cleaning & active surface sanitizing",
      "Premium leather feeding & dashboard conditioning",
      "Hand-applied dual-layer hybrid SiO2 carnuba wax"
    ],
    isPopular: true
  },
  {
    id: "wash-3",
    name: "Bespoke Full Detail",
    price: 600,
    duration: "3 Hours",
    description: "The ultimate reconditioning process. Engine bay cleaning, machine paint correction, carpet hot-water extraction, and complete glass hydro-shield.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    features: [
      "All services in 'Executive Detail'",
      "Complete machine-polish paint correction (1-stage)",
      "Hot-water extraction shampooing for carpets & mats",
      "Engine bay degrease, clean & bespoke dressing",
      "Wheel well cleaning & suspension detail",
      "All exterior glass treated with hydrophobic shield"
    ]
  },
  {
    id: "wash-4",
    name: "Ultra Ceramic Care",
    price: 850,
    duration: "5 Hours",
    description: "Elite paint preservation. Multi-stage decontamination, high-gloss paint correction, and professional-grade multi-year ceramic coating application.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop",
    features: [
      "All services in 'Bespoke Full Detail'",
      "Multi-stage chemical & mechanical paint decontamination",
      "Elite 2-stage compounding and refining paint correction",
      "Professional 9H multi-year Ceramic Coating application",
      "Coating applied to paintwork, trim, wheel faces & glass",
      "Includes an official multi-year care certification"
    ]
  }
];

export const BUSINESS_DETAILS = {
  name: "Mgiftna Carwash & Lounge",
  tagline: "The Art of Culinary Lounge & Precision Automotive Detailing",
  address: "2937 Berylium Rd, Clayville, Olifantsfontein, 1666",
  phone: "011 201 4742",
  whatsapp: "0723451391",
  email: "curator@mgiftna.co.za",
  hours: [
    { days: "Mon - Thu", time: "8:00 AM - 9:00 PM" },
    { days: "Fri - Sat", time: "7:30 AM - 2:00 AM" },
    { days: "Sunday", time: "8:00 AM - 2:00 AM" }
  ],
  mapsIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.4975191834167!2d28.21!3d-25.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sClayville%2C%20Olifantsfontein!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
};

export interface EventItem {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  image: string;
  category?: string;
  isFeatured?: boolean;
}

export const EVENT_ITEMS: EventItem[] = [
  {
    id: "evt-1",
    name: "Mgiftana's Birthday Celebration",
    date: "Friday, Nov 13",
    time: "07:00 PM - Late",
    description: "Join our landmark annual birthday celebration with premier guest DJs, luxury champagne towers, and gourmet dining.",
    image: "https://res.cloudinary.com/dvvugpu04/image/upload/v1785161176/Mgiftanas_Birthday_tyoeif.png",
    isFeatured: true
  },
  {
    id: "evt-2",
    name: "Friday Ladies Night with Focalistic",
    date: "Friday, Oct 30",
    time: "08:00 PM - 02:00 AM",
    description: "An unforgettable evening featuring live performance by Focalistic, complimentary welcome cocktails for ladies, and premium lounge vibes.",
    image: "https://res.cloudinary.com/dvvugpu04/image/upload/v1785161235/Friday_Ladies_Night_Focalistic_p0rv84.png"
  },
  {
    id: "evt-3",
    name: "Mimosa Sunday with Sennere",
    date: "Sunday, Nov 01",
    time: "12:00 PM - 08:00 PM",
    description: "Wind down your weekend with flowing mimosas, deep soulful house sets by Sennere, and gourmet grazing platters.",
    image: "https://res.cloudinary.com/dvvugpu04/image/upload/v1785161280/Mimosa_Sunday_Sennere_el5jyu.png"
  }
];

