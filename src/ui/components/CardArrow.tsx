import * as React from "react";
import { cn } from "@/utils/tailwind";

export interface CardArrowProps
  extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  fillColor?: string;
}

/**
 * A reusable arrow component for card-style tooltips and popovers.
 * Matches the Card component's visual style with rounded borders.
 */
export const CardArrow = React.forwardRef<SVGSVGElement, CardArrowProps>(
  ({ className, fillColor, ...props }, ref) => {
    // biome-ignore-start  lint/correctness/noUnusedVariables: destructured for clarity
    const {
      width,
      height,
      style,
      preserveAspectRatio,
      viewBox,
      ...restSvgProps
    } = props;
    // biome-ignore-end  lint/correctness/noUnusedVariables: destructured for clarity

    return (
      <svg
        ref={ref}
        className={cn(
          "tooltip-card-arrow translate-y-[-10px] transition-transform duration-200 ease-out group-[&:has(.card-content:hover)]:translate-y-[-9px]",
          className,
        )}
        width="18"
        height="16"
        viewBox="0 0 30 22"
        preserveAspectRatio="none"
        style={fillColor ? { fill: fillColor } : {}}
        {...restSvgProps}
      >
        {/* base cover to blend seamlessly */}
        <line
          x1="0"
          y1="5"
          x2="30"
          y2="5"
          stroke={fillColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* filled triangle */}
        <polygon points="0,10 30,10 15,22" />
        {/* slanted borders only */}
        <line
          x1="0"
          y1="11"
          x2="15"
          y2="22"
          stroke="hsl(var(--border))"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="30"
          y1="11"
          x2="15"
          y2="22"
          stroke="hsl(var(--border))"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
);

CardArrow.displayName = "CardArrow";
