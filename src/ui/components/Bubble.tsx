import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const bubbleVariants = cva(
  [
    "relative rounded-3xl overflow-hidden transition-all duration-300",
    "hover:scale-[1.02]",
    "backdrop-blur-xs z-10",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/10 border border-white/10",
          "shadow-[0_20px_30px_rgba(0,0,0,0.2),inset_0px_10px_30px_5px_rgba(255,255,255,0.3)]",
          "hover:shadow-[0_25px_35px_rgba(0,0,0,0.25),inset_0px_12px_35px_8px_rgba(255,255,255,0.4)]",
        ],
        primary: [
          "bg-[color-mix(in_oklch,hsl(var(--primary-accent)),transparent_65%)] border-[color-mix(in_oklch,hsl(var(--primary-accent)),transparent_30%)]",
          "shadow-[0_20px_30px_rgba(0,0,0,0.2),inset_0px_10px_30px_5px_rgba(255,255,255,0.3)]",
          "hover:shadow-[0_25px_35px_rgba(0,0,0,0.25),inset_0px_12px_35px_8px_rgba(255,255,255,0.4)]",
        ],
        secondary: [
          "bg-cyan-400/10 border border-cyan-300/15",
          "shadow-[0_20px_30px_rgba(0,0,0,0.2),inset_0px_10px_30px_5px_rgba(255,255,255,0.3)]",
          "hover:shadow-[0_25px_35px_rgba(0,0,0,0.25),inset_0px_12px_35px_8px_rgba(255,255,255,0.4)]",
        ],
      },
      size: {
        sm: "min-h-[80px] p-4",
        default: "min-h-[120px] p-5",
        lg: "min-h-[160px] p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    // Size-based scaling for reflections
    const getReflectionScale = () => {
      switch (size) {
        case "sm":
          return { highlight: 0.6, dot: 0.7, bottom: 0.5 };
        case "lg":
          return { highlight: 1.2, dot: 1.2, bottom: 1.5 };
        default:
          return { highlight: 1, dot: 1, bottom: 1 };
      }
    };

    const scale = getReflectionScale();

    return (
      <div className="relative group">
        {/* Grounded shadow directly under bubble (tighter area) */}
        <div className="absolute z-[1] left-1/2 bottom-3 h-4 w-[70%] -translate-x-1/2 rounded-full bg-shadow/60 blur-md opacity-80 transition-all duration-300 ease-out group-hover:bottom-2 group-hover:blur-lg group-hover:opacity-90" />

        {/* Main bubble container */}
        <div
          ref={ref}
          className={cn(bubbleVariants({ variant, size }), className)}
          {...props}
        >
          {/* Primary shine effect - radial gradient */}
          <div
            className="absolute inset-1 rounded-[1.25rem] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 70%)",
              boxShadow: "inset 0 20px 30px rgba(255, 255, 255, 0.4)",
            }}
          />

          {/* Secondary highlight - top left reflection (proportional) */}
          <div
            className="absolute pointer-events-none rounded-full opacity-60"
            style={{
              top: `${1 * scale.highlight}rem`,
              left: `${1 * scale.highlight}rem`,
              width: `${3 * scale.highlight}rem`,
              height: `${5 * scale.highlight}rem`,
              background:
                "linear-gradient(-135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
              transform: "rotate(-25deg) skewX(-10deg)",
              filter: "blur(2px)",
            }}
          />

          {/* Small highlight dot (proportional) */}
          <div
            className="absolute bg-white/80 rounded-full pointer-events-none"
            style={{
              top: `${1.5 * scale.dot}rem`,
              left: `${1.5 * scale.dot}rem`,
              width: `${0.75 * scale.dot}rem`,
              height: `${0.75 * scale.dot}rem`,
              filter: "blur(0.5px)",
            }}
          />

          {/* Bottom subtle reflection (proportional and more subtle) */}
          <div
            className="absolute pointer-events-none rounded-full opacity-15"
            style={{
              bottom: `${1 * scale.bottom}rem`,
              right: `${0.5 * scale.bottom}rem`,
              width: `${2 * scale.bottom}rem`,
              height: `${1 * scale.bottom}rem`,
              background:
                "linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 100%)",
              transform: "rotate(45deg)",
              filter: "blur(2px)",
            }}
          />

          {/* Content with proper text styling for glass effect */}
          <div className="relative z-[11] text-shadow">{children}</div>
        </div>
      </div>
    );
  },
);

Bubble.displayName = "Bubble";

export { Bubble, bubbleVariants };
