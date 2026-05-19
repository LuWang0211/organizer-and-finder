"use client";

import PhaserGame from "@phaser/Game";
import { useCallback } from "react";
import { useMeasure } from "react-use";
import type { ItemType } from "@/services/itemService";
import { MarqueeTooltipOverlay } from "./components/MarqueeTooltipOverlay";
import { UIScene } from "./scenes/UIScene";

type SearchGameProps = {
  initialItems: ItemType[];
};

export default function SearchGame({ initialItems }: SearchGameProps) {
  const [containerMeasure, { height: containerHeight }] =
    useMeasure<HTMLDivElement>();

  const zoom = containerHeight > 0 ? containerHeight / 768 : 1;

  const onGameCreated = useCallback(
    (game: Phaser.Game) => {
      game.registry.set("initialData", { initialItems });
    },
    [initialItems],
  );

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <div ref={containerMeasure} className="absolute inset-0" />
      <PhaserGame secondScene={UIScene} onGameCreated={onGameCreated} />
      <MarqueeTooltipOverlay zoom={zoom} />
    </div>
  );
}
