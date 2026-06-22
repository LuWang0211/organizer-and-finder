"use client";

import PhaserGame, { type PhaserGameRef } from "@phaser/Game";
import { type FormEvent, useCallback, useId, useRef } from "react";
import { useMeasure } from "react-use";
import type { ItemType } from "@/services/itemService";
import { SearchBar } from "@/ui/components/SearchBar";
import { MarqueeTooltipOverlay } from "./components/MarqueeTooltipOverlay";
import { EVENT_LETTER_FALL, UIScene } from "./scenes/UIScene";

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

  const gameRef = useRef<PhaserGameRef>(null);
  const searchId = useId();

  const onSearchTextChange = (event: FormEvent<HTMLInputElement>) => {
    const text = (event.target as HTMLInputElement).value;
    gameRef.current?.emit(EVENT_LETTER_FALL, text);
  };

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <div ref={containerMeasure} className="absolute inset-0" />
      <SearchBar
        inputId={searchId}
        placeholder="hello wawa"
        onSearch={(value) => console.log("Search query:", value)}
        onChange={onSearchTextChange}
        className="absolute top-14 left-1/2 -translate-x-1/2 z-10"
      />
      <PhaserGame
        secondScene={UIScene}
        onGameCreated={onGameCreated}
        ref={gameRef}
      />
      <MarqueeTooltipOverlay zoom={zoom} />
    </div>
  );
}
