import React from "react";
import { cn } from "@/utils/tailwind";

type LoadingCardProps = {
  label?: string;
  className?: string;
};

export default function LoadingCard({ label = "Loading…", className }: LoadingCardProps) {
  return (
    <div className={cn("w-full h-full flex items-center justify-center p-6", className)}>
      <div className="relative group">
        <div className="absolute inset-0 -z-10 bg-shadow/60 rounded-3xl blur-[6px] translate-y-2 scale-x-110 origin-bottom group-hover:translate-y-3 group-hover:scale-x-115 group-hover:blur-[10px] group-hover:opacity-80 transition-all duration-200 ease-out" />
        <div className="rounded-3xl text-text-main overflow-hidden bg-card px-8 py-6 shadow-[0_2px_8px_0_hsl(var(--shadow)/20%)_inset,2px_-2px_8px_0_color-mix(in_oklch,hsl(var(--card)),black_10%)_inset]">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 md:h-8 md:w-8 border-4 border-pink-300 border-t-transparent rounded-full animate-spin" />
            <div className="text-base md:text-lg font-bold">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

