import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const glassPanelVariants = cva(
  [
    "rounded-xl",
    "bg-linear-to-b from-white/20 via-white/10 to-white/5",
    "backdrop-blur-xl backdrop-saturate-150",
    "border border-white/30",
    "glass-shadow",
  ],
  {
    variants: {
      variant: {
        default: "",
        subtle:
          "bg-linear-to-b from-white/10 via-white/5 to-white/2 border-white/15 opacity-95",
        strong:
          "bg-linear-to-b from-white/40 via-white/25 to-white/15 border-white/40",
      },
      padding: {
        none: "",
        sm: "p-1",
        default: "p-2",
        lg: "p-4",
        xl: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

export { glassPanelVariants };

export interface GlassPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {
  asChild?: boolean;
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant, padding, asChild, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassPanelVariants({ variant, padding }), className)}
        {...props}
      />
    );
  },
);
GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
