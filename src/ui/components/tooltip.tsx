import React from "react";
import { cn } from "@/utils/tailwind";

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode | string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
  arrowClassName?: string;
};

export default function Tooltip({
  children,
  content,
  position = "bottom",
  className,
  contentClassName,
  arrow = true,
  arrowClassName,
}: TooltipProps) {
  const positionClasses: Record<string, string> = {
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowPositions: Record<string, string> = {
    bottom: "top-0 left-1/2 -translate-y-1/2 -translate-x-1/2",
    top: "bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
  };

  const defaultArrowCn =
    "w-3 h-3 rotate-45 bg-black text-white border border-white/20 shadow-sm";

  return (
    <div className={cn("relative inline-block group", className)}>
      {children}
      <div
        className={cn(
          "absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-500",
          positionClasses[position],
          contentClassName
        )}
      >
        <div className="relative inline-block">
          {arrow && (
            <span
              className={cn(
                "absolute block",
                arrowPositions[position],
                defaultArrowCn,
                arrowClassName
              )}
              aria-hidden="true"
            />
          )}
          {typeof content === "string" ? (
            <div className="rounded-md bg-black text-white text-xs px-2 py-1 shadow">
              {content}
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}
