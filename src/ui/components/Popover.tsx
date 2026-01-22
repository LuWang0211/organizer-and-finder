"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "@/utils/tailwind";
import { Card, type CardProps } from "./Card";
import { CardArrow } from "./CardArrow";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverPortal = PopoverPrimitive.Portal;

const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow> & {
    variant?: CardProps["variant"];
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantColors: Record<NonNullable<CardProps["variant"]>, string> = {
    default: "hsl(var(--card))",
    secondary: "var(--color-cyan-300)",
    primary: "hsl(var(--primary-accent))",
  };

  const fillColor = variantColors[variant!];

  return (
    <PopoverPrimitive.Arrow ref={ref} className={className} {...props} asChild>
      <CardArrow fillColor={fillColor} />
    </PopoverPrimitive.Arrow>
  );
});
PopoverArrow.displayName = "PopoverArrow";

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  variant?: "default" | "secondary" | "primary";
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      variant = "default",
      children,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "group z-50 w-72 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin] [&_span:has(>_svg.tooltip-card-arrow)]:z-[51]",
          className,
        )}
        {...props}
      >
        <Card
          variant={variant}
          noInnerShadow
          className="card-content w-full p-4"
        >
          {children}
        </Card>
        <PopoverArrow variant={variant} />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverPortal, PopoverArrow };
