export interface ChildConfig {
  minWidth?: number;
  minHeight?: number;
  align?: string;
  expand?: { width?: boolean; height?: boolean };
  padding?: { left?: number; right?: number; top?: number; bottom?: number };
}

const BOUNDS_GRAPHICS_KEY = Symbol("boundsGraphics");

function getLocalDebugRect(gameObject: Phaser.GameObjects.GameObject): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  const obj = gameObject as any;
  const width = obj.width ?? obj.displayWidth ?? 0;
  const height = obj.height ?? obj.displayHeight ?? 0;

  if (width <= 0 || height <= 0) {
    return null;
  }

  if (obj.displayOriginX !== undefined || obj.displayOriginY !== undefined) {
    return {
      x: -(obj.displayOriginX ?? 0),
      y: -(obj.displayOriginY ?? 0),
      width,
      height,
    };
  }

  return {
    x: -width / 2,
    y: -height / 2,
    width,
    height,
  };
}

export function drawBounds(
  gameObject: Phaser.GameObjects.GameObject,
  scene: Phaser.Scene,
  color: number = 0xff0000,
  alpha: number = 0.3,
): void {
  let g = (gameObject as any)[BOUNDS_GRAPHICS_KEY];
  if (!g) {
    g = scene.add.graphics();
    (gameObject as any)[BOUNDS_GRAPHICS_KEY] = g;
  }

  g.clear();
  g.fillStyle(color, alpha);
  g.lineStyle(2, color, 1);

  const localRect = getLocalDebugRect(gameObject);
  const worldMatrix = (gameObject as any).getWorldTransformMatrix?.();

  if (localRect && worldMatrix) {
    const left = localRect.x;
    const right = localRect.x + localRect.width;
    const top = localRect.y;
    const bottom = localRect.y + localRect.height;
    const topLeft = worldMatrix.transformPoint(left, top);
    const topRight = worldMatrix.transformPoint(right, top);
    const bottomRight = worldMatrix.transformPoint(right, bottom);
    const bottomLeft = worldMatrix.transformPoint(left, bottom);

    g.beginPath();
    g.moveTo(topLeft.x, topLeft.y);
    g.lineTo(topRight.x, topRight.y);
    g.lineTo(bottomRight.x, bottomRight.y);
    g.lineTo(bottomLeft.x, bottomLeft.y);
    g.closePath();
    g.fillPath();
    g.strokePath();
  } else {
    const bounds = (gameObject as any).getBounds?.();
    if (bounds) {
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      g.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  g.setDepth(1_000_000);
}

export function clearBounds(gameObject: Phaser.GameObjects.GameObject): void {
  const g = (gameObject as any)[BOUNDS_GRAPHICS_KEY];
  if (g) {
    g.destroy();
    (gameObject as any)[BOUNDS_GRAPHICS_KEY] = undefined;
  }
}
