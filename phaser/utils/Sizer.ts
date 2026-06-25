import * as Phaser from "phaser";
import type { AnchorConfig } from "./applyAnchor";
import { applyAnchor } from "./applyAnchor";

export enum Orientation {
  Horizontal = 0,
  Vertical = 1,
}

export interface SizerConfig {
  orientation?: Orientation;
  space?: {
    item?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  anchor?: AnchorConfig;
}

export class Sizer extends Phaser.GameObjects.Container {
  private orientation: Orientation;
  private space: {
    item: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  private anchorConfig?: AnchorConfig;
  private lastWidth: number = 0;
  private lastHeight: number = 0;

  constructor(scene: Phaser.Scene, config: SizerConfig = {}) {
    super(scene);
    this.orientation = config.orientation ?? Orientation.Vertical;
    this.space = {
      item: config.space?.item ?? 0,
      left: config.space?.left ?? 0,
      right: config.space?.right ?? 0,
      top: config.space?.top ?? 0,
      bottom: config.space?.bottom ?? 0,
    };
    this.anchorConfig = config.anchor;

    if (this.parentContainer === null) {
      scene.add.existing(this);
    }

    this.layout();
    if (this.anchorConfig) {
      applyAnchor(this, this.scene, this.anchorConfig);
    }
  }

  preUpdate(): void {
    let currentWidth: number;
    let currentHeight: number;

    if (this.parentContainer) {
      currentWidth = this.parentContainer.width;
      currentHeight = this.parentContainer.height;
    } else {
      currentWidth = this.scene.scale.width;
      currentHeight = this.scene.scale.height;
    }

    if (currentWidth !== this.lastWidth || currentHeight !== this.lastHeight) {
      this.lastWidth = currentWidth;
      this.lastHeight = currentHeight;
      if (this.anchorConfig) {
        applyAnchor(this, this.scene, this.anchorConfig);
      }
      this.layout();
    }
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }

  addSpace(): this {
    const space = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      0,
      0,
      0x000000,
      0.6,
    );
    (space as any).isSpace = true;
    this.add(space);
    return this;
  }

  getContentSize(): { width: number; height: number } {
    const isVertical = this.orientation === Orientation.Vertical;
    let width = 0;
    let height = 0;

    for (const child of this.list) {
      const c = child as any;
      const childWidth = c.displayWidth || c.width || 0;
      const childHeight = c.displayHeight || c.height || 0;

      if (isVertical) {
        width = Math.max(width, childWidth);
        height += childHeight;
      } else {
        width += childWidth;
        height = Math.max(height, childHeight);
      }
    }

    const gapCount = Math.max(0, this.list.length - 1);
    if (isVertical) {
      height += gapCount * this.space.item;
    } else {
      width += gapCount * this.space.item;
    }

    return {
      width: width + this.space.left + this.space.right,
      height: height + this.space.top + this.space.bottom,
    };
  }

  layout(): void {
    const isVertical = this.orientation === Orientation.Vertical;
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    let offsetX = -halfW + this.space.left;
    let offsetY = -halfH + this.space.top;

    for (const child of this.list) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = child as any;
      const cw = c.displayWidth || c.width || 0;
      const ch = c.displayHeight || c.height || 0;

      c.x = offsetX + cw / 2;
      c.y = offsetY + ch / 2;

      if (isVertical) {
        offsetY += ch + this.space.item;
      } else {
        offsetX += cw + this.space.item;
      }
    }
  }
}
