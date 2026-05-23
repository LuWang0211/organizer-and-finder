"use client";

import { useEffect, useState } from "react";
import { FloatingCardWithArrow } from "@/ui/components/FloatingCardWithArrow";

type MarqueeTooltipDetail = {
  label: string;
  locationName: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
};

const MARQUEE_TOOLTIP_EVENT = "search-marquee-tooltip";
const MARQUEE_TOOLTIP_CLEAR_EVENT = "search-marquee-tooltip-clear";

type MarqueeTooltipOverlayProps = {
  zoom: number;
};

export function MarqueeTooltipOverlay({ zoom }: MarqueeTooltipOverlayProps) {
  const [detail, setDetail] = useState<MarqueeTooltipDetail | null>(null);

  useEffect(() => {
    const handleTooltipShow = (event: Event) => {
      const customEvent = event as CustomEvent<MarqueeTooltipDetail>;
      setDetail(customEvent.detail);
    };

    const handleTooltipClear = () => {
      setDetail(null);
    };

    window.addEventListener(MARQUEE_TOOLTIP_EVENT, handleTooltipShow);
    window.addEventListener(MARQUEE_TOOLTIP_CLEAR_EVENT, handleTooltipClear);

    return () => {
      window.removeEventListener(MARQUEE_TOOLTIP_EVENT, handleTooltipShow);
      window.removeEventListener(
        MARQUEE_TOOLTIP_CLEAR_EVENT,
        handleTooltipClear,
      );
    };
  }, []);

  if (!detail) {
    return null;
  }

  const locationLabel = detail.locationName
    ? `Location: ${detail.locationName}`
    : "Location: Unknown";

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ overflow: "visible" }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${detail.x * zoom}px`,
          top: `${detail.y * zoom}px`,
          transform: "translate(-50%, calc(-100% - 25px))",
        }}
      >
        <FloatingCardWithArrow>
          <div className="flex flex-col gap-1">
            <p className="font-hand text-base font-bold leading-tight text-foreground">
              {detail.label}
            </p>
            <p className="font-hand text-sm leading-tight text-foreground-secondary">
              {locationLabel}
            </p>
          </div>
        </FloatingCardWithArrow>
      </div>
    </div>
  );
}
