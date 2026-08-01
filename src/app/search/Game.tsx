"use client";

import PhaserGame from "@phaser/Game";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMeasure } from "react-use";
import type { ItemType } from "@/services/itemService";
import { createItemSearcher } from "@/services/searchService";
import FeedbackOverlay, {
  type FeedbackOverlayRef,
} from "@/ui/components/FeedbackOverlay/FeedbackOverlay";
import { SearchBar } from "@/ui/components/SearchBar";
import { MarqueeTooltipOverlay } from "./components/MarqueeTooltipOverlay";
import { UIScene } from "./scenes/UIScene";

type SearchGameProps = {
  initialItems: ItemType[];
};

export default function SearchGame({ initialItems }: SearchGameProps) {
  const [containerMeasure, { height: containerHeight }] =
    useMeasure<HTMLDivElement>();
  const [isLoading, setIsLoading] = useState(true);
  const uiSceneRef = useRef<UIScene | null>(null);
  const feedbackOverlayRef = useRef<FeedbackOverlayRef | null>(null);
  const feedbackCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const zoom = containerHeight > 0 ? containerHeight / 768 : 1;
  const searchItems = useMemo(
    () => createItemSearcher(initialItems),
    [initialItems],
  );

  const onGameCreated = useCallback(
    (game: Phaser.Game) => {
      game.registry.set("initialData", { initialItems });

      const getUIScene = () => {
        const uiScene = game.scene.getScene("UIScene") as UIScene | undefined;
        if (uiScene) {
          uiSceneRef.current = uiScene;
          uiScene.events.once("scene-awake", () => {
            setIsLoading(false);
          });
        } else {
          game.events.once("ready", getUIScene);
        }
      };

      getUIScene();
    },
    [initialItems],
  );

  const showFeedback = useCallback(
    async (message: string, durationMs: number) => {
      if (!feedbackOverlayRef.current) {
        return;
      }

      if (feedbackCloseTimeoutRef.current) {
        clearTimeout(feedbackCloseTimeoutRef.current);
      }

      await feedbackOverlayRef.current.open({ message });
      void feedbackOverlayRef.current.playAnimation("error", { durationMs });
      feedbackCloseTimeoutRef.current = setTimeout(() => {
        feedbackOverlayRef.current?.close();
        feedbackCloseTimeoutRef.current = null;
      }, durationMs + 100);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (feedbackCloseTimeoutRef.current) {
        clearTimeout(feedbackCloseTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!uiSceneRef.current) return;
      if (!query.trim()) {
        await showFeedback("Type something to search", 1200);
        return;
      }

      const { results, found } = searchItems(query);
      if (!found) {
        uiSceneRef.current.clearMarqueeSearchResult();
        await showFeedback("No such result", 1500);
        return;
      }

      uiSceneRef.current.updateMarqueeItems(results);
    },
    [searchItems, showFeedback],
  );

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <div ref={containerMeasure} className="absolute inset-0" />
      <PhaserGame secondScene={UIScene} onGameCreated={onGameCreated} />
      <MarqueeTooltipOverlay zoom={zoom} />
      {!isLoading && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
          <SearchBar
            onSearch={handleSearch}
            onInputChange={(query) => {
              if (uiSceneRef.current) {
                uiSceneRef.current.triggerLetterFall(query);
                if (!query.trim()) {
                  uiSceneRef.current.clearMarqueeSearchResult();
                }
              }
            }}
          />
        </div>
      )}
      <FeedbackOverlay ref={feedbackOverlayRef} />
    </div>
  );
}
