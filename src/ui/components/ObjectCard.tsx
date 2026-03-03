import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";
import { HOUSEHOLD_ICON_IMAGES, type HouseholdIconKey } from "@/ui/iconPresets";
import { cn } from "@/utils/tailwind";

// Re-export for convenience (alias for ObjectCardIconKey)
export type ObjectCardIconKey = HouseholdIconKey;

// Combined size config: width (for CVA) and height (for content area)
const cardSizes = {
  sm: { width: "w-[280px]", height: 90, maxIconSize: 50 },
  md: { width: "w-[300px]", height: 100, maxIconSize: 60 },
  lg: { width: "w-[340px]", height: 110, maxIconSize: 70 },
};

const objectCardVariants = cva(
  [
    // Base styles - outer wrapper for the card border effect
    "relative flex items-center justify-center",
  ],
  {
    variants: {
      size: {
        sm: [cardSizes.sm.width],
        md: [cardSizes.md.width],
        lg: [cardSizes.lg.width],
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

/**
 * Calculate icon size based on card size and optional ratio.
 * Similar to IconV2's ratio-based approach:
 * - If iconRatio is provided (0.2 to 1.0), scale relative to maxIconSize
 * - Otherwise use default ratio of 1.0
 */
function getIconSize(
  iconRatio: number | undefined,
  cardSize: "sm" | "md" | "lg",
): number {
  const maxIconSize = cardSizes[cardSize].maxIconSize;
  const defaultRatio = 1.0;
  const ratio = iconRatio
    ? Math.min(Math.max(iconRatio, 0.2), 1)
    : defaultRatio;
  return Math.round(maxIconSize * ratio);
}

export interface ObjectCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof objectCardVariants> {
  /** Icon key for the object image */
  iconKey?: ObjectCardIconKey;
  /** Custom icon image source (overrides iconKey) */
  iconSrc?: string;
  /** Main title (e.g., item name or location name) */
  title: string;
  /** Detail info shown below title in column 2 */
  detail?: string;
  /** Additional info shown in column 3, top row */
  extraInfo?: string;
  /** Additional info shown in column 3, bottom row */
  extraInfo2?: string;
  /** Alt text for the icon image */
  iconAlt?: string;
  /** Icon size ratio relative to card's max icon size (0.2 to 1.0) */
  iconRatio?: number;
}

const ObjectCard = React.forwardRef<HTMLDivElement, ObjectCardProps>(
  (
    {
      className,
      size = "sm",
      iconKey,
      iconSrc,
      title,
      detail,
      extraInfo,
      extraInfo2,
      iconAlt = "icon",
      iconRatio,
      style,
      ...props
    },
    ref,
  ) => {
    // Resolve image source from iconKey or custom src
    const imageSrc =
      iconSrc || (iconKey ? HOUSEHOLD_ICON_IMAGES[iconKey] : undefined);
    const cardHeight = cardSizes[size ?? "sm"].height;
    const iconSizeValue = getIconSize(iconRatio, size ?? "sm");
    // Extra column width scales with card size
    const extraColumnWidth = { sm: 60, md: 70, lg: 80 }[size ?? "sm"];

    return (
      <div
        ref={ref}
        className={cn(objectCardVariants({ size }), className, "group")}
        style={style}
        {...props}
      >
        {/* Card background with border-image 9-slice effect */}
        <div
          className={cn(
            "transition-all duration-200 ease-out box-border absolute group-hover:inset-0 inset-1",
          )}
          style={{
            border: "30px solid transparent",
            borderImageSource: "url('/textures/card-new.png')",
            borderImageSlice: "87 213 70 167",
            borderImageRepeat: "repeat",
            borderImageWidth: "87px 213px 70px 167px",
          }}
        />
        {/* Content - positioned absolutely on top of the card */}
        <div
          className="relative z-10 grid items-stretch transition-transform duration-200 group-hover:scale-105"
          style={{
            height: cardHeight,
            // All columns fixed width: icon | middle | extra
            gridTemplateColumns: `${iconSizeValue + 20}px 140px ${extraColumnWidth}px`,
          }}
        >
          {/* Column 1: Icon */}
          <div
            className="flex items-center justify-center pl-5 pr-3"
            style={{ height: cardHeight }}
          >
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={iconAlt}
                width={iconSizeValue}
                height={iconSizeValue}
                className="object-contain"
                unoptimized
                style={{ width: iconSizeValue, height: iconSizeValue }}
              />
            )}
          </div>

          {/* Column 2: Main info */}
          <div
            className="flex flex-col px-3 min-w-0 self-start justify-center"
            style={{ paddingTop: 20, paddingBottom: 20, minHeight: 50 }}
          >
            {/* Main title */}
            <div className="font-['Patrick_Hand',cursive] text-md font-bold text-[#4a3b2a] truncate leading-normal">
              {title}
            </div>
            {/* Detail info */}
            {detail && (
              <div className="font-['Patrick_Hand',cursive] text-sm text-[#6b5d4f] truncate leading-normal">
                {detail}
              </div>
            )}
          </div>

          {/* Column 3: Extra info */}
          {(extraInfo || extraInfo2) && (
            <div
              className="flex flex-col items-end pr-5 pl-3 self-start justify-center"
              style={{ paddingTop: 25, paddingBottom: 15, minHeight: 50 }}
            >
              {extraInfo && (
                <div className="font-['Patrick_Hand',cursive] text-sm text-[#6b5d4f] truncate leading-normal">
                  {extraInfo}
                </div>
              )}
              {extraInfo2 && (
                <div className="font-['Patrick_Hand',cursive] text-xs text-[#8b7d6f] truncate leading-normal mt-3.5">
                  {extraInfo2}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
ObjectCard.displayName = "ObjectCard";

export { ObjectCard, objectCardVariants };
