"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const searchBarVariants = cva(
  "flex items-center h-14 rounded-[28px] box-border overflow-hidden relative",
  {
    variants: {
      variant: {
        default: "w-[650px] max-w-full",
        compact: "w-[320px] max-w-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface SearchBarProps
  extends React.ComponentPropsWithRef<"div">,
    VariantProps<typeof searchBarVariants> {
  inputId?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export function SearchBar({
  className,
  variant,
  inputId,
  placeholder = "Search...",
  onSearch,
  ref,
  ...props
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");

  const handleSearch = () => {
    onSearch?.(query);
  };

  return (
    <div
      ref={ref}
      className={cn(
        searchBarVariants({ variant }),
        "bg-linear-to-b from-card-default to-mute",
        "shadow-[0_12px_24px_color-mix(in_oklch,var(--color-shadow)_35%,transparent)]",
        "pl-4",
        className,
      )}
      {...props}
    >
      {/* Left Search Icon */}
      <div className="flex items-center justify-center opacity-80 shrink-0">
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-foreground-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Text Input */}
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.defaultPrevented ||
            e.key !== "Enter" ||
            e.nativeEvent.isComposing
          ) {
            return;
          }

          e.preventDefault();
          handleSearch();
        }}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent outline-none text-lg px-4 min-w-0 placeholder:text-foreground/40"
      />

      {/* Right Gold Button */}
      <button
        type="button"
        aria-label="Submit search"
        onClick={handleSearch}
        className={cn(
          "h-full w-14 border-none cursor-pointer shrink-0",
          "bg-linear-to-br from-[color-mix(in_oklch,var(--color-highlight)_90%,white)] to-icon-primary",
          // "bg-linear-to-b from-[#FBD556] to-[#D89C19]",
          "shadow-[inset_1px_1px_1px_color-mix(in_oklch,white_50%,transparent),inset_-1px_-1px_1px_color-mix(in_oklch,var(--color-shadow)_20%,transparent)]",
          "flex items-center justify-center",
          "rounded-tr-[28px] rounded-br-[28px]",
          "transition-all duration-150",
          "hover:brightness-105 active:brightness-95",
        )}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-foreground-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
}
