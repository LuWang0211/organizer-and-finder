import type { Metadata } from "next";

/**
 * UI Style Page Metadata
 * Each page.tsx under /ui_style should export this to define its display info
 */
export interface UIStylePageMeta extends Metadata {
  /** Page title shown in nav bar */
  title: string;
  /** Optional override for nav bar label (defaults to title if not provided) */
  navLabel?: string;
}

/**
 * Type guard to check if a value is a valid UIStylePageMeta
 */
export function isUIStylePageMeta(value: unknown): value is UIStylePageMeta {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.title === "string" &&
    (obj.navLabel === undefined || typeof obj.navLabel === "string")
  );
}
