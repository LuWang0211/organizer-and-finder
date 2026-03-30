"use client";

import dynamic from "next/dynamic";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { GlassPanel } from "@/ui/components/GlassPanel";

const ColorMapFramePhaserGame = dynamic(
  () =>
    import("@/ui/components/ColorMapFrame/ColorMapFramePhaserGame").then(
      (module) => module.ColorMapFramePhaserGame,
    ),
  {
    ssr: false,
  },
);

const FRAME_SRC = "/textures/advanced_frame.png";
const MASK_SRC = "/textures/advanced_frame_mask.png";
const PANEL_SRC = "/textures/panel_texture.png";
const TILE_SRC = "/textures/tile.png";
const FRAME_WIDTH = 253;
const FRAME_HEIGHT = 352;

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, value]);

  return debouncedValue;
}

export default function ColorMapImage() {
  const [frameColor, setFrameColor] = useState("#1fa5ff");
  const [panelTint, setPanelTint] = useState("#ef4444");
  const [previewWidth, setPreviewWidth] = useState(FRAME_WIDTH);
  const [previewHeight, setPreviewHeight] = useState(FRAME_HEIGHT);
  const debouncedFrameColor = useDebouncedValue(frameColor, 120);
  const debouncedPanelTint = useDebouncedValue(panelTint, 120);
  const debouncedPreviewWidth = useDebouncedValue(previewWidth, 120);
  const debouncedPreviewHeight = useDebouncedValue(previewHeight, 120);

  return (
    <div className="min-h-full px-6 py-10 text-neutral-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-center">
            Color Map Frame Showcase
          </h1>
          <p className="max-w-4xl text-sm leading-6 text-neutral-300">
            这个版本在 Phaser Shader 中完成完整的 9-slice UV 重映射，然后将蓝色
            mask 区域映射为可重复、可着色的屏幕空间贴图，并将红色 mask
            区域映射为 在 9-slice 拉伸后屏幕空间中采样的面板纹理子区域。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <GlassPanel padding="xl" variant="subtle" className="rounded-3xl">
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-neutral-200">
                  外框颜色
                </span>
                <input
                  type="color"
                  value={frameColor}
                  onChange={(event) => setFrameColor(event.target.value)}
                  className="h-12 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                />
                <span className="text-xs text-neutral-400">{frameColor}</span>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-neutral-200">
                  面板着色
                </span>
                <input
                  type="color"
                  value={panelTint}
                  onChange={(event) => setPanelTint(event.target.value)}
                  className="h-12 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                />
                <span className="text-xs text-neutral-400">{panelTint}</span>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-neutral-200">
                  预览宽度
                </span>
                <input
                  type="range"
                  min="120"
                  max="600"
                  value={previewWidth}
                  onChange={(event) =>
                    setPreviewWidth(Number.parseInt(event.target.value, 10))
                  }
                  className="w-full"
                />
                <span className="text-xs text-neutral-400">
                  {previewWidth}px
                </span>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-neutral-200">
                  预览高度
                </span>
                <input
                  type="range"
                  min="160"
                  max="700"
                  value={previewHeight}
                  onChange={(event) =>
                    setPreviewHeight(Number.parseInt(event.target.value, 10))
                  }
                  className="w-full"
                />
                <span className="text-xs text-neutral-400">
                  {previewHeight}px
                </span>
              </label>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50">
                <p className="font-medium">实现说明</p>
                <p>
                  预览使用基于 Shader 的 9-slice 实现。Shader
                  会为每个输出像素计算切片后的 源 UV，并在切片之后再应用 mask
                  逻辑，这样面板纹理的映射就能与拉伸后的
                  红色区域保持对齐。蓝色区域使用屏幕空间内重复的灰度贴图，并由外框颜色进行着色；
                  红色区域则将灰度面板纹理的一个子矩形映射到拉伸后的红色区域中。
                </p>
              </div>
            </div>
          </GlassPanel>

          <section className="grid gap-6 xl:grid-cols-2">
            <GlassPanel
              padding="lg"
              variant="subtle"
              className="rounded-3xl xl:col-span-2"
            >
              <figcaption className="mb-3 text-sm text-neutral-300">
                Phaser 输出（Shader 侧 9-slice）
              </figcaption>
              <ColorMapFramePhaserGame
                frameColorHex={debouncedFrameColor}
                panelTintHex={debouncedPanelTint}
                previewWidth={debouncedPreviewWidth}
                previewHeight={debouncedPreviewHeight}
              />
            </GlassPanel>

            <GlassPanel padding="lg" variant="subtle" className="rounded-3xl">
              <figcaption className="mb-3 text-sm text-neutral-300">
                原始边框
              </figcaption>
              <NextImage
                src={FRAME_SRC}
                alt="原始高级边框纹理"
                width={FRAME_WIDTH}
                height={FRAME_HEIGHT}
                sizes="(max-width: 1279px) 100vw, 33vw"
                className="w-full rounded-2xl bg-black object-contain"
              />
            </GlassPanel>

            <GlassPanel padding="lg" variant="subtle" className="rounded-3xl">
              <figcaption className="mb-3 text-sm text-neutral-300">
                通道遮罩
              </figcaption>
              <NextImage
                src={MASK_SRC}
                alt="显示蓝色外框和红色内面板的遮罩图"
                width={FRAME_WIDTH}
                height={FRAME_HEIGHT}
                sizes="(max-width: 1279px) 100vw, 33vw"
                className="w-full rounded-2xl bg-black object-contain"
              />
            </GlassPanel>

            <GlassPanel padding="lg" variant="subtle" className="rounded-3xl">
              <figcaption className="mb-3 text-sm text-neutral-300">
                面板纹理
              </figcaption>
              <NextImage
                src={PANEL_SRC}
                alt="映射到红色遮罩区域的面板纹理"
                width={FRAME_WIDTH}
                height={FRAME_HEIGHT}
                sizes="(max-width: 1279px) 100vw, 33vw"
                className="w-full rounded-2xl bg-black object-contain"
              />
            </GlassPanel>

            <GlassPanel padding="lg" variant="subtle" className="rounded-3xl">
              <figcaption className="mb-3 text-sm text-neutral-300">
                平铺纹理
              </figcaption>
              <NextImage
                src={TILE_SRC}
                alt="映射到蓝色遮罩区域的可重复平铺纹理"
                width={FRAME_WIDTH}
                height={FRAME_HEIGHT}
                sizes="(max-width: 1279px) 100vw, 33vw"
                className="w-full rounded-2xl bg-black object-contain"
              />
            </GlassPanel>
          </section>
        </div>
      </div>
    </div>
  );
}
