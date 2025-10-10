import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BedDouble,
  Book,
  Bookmark,
  BookOpen,
  Box,
  Car,
  CookingPot,
  FilePlus2,
  FileQuestionMark,
  Folder,
  HousePlus,
  Laptop,
  MapPin,
  Package,
  Plus,
  Shirt,
  ShowerHead,
  Sofa,
  Star,
  Tag,
  Utensils,
  WashingMachine,
} from "lucide-react";

export type IconKey =
  | "box"
  | "package"
  | "archive"
  | "map-pin"
  | "folder"
  | "tag"
  | "bookmark"
  | "star"
  // Location-related
  | "bed-double"
  | "cooking-pot"
  | "sofa"
  | "shower-head"
  | "washing-machine"
  | "car"
  | "shirt"
  | "utensils"
  // Item-related
  | "book"
  | "book-open"
  | "laptop"
  | "file-question-mark"
  // Action icons
  | "house-plus"
  | "file-plus-2"
  | "plus";

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

export const ICON_COMPONENTS: Record<IconKey, LucideIcon> = {
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
};
