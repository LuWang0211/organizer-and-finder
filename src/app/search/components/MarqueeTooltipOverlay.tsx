"use client";

import tooltipTop from "@phaser/assets/texture/tooltip-top.png";
import { useEffect, useState } from "react";

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
        className="absolute pointer-events-none flex items-center justify-center bg-no-repeat bg-center bg-[length:100%_100%] text-foreground"
        style={{
          left: `${detail.x * zoom}px`,
          top: `${detail.y * zoom}px`,
          transform: "translate(-50%, calc(-100% - 25px))",
          width: "280px",
          height: "80px",
          backgroundImage: `url(${tooltipTop.src})`,
        }}
      >
        <div className="flex h-full w-full flex-col justify-center px-8 text-left">
          <p className="font-hand text-base font-bold leading-tight text-foreground">
            {detail.label}
          </p>
          <p className="font-hand text-sm leading-tight text-foreground-secondary">
            {locationLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
