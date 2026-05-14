"use client";

import dynamic from "next/dynamic";
import { useMeasure } from "react-use";
import type { ItemType } from "@/services/itemService";
import { MarqueeTooltipOverlay } from "./components/MarqueeTooltipOverlay";

const DynamicGame = dynamic(() => import("@phaser/Game"), {
  ssr: false,
});

type SearchGameProps = {
  initialItems: ItemType[];
};

export default function SearchGame({ initialItems }: SearchGameProps) {
  const [containerMeasure, { height: containerHeight }] =
    useMeasure<HTMLDivElement>();

  const zoom = containerHeight > 0 ? containerHeight / 768 : 1;

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <div ref={containerMeasure} className="absolute inset-0" />
      <DynamicGame initialItems={initialItems} />
      <MarqueeTooltipOverlay zoom={zoom} />
    </div>
  );
}
