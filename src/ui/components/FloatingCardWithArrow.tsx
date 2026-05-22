import type * as React from "react";
import { Card, type CardProps } from "@/ui/components/Card";
import { CardArrow } from "@/ui/components/CardArrow";
import { cn } from "@/utils/tailwind";

const cardVariantFillColors: Record<
  NonNullable<CardProps["variant"]>,
  string
> = {
  default: "var(--color-card-default)",
  secondary: "var(--color-card-secondary)",
  primary: "var(--color-primary-accent)",
};

export interface FloatingCardWithArrowProps {
  children: React.ReactNode;
  variant?: NonNullable<CardProps["variant"]>;
  noInnerShadow?: CardProps["noInnerShadow"];
  shadowIntensity?: CardProps["shadowIntensity"];
  className?: string;
  cardClassName?: string;
  arrowClassName?: string;
  arrowFillColor?: string;
}

export function FloatingCardWithArrow({
  children,
  className,
  cardClassName,
  arrowClassName,
  arrowFillColor,
  variant = "default",
  noInnerShadow = true,
  shadowIntensity = "weakened",
}: FloatingCardWithArrowProps) {
  return (
    <div className={cn("relative group tooltip-card-content", className)}>
      <Card
        variant={variant}
        noInnerShadow={noInnerShadow}
        shadowIntensity={shadowIntensity}
        className={cn("p-4 peer border-3 card-content", cardClassName)}
      >
        {children}
      </Card>
      <CardArrow
        className={cn(
          "absolute left-1/2 top-full z-20 -translate-x-1/2 -translate-y-[10px]",
          arrowClassName,
        )}
        fillColor={arrowFillColor ?? cardVariantFillColors[variant]}
      />
    </div>
  );
}
