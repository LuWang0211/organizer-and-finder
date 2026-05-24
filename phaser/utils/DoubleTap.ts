import type * as Phaser from "phaser";

export interface DoubleTapConfig {
  taps?: number;
  interval?: number;
  moveThreshold?: number;
}

type DoubleTapCallback = () => void;

export class DoubleTap {
  private scene: Phaser.Scene;
  private config: Required<DoubleTapConfig>;
  private tapTimes: number[] = [];
  private startX = 0;
  private startY = 0;
  private isTracking = false;
  private callbacks: Map<string, DoubleTapCallback> = new Map();
  private target: Phaser.GameObjects.GameObject;
  private destroyed = false;

  constructor(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    config: DoubleTapConfig = {},
  ) {
    this.scene = scene;
    this.target = target;
    this.config = {
      taps: config.taps ?? 2,
      interval: config.interval ?? 300,
      moveThreshold: config.moveThreshold ?? 10,
    };

    target.on("pointerdown", this.onPointerDown, this);
    scene.events.once("shutdown", this.destroy, this);
  }

  private onPointerDown = (pointer: Phaser.Input.Pointer): void => {
    if (this.destroyed) return;

    const now = Date.now();

    if (!this.isTracking) {
      this.tapTimes = [now];
      this.startX = pointer.x;
      this.startY = pointer.y;
      this.isTracking = true;
      return;
    }

    const dx = Math.abs(pointer.x - this.startX);
    const dy = Math.abs(pointer.y - this.startY);

    if (dx > this.config.moveThreshold || dy > this.config.moveThreshold) {
      this.isTracking = false;
      this.tapTimes = [];
      return;
    }

    const lastTap = this.tapTimes[this.tapTimes.length - 1];
    if (now - lastTap <= this.config.interval) {
      this.tapTimes.push(now);
      if (this.tapTimes.length >= this.config.taps) {
        this.emit("tap");
        this.tapTimes = [];
        this.isTracking = false;
      }
    } else {
      this.tapTimes = [now];
      this.startX = pointer.x;
      this.startY = pointer.y;
    }
  };

  on(event: "tap", callback: DoubleTapCallback): this {
    this.callbacks.set(event, callback);
    return this;
  }

  private emit(event: string): void {
    const cb = this.callbacks.get(event);
    if (cb) cb();
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.target.off("pointerdown", this.onPointerDown, this);
    this.scene.events.off("shutdown", this.destroy, this);
  }
}
