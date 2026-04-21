import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const cardVariants = cva(
  [
    "rounded-3xl border-4 border-border text-foreground overflow-hidden transition-all duration-200 relative z-10",
    "hover:scale-[1.02] card-content",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-card-default",
          "shadow-[0_2px_8px_0_color-mix(in_oklch,var(--color-shadow)_20%,transparent)_inset,2px_-2px_8px_0_color-mix(in_oklch,var(--color-card-default),black_10%)_inset]",
          "hover:shadow-[0_4px_12px_0_color-mix(in_oklch,var(--color-shadow)_30%,transparent)_inset,3px_-3px_12px_0_color-mix(in_oklch,var(--color-card-default),black_15%)_inset]",
        ],
        secondary: [
          "bg-card-secondary",
          "shadow-[0_2px_8px_0_rgba(0,0,0,0.15)_inset,2px_-2px_8px_0_color-mix(in_oklch,var(--color-card-secondary),black_15%)_inset]",
          "hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.25)_inset,3px_-3px_12px_0_color-mix(in_oklch,var(--color-card-secondary),black_20%)_inset]",
        ],
        primary: [
          "bg-primary-accent text-white",
          "shadow-[-3px_3px_2px_1px_color-mix(in_oklch,var(--color-highlight)_70%,transparent)_inset,3px_-3px_2px_1px_color-mix(in_oklch,var(--color-primary-accent),black_30%)_inset]",
          "hover:shadow-[-3px_3px_2px_1px_color-mix(in_oklch,var(--color-highlight)_70%,transparent)_inset,3px_-3px_2px_1px_color-mix(in_oklch,var(--color-primary-accent),black_30%)_inset]",
        ],
      },

      innerShadow: {
        none: "shadow-none hover:shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const floatingShadowVariants = cva(
  "absolute inset-y-0 -inset-x-2 z-[1] rounded-3xl origin-bottom transition-all duration-200 ease-out pointer-events-none",
  {
    variants: {
      intensity: {
        default:
          "bg-shadow/60 blur-[6px] translate-y-2 group-hover:translate-y-3 group-hover:-inset-x-4 group-hover:blur-[10px] group-hover:opacity-80",
        weakened:
          "bg-shadow/30 blur-[4px] translate-y-1 group-hover:translate-y-1.5 group-hover:-inset-x-3 group-hover:blur-[5px] group-hover:opacity-65",
      },
    },
    defaultVariants: {
      intensity: "default",
    },
  },
);

export { cardVariants, floatingShadowVariants };

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  noInnerShadow?: boolean;
  shadowIntensity?: VariantProps<typeof floatingShadowVariants>["intensity"];
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      noInnerShadow,
      shadowIntensity = "default",
      ...props
    },
    ref,
  ) => (
    <div className={"relative group"}>
      {/* Main Card */}
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            innerShadow: noInnerShadow ? "none" : undefined,
          }),
          className,
        )}
        {...props}
      />
      {/* Floating shadow */}
      <div className={floatingShadowVariants({ intensity: shadowIntensity })} />
    </div>
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-extrabold leading-none tracking-tight",
      "[text-shadow:0.5px_0.5px_0_rgba(0,0,0,0.3),-0.5px_0.5px_0_rgba(0,0,0,0.3),0.5px_-0.5px_0_rgba(0,0,0,0.2),-0.5px_-0.5px_0_rgba(0,0,0,0.2)]",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-medium", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
