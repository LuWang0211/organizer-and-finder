export interface MarqueeItem {
  textureKey: string;
  label: string;
  locationName?: string | null;
}

export interface MarqueeEntry {
  textureKey: string;
  label: string;
  locationName: string | null;
  x: number;
  width: number;
  height: number;
  scale: number;
  image: Phaser.GameObjects.Image | null;
  frame: Phaser.GameObjects.Image | null;
  isHovered: boolean;
  isSelected?: boolean;
}

export type MarqueeTooltipDetail = {
  label: string;
  locationName: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const MIN_MARQUEE_SPEED = -25;
export const MAX_MARQUEE_SPEED = -250;
export const GAP = 55;
export const HOVER_STOP_RATIO = 0.65;
export const MARQUEE_TOOLTIP_EVENT = "search-marquee-tooltip";
export const MARQUEE_TOOLTIP_CLEAR_EVENT = "search-marquee-tooltip-clear";
