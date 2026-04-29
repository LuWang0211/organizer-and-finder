"use client";

import { motion } from "motion/react";
import type * as React from "react";

import { cn } from "@/utils/tailwind";

export interface SlidingPillIndicatorStyle {
  left: number;
  width: number;
}

export interface SlidingPillShellProps {
  children: React.ReactNode;
  className?: string;
  indicatorStyle: SlidingPillIndicatorStyle;
  indicatorClassName?: string;
  indicatorStyleOverrides?: React.CSSProperties;
}

const defaultIndicatorStyle: React.CSSProperties = {
  background: "var(--color-primary-accent)",
  outline: "3px solid var(--color-border)",
  left: 0,
  width: 0,
  top: "4px",
  height: "calc(100% - 8px)",
};

export function SlidingPillShell({
  children,
  className,
  indicatorStyle,
  indicatorClassName,
  indicatorStyleOverrides,
}: SlidingPillShellProps) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        aria-hidden="true"
        className={cn(
          "absolute rounded-full pointer-events-none z-20",
          indicatorClassName,
        )}
        style={{
          ...defaultIndicatorStyle,
          ...indicatorStyleOverrides,
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
      {children}
    </div>
  );
}
