import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ArrowLeft,
  BedDouble,
  Bell,
  Book,
  Bookmark,
  BookOpen,
  Box,
  Car,
  CookingPot,
  FilePlus2,
  FileQuestionMark,
  Folder,
  Heart,
  Home,
  HousePlus,
  Laptop,
  Magnet,
  Mail,
  MapPin,
  Package,
  Plus,
  Search,
  Settings,
  Shirt,
  ShowerHead,
  Smile,
  Sofa,
  Star,
  Tag,
  User,
  Utensils,
  WashingMachine,
} from "lucide-react";

const ICON_COMPONENTS_RAW = {
  box: Box,
  package: Package,
  archive: Archive,
  "map-pin": MapPin,
  folder: Folder,
  tag: Tag,
  bookmark: Bookmark,
  star: Star,
  // Location-related
  "bed-double": BedDouble,
  "cooking-pot": CookingPot,
  sofa: Sofa,
  "shower-head": ShowerHead,
  "washing-machine": WashingMachine,
  car: Car,
  shirt: Shirt,
  utensils: Utensils,
  // Item-related
  book: Book,
  "book-open": BookOpen,
  laptop: Laptop,
  "file-question-mark": FileQuestionMark,
  // Action icons
  "house-plus": HousePlus,
  "file-plus-2": FilePlus2,
  plus: Plus,
  // UI/General icons
  smile: Smile,
  heart: Heart,
  home: Home,
  settings: Settings,
  user: User,
  bell: Bell,
  mail: Mail,
  magnet: Magnet,
  search: Search,
  "arrow-left": ArrowLeft,
} as const;

export type IconKey = keyof typeof ICON_COMPONENTS_RAW;

export const ICON_COMPONENTS: Record<IconKey, LucideIcon> = ICON_COMPONENTS_RAW;

// Focused gallery for Location selection
export const LOCATION_ICON_OPTIONS: { key: IconKey; label: string }[] = [
  { key: "map-pin", label: "Map Pin" },
  { key: "bed-double", label: "Bedroom" },
  { key: "cooking-pot", label: "Kitchen" },
  { key: "sofa", label: "Living Room" },
  { key: "shower-head", label: "Bathroom" },
  { key: "washing-machine", label: "Laundry" },
  { key: "shirt", label: "Closet" },
  { key: "car", label: "Garage" },
  { key: "utensils", label: "Dining" },
];

// Focused gallery for Item selection
export const ITEM_ICON_OPTIONS: { key: IconKey; label: string }[] = [
  { key: "package", label: "Package" },
  { key: "box", label: "Box" },
  { key: "archive", label: "Archive" },
  { key: "folder", label: "Folder" },
  { key: "tag", label: "Tag" },
  { key: "bookmark", label: "Bookmark" },
  { key: "star", label: "Star" },
  { key: "book", label: "Book" },
  { key: "book-open", label: "Books" },
  { key: "laptop", label: "Laptop" },
];

// ============================================================
// Image-based household item icons (PNG files in public folder)
// ============================================================

/** Type for household item image icons */
export type HouseholdIconKey =
  | "book"
  | "bookshelf"
  | "glasses"
  | "mug"
  | "nightstand"
  | "pajamas"
  | "remote"
  | "laptop";

/** Map household icon keys to their image paths (relative to public folder) */
export const HOUSEHOLD_ICON_IMAGES: Record<HouseholdIconKey, string> = {
  book: "/icons/household_items/icon-book.png",
  bookshelf: "/icons/household_items/icon-bookshelf.png",
  glasses: "/icons/household_items/icon-glasses.png",
  mug: "/icons/household_items/icon-mug.png",
  nightstand: "/icons/household_items/icon-nightstand.png",
  pajamas: "/icons/household_items/icon-pajamas.png",
  remote: "/icons/household_items/icon-remote.png",
  laptop: "/icons/household_items/icon-laptop.png",
};

/** Convenience array for iteration/display purposes */
export const HOUSEHOLD_ICON_OPTIONS: {
  key: HouseholdIconKey;
  label: string;
}[] = [
  { key: "book", label: "Book" },
  { key: "bookshelf", label: "Bookshelf" },
  { key: "glasses", label: "Glasses" },
  { key: "mug", label: "Mug" },
  { key: "nightstand", label: "Nightstand" },
  { key: "pajamas", label: "Pajamas" },
  { key: "remote", label: "Remote" },
  { key: "laptop", label: "Laptop" },
];
