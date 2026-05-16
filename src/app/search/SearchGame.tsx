"use client";

import dynamic from "next/dynamic";
import type { Game, Scene } from "phaser";
import { useCallback } from "react";

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

  const handleGameReady = useCallback(
    (game: Game) => {
      if (initialItems.length === 0) return;

      const scene = game.scene.getScene("UIScene") as
        | (Scene & { setMarqueeItems?: (items: ItemType[]) => void })
        | undefined;

      scene?.setMarqueeItems?.(initialItems);
    },
    [initialItems],
  );

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <div ref={containerMeasure} className="absolute inset-0" />
      <DynamicGame onGameReady={handleGameReady} />
      <MarqueeTooltipOverlay zoom={zoom} />
    </div>
  );
}
