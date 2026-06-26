import * as Phaser from "phaser";
import { Orientation, Sizer } from "./Sizer";

export interface ScrollablePanelConfig {
  x?: number;
  y?: number;
  width: number;
  height: number;
  space?: {
    item?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
}

export interface ScrollablePanelBackgroundConfig {
  fillColor?: number;
  fillAlpha?: number;
  cornerRadius?: number;
  strokeColor?: number;
  strokeWidth?: number;
}

export class ScrollablePanel extends Phaser.GameObjects.Container {
  private widthVal: number;
  private heightVal: number;
  private scrollY = 0;
  private maxScrollY = 0;
  private sizer: Sizer;
  private scrollbar: Phaser.GameObjects.Graphics;
  private scrollbarBg: Phaser.GameObjects.Graphics;
  private viewportMaskGraphics: Phaser.GameObjects.Graphics;
  private background: Phaser.GameObjects.Graphics | null = null;
  private backgroundConfig: ScrollablePanelBackgroundConfig | null = null;
  private _prevWidth: number;
  private _prevHeight: number;
  private visibleArea: Phaser.Geom.Rectangle;

  constructor(scene: Phaser.Scene, config: ScrollablePanelConfig) {
    super(scene);
    super.setVisible(false);

    if (config.x !== undefined) this.x = config.x;
    if (config.y !== undefined) this.y = config.y;

    this.widthVal = config.width;
    this.heightVal = config.height;
    this._prevWidth = config.width;
    this._prevHeight = config.height;
    this.setSize(config.width, config.height);
    this.visibleArea = new Phaser.Geom.Rectangle(
      -config.width / 2,
      -config.height / 2,
      config.width,
      0,
    );

    // Add container to scene FIRST so applyAnchor can position it correctly
    scene.add.existing(this);

    // Create sizer as the content layout manager
    this.sizer = new Sizer(scene, {
      orientation: Orientation.Vertical,
      space: config.space,
    });
    this.sizer.setSize(config.width, config.height);
    super.add(this.sizer);

    this.viewportMaskGraphics = new Phaser.GameObjects.Graphics(scene);
    this.sizer.enableFilters();
    this.sizer.filters?.external.addMask(
      this.viewportMaskGraphics,
      false,
      scene.cameras.main,
      "world",
    );

    // Scrollbar background
    this.scrollbarBg = scene.add.graphics();
    super.add(this.scrollbarBg);

    // Scrollbar thumb
    this.scrollbar = scene.add.graphics();
    super.add(this.scrollbar);

    // Setup wheel scrolling
    scene.input.on("wheel", this.onWheel, this);
    scene.events.once("shutdown", this.destroy, this);

    this.drawScrollbar();
  }

  private hasContent(): boolean {
    return this.sizer.list.length > 0;
  }

  private updateVisibility(): void {
    super.setVisible(this.hasContent());
  }

  private updateVisibleArea(): void {
    const contentSize = this.sizer.getContentSize();

    this.visibleArea.setTo(
      -this.widthVal / 2,
      -this.heightVal / 2,
      this.widthVal,
      Math.min(this.heightVal, contentSize.height),
    );
  }

  preUpdate(): void {
    if (!this.sizer || !this.scene) return;
    if (this.width !== this._prevWidth || this.height !== this._prevHeight) {
      this._prevWidth = this.width;
      this._prevHeight = this.height;
      this.widthVal = this.width;
      this.heightVal = this.height;
      this.layout();
    }
  }

  private drawBackground(): void {
    if (!this.backgroundConfig) return;

    if (!this.background) {
      this.background = new Phaser.GameObjects.Graphics(this.scene);
      super.addAt(this.background, 0);
    }

    this.background.clear();
    this.background.setPosition(this.visibleArea.x, this.visibleArea.y);

    const alpha = this.backgroundConfig.fillAlpha ?? 1;
    const radius = this.backgroundConfig.cornerRadius ?? 0;

    if (this.backgroundConfig.fillColor !== undefined) {
      this.background.fillStyle(this.backgroundConfig.fillColor, alpha);
      this.background.fillRoundedRect(
        0,
        0,
        this.visibleArea.width,
        this.visibleArea.height,
        radius,
      );
    }
    if (
      this.backgroundConfig.strokeWidth &&
      this.backgroundConfig.strokeColor !== undefined
    ) {
      this.background.lineStyle(
        this.backgroundConfig.strokeWidth,
        this.backgroundConfig.strokeColor,
      );
      this.background.strokeRoundedRect(
        0,
        0,
        this.visibleArea.width,
        this.visibleArea.height,
        radius,
      );
    }
  }

  addBackground(config: ScrollablePanelBackgroundConfig): this {
    this.backgroundConfig = config;
    this.drawBackground();
    return this;
  }

  add<T extends Phaser.GameObjects.GameObject>(child: T | T[]): this {
    this.sizer.add(child);
    this.layout();
    return this;
  }

