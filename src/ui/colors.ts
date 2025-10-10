// FloorPlan colors with Tailwind CSS integration

import { formatHex, oklch } from "culori";
import tailwindColors from "tailwindcss/colors";

export const FloorPlanColors = [
  "gray-500", // Default gray
  "red-500",
  "yellow-500",
  "green-700",
  "blue-700",
  "purple-800",
] as const;

export type FloorPlanColor = (typeof FloorPlanColors)[number];

// Convert OKLCH color string to hex using culori library
function oklchToHex(oklchString: string): string {
  try {
    // Parse OKLCH string format: "oklch(L% C H)"
    const match = oklchString.match(
      /oklch\(([0-9.]+)%\s+([0-9.]+)\s+([0-9.]+)\)/,
    );
    if (!match) {
      return "#6b7280"; // fallback gray
    }

    const L = parseFloat(match[1]) / 100; // Lightness (0-1)
    const C = parseFloat(match[2]); // Chroma (0+)
    const H = parseFloat(match[3]); // Hue (0-360)

    // Use culori for accurate OKLCH to hex conversion
    const color = oklch({ mode: "oklch", l: L, c: C, h: H });
    const hexColor = formatHex(color);

    return hexColor || "#6b7280"; // fallback
  } catch (error) {
    console.warn("OKLCH to hex conversion failed:", error);
    return "#6b7280"; // fallback gray
  }
}

// Query Tailwind colors dynamically
function getTailwindColorHex(colorKey: FloorPlanColor): string {
  const colors = tailwindColors as Record<string, any>;
  const [colorName, shade] = colorKey.split("-");
  const colorFamily = colors[colorName];

  if (colorFamily && typeof colorFamily === "object" && shade in colorFamily) {
    const oklchValue = colorFamily[shade];
    return oklchToHex(oklchValue);
  }

  return "#000000";
}

// Dynamic color mapping derived from FloorPlanColors array
const FloorPlanColorHex: Record<FloorPlanColor, string> = Object.fromEntries(
  FloorPlanColors.map((color) => [color, getTailwindColorHex(color)]),
) as Record<FloorPlanColor, string>;

export function getColorByNumber(index: number): FloorPlanColor {
  return FloorPlanColors[index % FloorPlanColors.length];
}

export function getHexColorByName(colorName: FloorPlanColor): string {
  return FloorPlanColorHex[colorName] ?? FloorPlanColorHex["gray-500"];
}

export function getHexNumberByName(colorName: FloorPlanColor): number {
  const hexString = getHexColorByName(colorName);
  return parseInt(hexString.substring(1), 16);
}
