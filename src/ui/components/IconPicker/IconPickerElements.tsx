"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/ui/components/Icon";
import { cn } from "@/utils/tailwind";

const BASE_COLOR = "var(--color-secondary-accent)";
const DECORATIVE_COLOR1 = `color-mix(in oklch, white 20%, ${BASE_COLOR})`;
const DECORATIVE_COLOR2 = `color-mix(in oklch, black 20%, ${BASE_COLOR})`;
const DECORATIVE_COLOR3 = `color-mix(in srgb, black 38%, ${BASE_COLOR})`;

function Sparkle({
  size,
  opacity,
  className,
  style,
}: {
  size: number;
  opacity: number;
  className?: string;
  style?: CSSProperties;
}) {
  const center = size / 2;
  const inner = size * (4 / 9);
  const outer = size;

  return (
    <div
      className={cn("absolute text-highlight animate-pulse", className)}
      style={style}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <path
          d={`M${center} 0L${center + 1} ${inner}L${center} ${outer}L${center - 1} ${inner}L${center} 0Z`}
          fill="currentColor"
          opacity={opacity}
        />
        <path
          d={`M0 ${center}L${inner} ${center + 1}L${outer} ${center}L${inner} ${center - 1}L0 ${center}Z`}
          fill="currentColor"
          opacity={opacity}
        />
      </svg>
    </div>
  );
}

function DecorativeCircle({
  cx,
  cy,
  r,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      className="drop-shadow-sm opacity-80"
    />
  );
}

export function IconPickerDecorations() {
  return (
    <>
      <div
        className="absolute -left-8 -top-8 opacity-80"
        style={{ color: DECORATIVE_COLOR2 }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path
            d="M25 50C25 37 37 25 50 18C43 31 43 44 37 50C43 56 43 69 50 82C37 75 25 63 25 50Z"
            fill="currentColor"
            className="drop-shadow-md"
          />
          <path
            d="M31 44C31 38 38 31 44 27C40 35 40 41 36 44C40 47 40 53 44 60C38 56 31 50 31 44Z"
            className="drop-shadow-sm"
            fill={DECORATIVE_COLOR1}
          />
        </svg>
      </div>

      <div
        className="absolute -bottom-15 -right-8 opacity-60"
        style={{ color: DECORATIVE_COLOR3 }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path
            d="M12 12 Q36 36, 60 36 T108 60"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="drop-shadow-md"
            strokeLinecap="round"
          />
          <DecorativeCircle cx={36} cy={30} r={10} fill={DECORATIVE_COLOR1} />
          <DecorativeCircle cx={84} cy={54} r={12} fill={DECORATIVE_COLOR2} />
          <DecorativeCircle cx={66} cy={38} r={8} fill={DECORATIVE_COLOR1} />
        </svg>
      </div>

      <div
        className="absolute -bottom-6 -left-6 opacity-50"
        style={{ color: DECORATIVE_COLOR1 }}
      >
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <DecorativeCircle cx={30} cy={60} r={15} fill="currentColor" />
          <DecorativeCircle cx={50} cy={70} r={10} fill={DECORATIVE_COLOR2} />
          <DecorativeCircle cx={20} cy={75} r={8} fill={DECORATIVE_COLOR1} />
        </svg>
      </div>

      <Sparkle className="right-16 top-10" size={18} opacity={0.6} />
      <Sparkle
        className="left-12 top-32"
        size={14}
        opacity={0.5}
        style={{ animationDelay: "0.5s" }}
      />
      <Sparkle
        className="bottom-20 right-10"
        size={12}
        opacity={0.4}
        style={{ animationDelay: "1s" }}
      />
    </>
  );
}

export function IconPickerHeaderDivider() {
  return (
    <div className="mt-3 flex justify-center">
      <svg width="200" height="8" viewBox="0 0 200 8" fill="none">
        <path
          d="M2 4 Q50 2, 100 4 T198 4"
          stroke="var(--color-highlight)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export function IconPickerCloseButton({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group absolute -right-4 -top-4 z-10 flex h-12 w-12 items-center justify-center transition-all duration-300 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <Icon
        iconKey="cancel"
        variant="highlight"
        size="medium"
        className="relative z-10 transition-transform duration-300 group-hover:rotate-90"
      />
      <span className="sr-only">Close</span>
    </button>
  );
}
