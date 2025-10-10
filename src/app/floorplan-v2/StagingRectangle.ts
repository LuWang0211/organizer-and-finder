import type { FloorplanV2Scene } from "./FloorplanV2Scene";

export type EdgeType = "top" | "right" | "bottom" | "left" | "none";

export interface SnapPoint {
  x: number;
  y: number;
  distance: number;
  type: "edge";
}

export class StagingRectangle {
  private scene: FloorplanV2Scene;
  private phaserRectangle: Phaser.GameObjects.Rectangle;
  private _isSelected: boolean = false;
  private resizeHandles: Phaser.GameObjects.Rectangle[] = [];
  private edgeThickness: number = 10;
  private handlesCreated: boolean = false;

  constructor(
    scene: FloorplanV2Scene,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.scene = scene;
    this.phaserRectangle = this.scene.add.rectangle(
      x,
      y,
      width,
      height,
      0x00ff00,
      0.2,
    );
    this.phaserRectangle.setStrokeStyle(2, 0x00ff00);
    this.phaserRectangle.setInteractive({ draggable: true });

    (this.phaserRectangle as any).stagingRectangle = this;
  }

  get gameObject(): Phaser.GameObjects.Rectangle {
    return this.phaserRectangle;
  }

  get x(): number {
    return this.phaserRectangle.x;
  }

  get y(): number {
    return this.phaserRectangle.y;
  }

  get width(): number {
    return this.phaserRectangle.width;
  }

  get height(): number {
    return this.phaserRectangle.height;
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  setPosition(x: number, y: number): void {
    this.phaserRectangle.setPosition(x, y);
  }

  setSelected(selected: boolean): void {
    this._isSelected = selected;
    this.updateVisualStyle();

    if (selected && !this.handlesCreated) {
      this.createResizeHandles();
      this.handlesCreated = true;
    }

    this.updateResizeHandles();
  }

  private updateVisualStyle(): void {
    if (this._isSelected) {
      this.phaserRectangle.setStrokeStyle(3, 0xff3300);
    } else {
      this.phaserRectangle.setStrokeStyle(2, 0x00ff00);
    }
  }

  private createResizeHandles(): void {
    const edges: EdgeType[] = ["top", "right", "bottom", "left"];

    edges.forEach((edge) => {
      const handle = this.scene.add.rectangle(0, 0, 20, 20, 0xff3300, 0.8);
      handle.setVisible(false);
      handle.setInteractive({ draggable: true });

      (handle as any).stagingRectangle = this;
      (handle as any).edgeType = edge;

      // Add cursor change on hover
      handle.on("pointerover", () => {
        this.setCursorForEdge(edge);
      });

      handle.on("pointerout", () => {
        this.scene.input.setDefaultCursor("default");
      });

      this.resizeHandles.push(handle);
    });
  }

  private setCursorForEdge(edge: EdgeType): void {
    switch (edge) {
      case "top":
      case "bottom":
        this.scene.input.setDefaultCursor("ns-resize");
        break;
      case "left":
      case "right":
        this.scene.input.setDefaultCursor("ew-resize");
        break;
    }
  }

  private updateResizeHandles(): void {
    if (!this._isSelected) {
      this.resizeHandles.forEach((handle) => handle.setVisible(false));
      return;
    }

    const bounds = this.phaserRectangle.getBounds();

    this.resizeHandles.forEach((handle, index) => {
      const edge: EdgeType = ["top", "right", "bottom", "left"][
        index
      ] as EdgeType;
      handle.setVisible(true);

      switch (edge) {
        case "top":
          handle.setPosition(bounds.centerX, bounds.top - 10);
          handle.setSize(20, 20);
          break;
        case "right":
          handle.setPosition(bounds.right + 10, bounds.centerY);
          handle.setSize(20, 20);
          break;
        case "bottom":
          handle.setPosition(bounds.centerX, bounds.bottom + 10);
          handle.setSize(20, 20);
          break;
        case "left":
          handle.setPosition(bounds.left - 10, bounds.centerY);
          handle.setSize(20, 20);
          break;
      }
    });
  }

  destroy(): void {
    this.resizeHandles.forEach((handle) => handle.destroy());
    this.resizeHandles = [];
    this.phaserRectangle.destroy();
  }

  onDrag(dragX: number, dragY: number): void {
    this.phaserRectangle.setPosition(dragX, dragY);
    this.updateResizeHandles();
  }

  onEdgeResize(edge: EdgeType, worldX: number, worldY: number): void {
    let finalX = worldX;
    let finalY = worldY;

    // Only find snap points if snapping is enabled
    if (this.scene.isSnappingEnabled()) {
      const snapPoints = this.scene.findSnapPoints(this, edge, worldX, worldY);
      const snapResult = this.scene.getSnapPosition(worldX, worldY, snapPoints);
      finalX = snapResult.x;
      finalY = snapResult.y;
    }

    const bounds = this.phaserRectangle.getBounds();
    let newX = this.phaserRectangle.x;
    let newY = this.phaserRectangle.y;
    let newWidth = this.phaserRectangle.width;
    let newHeight = this.phaserRectangle.height;

    switch (edge) {
      case "top": {
        const topDelta = finalY - bounds.top;
        newY += topDelta / 2;
        newHeight = Math.max(10, bounds.height - topDelta);
        break;
      }
      case "right": {
        const rightDelta = finalX - bounds.right;
        newX += rightDelta / 2;
        newWidth = Math.max(10, bounds.width + rightDelta);
        break;
      }
      case "bottom": {
        const bottomDelta = finalY - bounds.bottom;
        newY += bottomDelta / 2;
        newHeight = Math.max(10, bounds.height + bottomDelta);
        break;
      }
      case "left": {
        const leftDelta = finalX - bounds.left;
        newX += leftDelta / 2;
        newWidth = Math.max(10, bounds.width - leftDelta);
        break;
      }
    }

    this.phaserRectangle.setPosition(newX, newY);
    this.phaserRectangle.setSize(newWidth, newHeight);
    this.updateResizeHandles();
  }

  onClick(): void {
    console.log("Rectangle clicked at:", this.x, this.y);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.phaserRectangle.getBounds();
  }
}
