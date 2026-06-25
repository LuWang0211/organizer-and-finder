import * as Phaser from "phaser";
import type { AnchorConfig } from "./applyAnchor";
import { applyAnchor } from "./applyAnchor";
import type { ChildConfig } from "./common";
import { clearBounds, drawBounds } from "./common";

export class OverlapSizer extends Phaser.GameObjects.Container {
  private readonly anchorConfig: AnchorConfig;
  private readonly childConfigs = new Map<
    Phaser.GameObjects.GameObject,
    ChildConfig
  >();
  private lastRefWidth = 0;
  private lastRefHeight = 0;

  constructor(scene: Phaser.Scene, anchorConfig: AnchorConfig = {}) {
    super(scene);
    this.anchorConfig = anchorConfig;

    // Auto-add to scene if not already added to a container
    if (this.parentContainer === null) {
      scene.add.existing(this);
    }

    this.reapplyAnchor();
    scene.scale.on("resize", this.handleResize, this);
    scene.events.once("shutdown", this.removeResizeListener, this);
  }

  addChild(
    gameObject: Phaser.GameObjects.GameObject,
    childConfig: ChildConfig = {},
  ): this {
    this.childConfigs.set(gameObject, childConfig);
    this.add(gameObject);
    this.layoutChild(gameObject, childConfig);

    return this;
  }

  layout(): void {
    for (const child of this.list) {
      const gameObject = child as Phaser.GameObjects.GameObject;
      this.layoutChild(gameObject, this.childConfigs.get(gameObject) ?? {});
    }
  }

  preUpdate(): void {
    const { width, height } = this.getAnchorReferenceSize();
    if (width !== this.lastRefWidth || height !== this.lastRefHeight) {
      this.reapplyAnchor();
      this.layout();
    }
  }

  destroy(fromScene?: boolean): void {
    this.removeResizeListener();
    this.scene?.events.off("shutdown", this.removeResizeListener, this);
    clearBounds(this);
    super.destroy(fromScene);
  }

  private handleResize(): void {
    this.reapplyAnchor();
    this.layout();
  }

  private removeResizeListener(): void {
    this.scene?.scale.off("resize", this.handleResize, this);
  }

  private reapplyAnchor(): void {
    applyAnchor(this, this.scene, this.anchorConfig);

    const { width, height } = this.getAnchorReferenceSize();
    this.lastRefWidth = width;
    this.lastRefHeight = height;
  }

  private getAnchorReferenceSize(): { width: number; height: number } {
    const parent = this.parentContainer as any;
    const parentBounds = parent?.getBounds?.();

    return {
      width:
        parent?.width ||
        parent?.displayWidth ||
        parentBounds?.width ||
        this.scene.scale.width,
      height:
        parent?.height ||
        parent?.displayHeight ||
        parentBounds?.height ||
        this.scene.scale.height,
    };
  }

  private layoutChild(
    gameObject: Phaser.GameObjects.GameObject,
    childConfig: ChildConfig,
  ): void {
    const align = childConfig.align ?? "center-center";
    const minW = childConfig.minWidth ?? 0;
    const minH = childConfig.minHeight ?? 0;
    const pad = childConfig.padding ?? {};
    const expand = childConfig.expand ?? {};

    let targetX: number;
    let targetY: number;

    if (align === "center-center") {
      targetX = (pad.left ?? 0) - (pad.right ?? 0);
      targetY = (pad.top ?? 0) - (pad.bottom ?? 0);
    } else {
      // More alignment options can be added here; center is the current behavior.
      targetX = (pad.left ?? 0) - (pad.right ?? 0);
      targetY = (pad.top ?? 0) - (pad.bottom ?? 0);
    }

    (gameObject as any).x = targetX;
    (gameObject as any).y = targetY;

    const availW = expand.width
      ? this.width - (pad.left ?? 0) - (pad.right ?? 0)
      : undefined;
    const availH = expand.height
      ? this.height - (pad.top ?? 0) - (pad.bottom ?? 0)
      : undefined;

    if (availW !== undefined || availH !== undefined) {
      const finalW =
        availW ??
        (gameObject as any).width ??
        (gameObject as any).displayWidth ??
        minW;
      const finalH =
        availH ??
        (gameObject as any).height ??
        (gameObject as any).displayHeight ??
        minH;
      if ("setSize" in gameObject) {
        (gameObject as any).setSize(finalW, finalH);
      } else if ("setDisplaySize" in gameObject) {
        (gameObject as any).setDisplaySize(finalW, finalH);
      }
    }
  }

  drawBounds(color: number = 0xff0000, alpha: number = 0.3): this {
    const w = (this as any).width;
    const h = (this as any).height;

    const drawX =
      (this as any).width > 0 ? this.x - (this as any).width / 2 : this.x;
    const drawY =
      (this as any).height > 0 ? this.y - (this as any).height / 2 : this.y;

    console.debug("OverlapSizer bounds:", {
      x: drawX,
      y: drawY,
      width: w,
      height: h,
    });

    drawBounds(this, this.scene, color, alpha);
    return this;
  }
}
