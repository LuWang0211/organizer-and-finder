import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";
import { HOUSEHOLD_ICON_IMAGES, type HouseholdIconKey } from "@/ui/iconPresets";
import { cn } from "@/utils/tailwind";

// Re-export for convenience
export type { HouseholdIconKey };

// Base styles shared by all icons
const baseIconStyles = [
  "relative inline-flex items-center justify-center transition-all duration-200",
  "hover:scale-[1.05] will-change-transform",
];

// Frame shape styles
const frameShapeStyles = {
  rounded: "rounded-[15px]",
  circle: "rounded-full",
};

const iconV2Variants = cva(baseIconStyles, {
  variants: {
    frameShape: {
      rounded: frameShapeStyles.rounded,
      circle: frameShapeStyles.circle,
    },
    variant: {
      default: [
        "bg-gradient-to-b from-[#fff8e7] via-[#faf0d0] to-[#f5e8bc]",
        "border-[#c9a962]",
        "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,#f5e8bc,black_15%)_inset]",
        "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)_inset,3px_-3px_8px_0_color-mix(in_oklch,#f5e8bc,black_20%)_inset]",
      ],
      primary: [
        "bg-gradient-to-bl from-[#f5c5c5] via-[#ee9392] to-[#e87f7f]",
        "border-[#d67575]",
        "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,#e87f7f,black_15%)_inset]",
        "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)_inset,3px_-3px_8px_0_color-mix(in_oklch,#e87f7f,black_20%)_inset]",
      ],
      secondary: [
        "bg-gradient-to-bl from-[#d4f5d4] via-[#b8e6b8] to-[#9ed99e]",
        "border-[#8bc48b]",
        "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,#9ed99e,black_15%)_inset]",
        "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)_inset,3px_-3px_8px_0_color-mix(in_oklch,#9ed99e,black_20%)_inset]",
      ],
      orange: [
        "bg-gradient-to-bl from-[#ffe4c4] via-[#ffd4a3] to-[#ffc98a]",
        "border-[#e8b87d]",
        "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,#ffc98a,black_15%)_inset]",
        "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)_inset,3px_-3px_8px_0_color-mix(in_oklch,#ffc98a,black_20%)_inset]",
      ],
      wood: [
        "bg-gradient-to-bl from-[color-mix(in_oklch,#d4a574,white_70%)] via-[#c4956a] to-[#a67c52]",
        "border-[#8b6914]",
        "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,hsl(var(--card)),black_8%)_inset]",
        "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)_inset,3px_-3px_8px_0_color-mix(in_oklch,hsl(var(--card)),black_12%)_inset]",
      ],
    },
    size: {
      tiny: ["border-2"],
      default: ["border-3"],
      lg: ["border-4"],
    },
    border: {
      default: "",
      none: "border-0",
    },
  },
  compoundVariants: [
    {
      border: "none",
      class: "",
    },
  ],
  defaultVariants: {
    frameShape: "rounded",
    variant: "default",
    size: "default",
    border: "default",
  },
});

const iconV2SizeConfig = {
  tiny: { frameSize: 32, iconSize: 18 },
  default: { frameSize: 48, iconSize: 28 },
  lg: { frameSize: 64, iconSize: 38 },
};

export interface IconV2Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconV2Variants> {
  /** The icon to display (from household items) */
  iconKey?: HouseholdIconKey;
  /** Custom image source (overrides iconKey) */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Icon size ratio relative to frame (0.2 to 1.0) */
  iconRatio?: number;
}

const IconV2 = React.forwardRef<HTMLDivElement, IconV2Props>(
  (
    {
      className,
      frameShape,
      variant,
      size = "default",
      border,
      iconKey,
      src,
      alt = "icon",
      iconRatio,
      ...props
    },
    ref,
  ) => {
    const config = iconV2SizeConfig[size ?? "default"];

    // Calculate icon size based on iconRatio
    // Default ratio: 0.6 for tiny, 0.8 for default/lg
    const defaultRatio = size === "tiny" ? 0.6 : 0.8;
    const finalIconSize = iconRatio
      ? Math.round(config.frameSize * Math.min(Math.max(iconRatio, 0.2), 1))
      : Math.round(config.frameSize * defaultRatio);

    // Resolve image source from iconKey or custom src
    const imageSrc =
      src || (iconKey ? HOUSEHOLD_ICON_IMAGES[iconKey] : undefined);

    return (
      <div className="relative group">
        {/* Floating shadow effect */}
        <div className="absolute inset-0 -z-10 bg-shadow/60 rounded-full blur-xs translate-y-1.5 scale-x-105 origin-bottom group-hover:translate-y-2 group-hover:scale-x-110 group-hover:blur-[6px] group-hover:opacity-80 transition-all duration-200 ease-out" />
        {/* Main Icon Frame */}
        <div
          ref={ref}
          className={cn(
            iconV2Variants({ frameShape, variant, size, border }),
            className,
          )}
          style={{
            width: config.frameSize,
            height: config.frameSize,
          }}
          {...props}
        >
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={alt}
              width={finalIconSize}
              height={finalIconSize}
              className="object-contain"
              unoptimized
            />
          )}
        </div>
      </div>
    );
  },
);

IconV2.displayName = "IconV2";

export { IconV2, iconV2Variants, HOUSEHOLD_ICON_IMAGES };
