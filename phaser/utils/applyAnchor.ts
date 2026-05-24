import type * as Phaser from "phaser";

export interface DimensionValue {
  value: number;
  type: "percent" | "pixel";
}

export function setGameObjectPosition(
  obj: Phaser.GameObjects.GameObject,
  x: number,
  y: number,
): void {
  if (obj.parentContainer) {
    (obj as any).x = x;
    (obj as any).y = y;
  } else {
    (obj as any).x = x + obj.scene.scale.width / 2;
    (obj as any).y = y + obj.scene.scale.height / 2;
  }
}

export interface AnchorConfig {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  centerX?: boolean;
  centerY?: boolean;
  width?: DimensionValue | number;
  height?: DimensionValue | number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Apply anchor-based positioning to a game object.
 * Compatible with Phaser 3 and 4.
 *
 * @example
 * // Center horizontally and vertically
 * applyAnchor(obj, scene, { centerX: true, centerY: true });
 *
 * // Offset from top by 20px, centered horizontally, 90% width
 * applyAnchor(obj, scene, {
 *   top: 20,
 *   centerX: true,
 *   width: { value: 90, type: "percent" }
 * });
 *
 * // 100px from right edge, 50px from bottom
 * applyAnchor(obj, scene, { right: 100, bottom: 50 });
 */
export function applyAnchor(
  obj: Phaser.GameObjects.GameObject,
  scene: Phaser.Scene,
  config: AnchorConfig,
): void {
  const parent = (obj as any).parentContainer;
  const parentBounds = parent?.getBounds?.();
  const parentWidth =
    parent?.width || parent?.displayWidth || parentBounds?.width;
  const parentHeight =
    parent?.height || parent?.displayHeight || parentBounds?.height;
  const refWidth = parentWidth || scene.scale.width;
  const refHeight = parentHeight || scene.scale.height;

  let xPos: number | undefined;
  let yPos: number | undefined;

  const targetW =
    config.width !== undefined
      ? typeof config.width === "number"
        ? config.width
        : config.width.type === "percent"
          ? refWidth * (config.width.value / 100)
          : config.width.value
      : undefined;

  const targetH =
    config.height !== undefined
      ? typeof config.height === "number"
        ? config.height
        : config.height.type === "percent"
          ? refHeight * (config.height.value / 100)
          : config.height.value
      : undefined;

  if (targetW !== undefined || targetH !== undefined) {
    const finalW = targetW ?? (obj as any).displayWidth ?? 0;
    const finalH = targetH ?? (obj as any).displayHeight ?? 0;
    if ("setSize" in obj) {
      (obj as any).setSize(finalW, finalH);
    }
    if ("setDisplaySize" in obj) {
      (obj as any).setDisplaySize(finalW, finalH);
    }
  }

  if (config.centerX) {
    xPos = 0;
  } else if (config.left !== undefined) {
    const w = targetW ?? (obj as any).width ?? (obj as any).displayWidth ?? 0;
    xPos = -refWidth / 2 + config.left + w / 2;
  } else if (config.right !== undefined) {
    const w = targetW ?? (obj as any).width ?? (obj as any).displayWidth ?? 0;
    xPos = refWidth / 2 - config.right - w / 2;
  }

  if (config.centerY) {
    yPos = 0;
  } else if (config.top !== undefined) {
    const h = targetH ?? (obj as any).height ?? (obj as any).displayHeight ?? 0;
    yPos = -refHeight / 2 + config.top + h / 2;
  } else if (config.bottom !== undefined) {
    const h = targetH ?? (obj as any).height ?? (obj as any).displayHeight ?? 0;
    yPos = refHeight / 2 - config.bottom - h / 2;
  }

  if (xPos !== undefined || yPos !== undefined) {
    const finalX = (xPos ?? (obj as any).x) + (config.offsetX ?? 0);
    const finalY = (yPos ?? (obj as any).y) + (config.offsetY ?? 0);
    setGameObjectPosition(obj, finalX, finalY);
  }
}