  private getVisibleAreaBounds(): Phaser.Geom.Rectangle {
    const left = this.visibleArea.left;
    const right = this.visibleArea.right;
    const top = this.visibleArea.top;
    const bottom = this.visibleArea.bottom;
    const worldMatrix = this.getWorldTransformMatrix();
    const topLeft = worldMatrix.transformPoint(left, top);
    const topRight = worldMatrix.transformPoint(right, top);
    const bottomRight = worldMatrix.transformPoint(right, bottom);
    const bottomLeft = worldMatrix.transformPoint(left, bottom);
    const minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    const maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);

    return new Phaser.Geom.Rectangle(minX, minY, maxX - minX, maxY - minY);
  }

  private getViewportCorners(): Phaser.Types.Math.Vector2Like[] {
    const left = -this.widthVal / 2;
    const right = this.widthVal / 2;
    const top = -this.heightVal / 2;
    const bottom = this.heightVal / 2;
    const worldMatrix = this.getWorldTransformMatrix();

    return [
      worldMatrix.transformPoint(left, top),
      worldMatrix.transformPoint(right, top),
      worldMatrix.transformPoint(right, bottom),
      worldMatrix.transformPoint(left, bottom),
    ];
  }

  private updateViewportMask(): void {
    const [topLeft, topRight, bottomRight, bottomLeft] =
      this.getViewportCorners();

    this.viewportMaskGraphics.clear();
    this.viewportMaskGraphics.fillStyle(0xffffff, 1);
    this.viewportMaskGraphics.beginPath();
    this.viewportMaskGraphics.moveTo(topLeft.x, topLeft.y);
    this.viewportMaskGraphics.lineTo(topRight.x, topRight.y);
    this.viewportMaskGraphics.lineTo(bottomRight.x, bottomRight.y);
    this.viewportMaskGraphics.lineTo(bottomLeft.x, bottomLeft.y);
    this.viewportMaskGraphics.closePath();
    this.viewportMaskGraphics.fillPath();
  }

  private resizeContent(): void {
    const contentSize = this.sizer.getContentSize();
    this.sizer.setSize(
      this.widthVal,
      Math.max(this.heightVal, contentSize.height),
    );
    this.sizer.layout();
  }

  private onWheel(
    pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    _deltaY: number,
    _deltaZ: number,
  ): void {
    if (!this.hasContent()) return;

    const bounds = this.getVisibleAreaBounds();
    if (
      pointer.x >= bounds.left &&
      pointer.x <= bounds.right &&
      pointer.y >= bounds.top &&
      pointer.y <= bounds.bottom
    ) {
      this.scene.input.stopPropagation();

      const delta = _deltaY > 0 ? 30 : -30;
      this.scrollY = Phaser.Math.Clamp(
        this.scrollY + delta,
        0,
        this.maxScrollY,
      );
      this.updateContent();
      this.drawScrollbar();
    }
  }

  private updateContent(): void {
    this.sizer.y = (this.sizer.height - this.heightVal) / 2 - this.scrollY;
  }

  private drawScrollbar(): void {
    this.scrollbar.clear();
    this.scrollbarBg.clear();

    if (this.maxScrollY <= 0) return;

    const trackTop = this.visibleArea.top + 4;
    const trackHeight = Math.max(0, this.visibleArea.height - 8);
    const trackRight = this.visibleArea.right;
    if (trackHeight <= 0) return;

    const thumbHeight = Math.min(
      trackHeight,
      Math.max(
        30,
        this.visibleArea.height *
          (this.visibleArea.height /
            (this.visibleArea.height + this.maxScrollY)),
      ),
    );
    const thumbY =
      trackTop + (this.scrollY / this.maxScrollY) * (trackHeight - thumbHeight);

    this.scrollbarBg.fillStyle(0x333333, 0.5);
    this.scrollbarBg.fillRoundedRect(
      trackRight - 8,
      trackTop,
      6,
      trackHeight,
      3,
    );

    this.scrollbar.fillStyle(0xffffff, 0.7);
    this.scrollbar.fillRoundedRect(trackRight - 6, thumbY, 4, thumbHeight, 2);
  }

  private recalculateMaxScroll(): void {
    this.maxScrollY = Math.max(0, this.sizer.height - this.heightVal);
    this.scrollY = Phaser.Math.Clamp(this.scrollY, 0, this.maxScrollY);
  }

  layout(): void {
    this.resizeContent();
    this.updateVisibleArea();
    this.recalculateMaxScroll();
    this.updateContent();
    this.updateViewportMask();
    this.drawBackground();
    this.drawScrollbar();
    this.updateVisibility();
  }

  setOrigin(_originX: number, _originY?: number): this {
    return this;
  }

  override setVisible(_value: boolean): this {
    this.updateVisibility();
    return this;
  }

  override destroy(fromScene?: boolean): void {
    if (this.scene) {
      this.scene.input.off("wheel", this.onWheel, this);
      this.scene.events.off("shutdown", this.destroy, this);
    }
    this.sizer.filters?.external.clear();
    this.viewportMaskGraphics.destroy();
    super.destroy(fromScene);
  }
}
