"use client";

import { Game } from "phaser";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMeasure } from "react-use";
import { MarqueeTooltipOverlay } from "@/app/search/components/MarqueeTooltipOverlay";
import { config } from "@/app/search/gameConfig";

interface PhaserGameProps {
  secondSceneOverride?: Phaser.Scene;
}

export default function PhaserGame(props: PhaserGameProps) {
  const { secondSceneOverride } = props;

  const game = useRef<Game | null>(null);

  const container = useRef<HTMLDivElement | null>(null);

  // useMeasure is a 3rd party hook that measures the size of a DOM element
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
    if (!secondSceneOverride) {
      return config;
    }

    return {
      ...config,
      scene: [config.scene[0], secondSceneOverride] as any,
    };
  }, [secondSceneOverride]);

  useEffect(() => {
    if (!container.current || game.current) {
      return;
    }

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

    return () => {
      if (game.current) {
        game.current.plugins?.removeGlobalPlugin("rexInputTextPlugin");
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, [configWithOverride]);

  useEffect(() => {
    // Resize the game to fit the container,
    // this might change the intial aspect ratio
    if (containerWidth > 0 && containerHeight > 0) {
      const containerAspectRatio = containerWidth / containerHeight;
      const fitWidth = 768 * containerAspectRatio;

      game.current?.scale.resize(fitWidth, 768);
      game.current?.scale.setZoom(containerHeight / 768);
    }
  }, [containerWidth, containerHeight]);

  const zoom = containerHeight > 0 ? containerHeight / 768 : 1;

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <div ref={assignRef} className="absolute inset-0" />
      <MarqueeTooltipOverlay zoom={zoom} />
    </div>
  );
}
