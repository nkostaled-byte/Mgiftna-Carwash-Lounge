export type ScreenType = "home" | "dine" | "wash" | "events" | "book" | "visit";

export type DineCategory = "grills" | "platters" | "cocktails" | "desserts" | "wine";

export interface DineItem {
  id: string;
  name: string;
  category: DineCategory;
  price: number;
  description: string;
  image: string;
  ingredients: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
}

export interface WashPackage {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g., "45 mins", "2 hours"
  description: string;
  image: string;
  features: string[];
  isPopular?: boolean;
}

export interface Booking {
  id: string;
  type: "dine" | "wash";
  date: string;
  time: string;
  guests?: number; // for dine
  tableName?: string; // e.g., "VIP Booth", "Standard Lounge Table"
  vehicleModel?: string; // for wash
  vehicleType?: string; // for wash
  packageName?: string; // for wash
  eventId?: string; // for event RSVPs
  status: "confirmed" | "completed" | "cancelled";
  email: string;
  phone: string;
  createdAt: string;
}
