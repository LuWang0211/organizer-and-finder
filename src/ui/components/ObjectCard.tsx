import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { IconImage } from "@/ui/components/IconImage";
import type { HouseholdIconKey } from "@/ui/iconPresets";
import { cn } from "@/utils/tailwind";

// Re-export for convenience (alias for ObjectCardIconKey)
export type ObjectCardIconKey = HouseholdIconKey;

const objectCardVariants = cva(
  [
    // Base styles - outer wrapper for the card border effect
    "relative flex items-center justify-center",
  ],
  {
    variants: {
      size: {
        // Direct Tailwind classes for card width and content height
        sm: ["w-[280px]", "h-[90px]"],
        md: ["w-[300px]", "h-[100px]"],
        lg: ["w-[340px]", "h-[110px]"],
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

/**
 * Max icon sizes for each card size
 * Used to calculate icon size based on ratio
 */
const iconMaxSizes = {
  sm: 50,
  md: 60,
  lg: 70,
} as const;

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
  extraFootNote?: string;
  /** Alt text for the icon image */
  iconAlt?: string;
  /** Icon size ratio relative to card's max icon size (0.2 to 1.0) */
  iconRatio?: number;
}

const ObjectCard = ({
  className,
  size = "sm",
  iconKey,
  iconSrc,
  title,
  detail,
  extraInfo,
  extraFootNote,
  iconAlt = "icon",
  iconRatio,
  style,
  ref,
  ...props
}: ObjectCardProps & React.RefAttributes<HTMLDivElement>) => {
  const baseIconSize = iconMaxSizes[size ?? "sm"];
  const hasExtraColumn = !!(extraInfo || extraFootNote);

  // Icon column width stays same - this keeps icon position fixed
  const gridTemplateColumns = `auto 1fr ${hasExtraColumn ? "25%" : "15px"}`;

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
          height: "100%",
          width: "100%",
          gridTemplateColumns,
        }}
      >
        {/* Column 1: Icon */}
        <div
          className="flex items-center justify-center pl-5 pr-3"
          style={{ height: "100%" }}
        >
          <IconImage
            iconSrc={iconSrc}
            iconKey={iconKey}
            alt={iconAlt}
            baseSize={baseIconSize}
            ratio={iconRatio ?? 1.0}
          />
        </div>

        {/* Column 2: Main info */}
        <div
          className={cn(
            "flex flex-col px-3 min-w-0 self-start justify-center text-ellipsis",
            {
              "items-center": !hasExtraColumn,
            },
          )}
          style={{ paddingTop: 20, paddingBottom: 20, minHeight: 50 }}
        >
          {/* Main title */}
          <div className="font-hand max-w-full text-md font-bold text-text-main truncate leading-normal">
            {title}
          </div>
          {/* Detail info */}
          {detail && (
            <div className="font-hand max-w-full text-sm text-text-detail truncate leading-normal">
              {detail}
            </div>
          )}
        </div>

        {/* Column 3: Extra info */}
        {hasExtraColumn && (
          <div
            className="flex flex-col items-end pr-5 pl-3 self-start justify-center"
            style={{
              paddingTop: 25,
              paddingBottom: 15,
              minHeight: 50,
            }}
          >
            {extraInfo && (
              <div className="font-hand text-sm text-text-detail truncate leading-normal">
                {extraInfo}
              </div>
            )}
            {extraFootNote && (
              <div className="font-hand text-xs text-text-footnote truncate leading-normal mt-3.5 rounded-2xl">
                {extraFootNote}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ObjectCard.displayName = "ObjectCard";

export { ObjectCard, objectCardVariants };
