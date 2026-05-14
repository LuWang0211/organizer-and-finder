"use client";

import { Game } from "phaser";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useMeasure } from "react-use";

import { createConfig } from "@phaser/gameConfig";
import type { ItemType } from "@/services/itemService";

interface PhaserGameProps {
  secondSceneOverride?: Phaser.Scene;
  initialItems?: ItemType[];
}

export default function PhaserGame(props: PhaserGameProps) {
  const { secondSceneOverride, initialItems = [] } = props;

  const game = useRef<Game>(undefined);

  const container = useRef<HTMLDivElement>(undefined);

  const initialItemsRef = useRef<ItemType[]>(initialItems);

  const [containerMeasure, { width: containerWidth, height: containerHeight }] =
    useMeasure<HTMLDivElement>();

  // assignRef will transfer the DOM reference to both the container ref and the containerMeasure ref
  const assignRef = useCallback(
    (element: HTMLDivElement) => {
      containerMeasure(element);
      container.current = element;
    },
    [containerMeasure],
  );

  const configWithOverride = useMemo(() => {
    return createConfig(secondSceneOverride);
  }, [secondSceneOverride]);

  const applyInitialItems = useCallback((items: ItemType[]) => {
    if (!game.current || items.length === 0) {
      return;
    }

    const scene = game.current.scene.getScene("UIScene") as
      | (Phaser.Scene & { setMarqueeItems?: (items: ItemType[]) => void })
      | undefined;

    scene?.setMarqueeItems?.(items);
  }, []);

  useEffect(() => {
    initialItemsRef.current = initialItems;
    if (game.current) {
      applyInitialItems(initialItems);
    }
  }, [initialItems, applyInitialItems]);

  useLayoutEffect(() => {
    if (game.current === undefined) {
      game.current = new Game({
        ...configWithOverride,
        parent: container.current,
        input: {
          mouse: {
            target: container.current,
          },
          touch: {
            target: container.current,
          },
        },
      });

      game.current.events.once("ready", () => {
        applyInitialItems(initialItemsRef.current);
      });
    }

    return () => {
      if (game.current) {
        game.current.plugins.removeGlobalPlugin("rexInputTextPlugin");
        game.current.destroy(true);
        game.current = undefined;
      }
    };
  }, [configWithOverride, applyInitialItems]);

  useEffect(() => {
    // Resize the game to fit the container,
    // this might change the intiial aspect ratio
    if (containerWidth > 0 && containerHeight > 0) {
      const containerAspectRatio = containerWidth / containerHeight;
      const fitWidth = 768 * containerAspectRatio;

      game.current?.scale.resize(fitWidth, 768);
      game.current?.scale.setZoom(containerHeight / 768);
    }
  }, [containerWidth, containerHeight]);

  return (
    <div ref={assignRef} className="w-full h-full relative overflow-x-hidden" />
  );
}
