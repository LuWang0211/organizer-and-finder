/**
 * Calculate icon size based on base size and optional ratio.
 * Clamps ratio between 0.2 and 1.0
 */
export function calculateIconSize(
  baseSize: number,
  iconRatio?: number,
  defaultRatio: number = 1.0,
): number {
  const ratio = iconRatio
    ? Math.min(Math.max(iconRatio, 0.2), 1)
    : defaultRatio;
  return Math.round(baseSize * ratio);
}
