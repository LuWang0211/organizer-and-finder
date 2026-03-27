"use client";

import type { Game } from "phaser";
import * as Phaser from "phaser";
import { useCallback, useLayoutEffect, useRef } from "react";
import {
  ColorMapFramePhaserScene,
  type ColorMapFramePhaserSceneConfig,
} from "./ColorMapFramePhaserScene";

type ColorMapFramePhaserGameProps = ColorMapFramePhaserSceneConfig;

export function ColorMapFramePhaserGame(props: ColorMapFramePhaserGameProps) {
  const gameRef = useRef<Game | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | undefined>(undefined);

  const assignRef = useCallback((element: HTMLDivElement | null) => {
    containerRef.current = element ?? undefined;
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    gameRef.current?.destroy(true);
    gameRef.current = undefined;
    containerRef.current.replaceChildren();

    const game = new Phaser.Game({
      type: Phaser.WEBGL,
      width: props.previewWidth,
      height: props.previewHeight,
      transparent: true,
      parent: containerRef.current,
      scene: [
        new ColorMapFramePhaserScene({
          frameColorHex: props.frameColorHex,
          panelTintHex: props.panelTintHex,
          previewWidth: props.previewWidth,
          previewHeight: props.previewHeight,
        }),
      ],
      antialias: true,
      antialiasGL: true,
      scale: {
        mode: Phaser.Scale.NONE,
      },
      input: {
        mouse: {
          target: containerRef.current,
        },
        touch: {
          target: containerRef.current,
        },
      },
    });

    game.canvas.style.imageRendering = "auto";
    gameRef.current = game;

    return () => {
      game.destroy(true);
      if (gameRef.current === game) {
        gameRef.current = undefined;
      }
    };
  }, [
    props.frameColorHex,
    props.panelTintHex,
    props.previewHeight,
    props.previewWidth,
  ]);

  return (
    <div
      ref={assignRef}
      className="overflow-hidden"
      style={{
        width: `${props.previewWidth}px`,
        height: `${props.previewHeight}px`,
        imageRendering: "auto",
      }}
    />
  );
}
