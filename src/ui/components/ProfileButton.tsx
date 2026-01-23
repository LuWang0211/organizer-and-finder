"use client";

import { cn } from "@/utils/tailwind";

interface ProfileButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ProfileButton({ isOpen, onToggle }: ProfileButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn("relative group", "transition-all duration-300 ease-out")}
      aria-label="Open profile"
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-xl opacity-60 transition-all duration-300",
          "bg-cyan-400",
          isOpen
            ? "scale-150 opacity-40"
            : "group-hover:scale-110 group-hover:opacity-80",
        )}
      />
      {/* Profile Icon Button */}
      <div
        className={cn(
          "relative rounded-full border-4 border-border",
          "bg-gradient-to-bl from-cyan-200 via-cyan-300 to-cyan-400",
          "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_rgba(8,145,178,0.3)_inset]",
          "hover:scale-105 active:scale-100",
          "transition-all duration-200 ease-out",
          "w-16 h-16 flex items-center justify-center",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={28}
          height={28}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-cyan-700"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </button>
  );
}
