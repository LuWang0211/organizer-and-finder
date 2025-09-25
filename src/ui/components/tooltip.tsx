"use client";

import React, { Ref } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { cn } from "@/utils/tailwind";
import { Bubble } from "@/ui/components/bubble";
import { Card } from "@/ui/components/card";
import { HoverCardTriggerProps } from "@radix-ui/react-hover-card";

type PositionOptions = "top" | "bottom" | "left" | "right";
type TooltipVariant = "card" | "bubble";

// Base content container (HoverCard.Content) classes with states and side animations
const CONTENT_CONTAINER_CLASSES =
  "z-50 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[var(--radix-hover-card-content-transform-origin)] group";

const ARROW_CLASSES: Record<TooltipVariant, string> = {
  card: "fill-[hsl(var(--card))] drop-shadow-sm",
  bubble: "fill-[color-mix(in_oklch,hsl(var(--primary-accent)),transparent_65%)] drop-shadow-sm",
};

const CARD_CONTENT_CLASSES = "tooltip-card-content [&_span:has(>_svg.tooltip-card-arrow)]:z-20";

const CardArrowComponent = () => <svg
  className="tooltip-card-arrow translate-y-[-10px] fill-[hsl(var(--card))] transition-transform duration-200 ease-out group-[&:has(.card-content:hover)]:translate-y-[-9px]"
  width="18"
  height="16"
  viewBox="0 0 30 22"
  preserveAspectRatio="none"
  >
  {/* base cover to blend seamlessly */}
  <line x1="0" y1="5" x2="30" y2="5" stroke="hsl(var(--card))" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  {/* filled triangle */}
  <polygon points="0,10 30,10 15,22" />
  {/* slanted borders only */}
  <line x1="0" y1="11" x2="15" y2="22" stroke="hsl(var(--border))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  <line x1="30" y1="11" x2="15" y2="22" stroke="hsl(var(--border))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode | string;
  position?: PositionOptions;
  className?: string; // optional wrapper class for the trigger (kept for backward compatibility)
  contentClassName?: string; // applied to inner content only
  variant?: TooltipVariant;
  openDelay?: number;
  closeDelay?: number;
} & Partial<Omit<React.ComponentProps<typeof HoverCard.Content>, 'content'>>;

const TriggerWrapper = React.forwardRef<HTMLButtonElement, any>((props, forwardedRef) => {
	return <button {...props} ref={forwardedRef} className="w-full" />
});

TriggerWrapper.displayName = 'TriggerWrapper';


export default function Tooltip({
  children,
  content,
  position = "bottom",
  className,
  contentClassName,
  variant = "card",
  align = "center",
  sideOffset = 4,
  alignOffset,
  openDelay = 50,
  closeDelay = 150,
  ...otherHoverCardProps
}: TooltipProps) {
  const computedProps = React.useMemo(() => ({ align, sideOffset, alignOffset }), [align, sideOffset, alignOffset]);

  const renderedContent = React.useMemo(() => {
    if (variant === "bubble") {
      return (
        <Bubble variant="primary" size="default" className={"w-auto"}>
          <div className="text-white text-sm">
            {typeof content === "string" ? <p>{content}</p> : content}
          </div>
        </Bubble>
      );
    }
    // card (default) variant - use default Card styling as container
    return (
      <Card noInnerShadow className={cn("w-auto p-4 peer", contentClassName)}>
        <div className="text-sm">
          {typeof content === "string" ? content : content}
        </div>
      </Card>
    );
  }, [variant, content, contentClassName]);

  const arrowClass = React.useMemo(() => ARROW_CLASSES[variant], [variant]);

  return (
    <HoverCard.Root openDelay={openDelay} closeDelay={closeDelay}>
      <span className={cn("relative inline-block", className)}>
        <HoverCard.Trigger asChild>
          <TriggerWrapper>{children}</TriggerWrapper>
        </HoverCard.Trigger>
      </span>

      <HoverCard.Portal>
        <HoverCard.Content
          side={position}
          align={computedProps.align}
          sideOffset={computedProps.sideOffset}
          alignOffset={computedProps.alignOffset}
          className={cn(CONTENT_CONTAINER_CLASSES, {
            [CARD_CONTENT_CLASSES]: variant === 'card'
          })}
          {...otherHoverCardProps}
        >
          {renderedContent}
          {variant === "card" ? (
              <HoverCard.Arrow asChild>
                <CardArrowComponent />
              </HoverCard.Arrow>
          ) : (
            <HoverCard.Arrow className={arrowClass} width={12} height={6} />
          )}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
