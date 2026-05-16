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

interface PhaserGameProps {
  secondSceneOverride?: Phaser.Scene;
  onGameReady?: (game: Game) => void;
}

export default function PhaserGame(props: PhaserGameProps) {
  const { secondSceneOverride, onGameReady } = props;

  const game = useRef<Game>(undefined);

  const container = useRef<HTMLDivElement>(undefined);

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

  const onGameReadyRef = useRef(onGameReady);
  useEffect(() => {
    onGameReadyRef.current = onGameReady;
  }, [onGameReady]);

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
        onGameReadyRef.current?.(game.current!);
      });
    }

    return () => {
      if (game.current) {
        game.current.plugins.removeGlobalPlugin("rexInputTextPlugin");
        game.current.destroy(true);
        game.current = undefined;
      }
    };
  }, [configWithOverride]);

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
