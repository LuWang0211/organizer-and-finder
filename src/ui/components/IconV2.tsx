import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { IconImage } from "@/ui/components/IconImage";
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
const iconV2Variants = cva(baseIconStyles, {
  variants: {
    frameShape: {
      rounded: "rounded-[15px]",
      circle: "rounded-full",
    },
    variant: {
      default: ["icon-grad-default"],
      primary: ["icon-grad-primary"],
      secondary: ["icon-grad-secondary"],
      orange: ["icon-grad-orange"],
      blue: ["icon-grad-blue"],
    },
    size: {
      tiny: ["border-2", "icon-shadow-tiny"],
      default: ["border-3", "icon-shadow-default"],
      lg: ["border-4", "icon-shadow-lg"],
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
  tiny: 32,
  default: 48,
  lg: 64,
};

export interface IconV2Props
  extends HTMLAttributes<HTMLDivElement>,
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

const IconV2 = ({
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
}: IconV2Props) => {
  const iconSize = iconV2SizeConfig[size ?? "default"];
  // Default ratio for calculating icon size: 0.6 for tiny, 0.8 for default/lg
  const defaultRatio = size === "tiny" ? 0.6 : 0.8;

  return (
    <div className="relative group">
      {/* Floating shadow effect */}
      <div className="absolute inset-0 -z-10 bg-shadow/60 rounded-full blur-xs translate-y-1.5 scale-x-105 origin-bottom group-hover:translate-y-2 group-hover:scale-x-110 group-hover:blur-[6px] group-hover:opacity-80 transition-all duration-200 ease-out" />
      {/* Main Icon Frame */}
      <div
        className={cn(
          iconV2Variants({ frameShape, variant, size, border }),
          className,
        )}
        style={{
          width: iconSize,
          height: iconSize,
        }}
        {...props}
      >
        <IconImage
          iconSrc={src}
          iconKey={iconKey}
          alt={alt}
          baseSize={iconSize}
          ratio={iconRatio ?? defaultRatio}
        />
      </div>
    </div>
  );
};

IconV2.displayName = "IconV2";

export { IconV2, iconV2Variants, HOUSEHOLD_ICON_IMAGES };
