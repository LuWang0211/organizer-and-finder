import { FloorplanV2Scene } from "./FloorplanV2Scene";

export class StagingRectangle {
    private scene: FloorplanV2Scene;
    private phaserRectangle: Phaser.GameObjects.Rectangle;
    private _isSelected: boolean = false;

    constructor(scene: FloorplanV2Scene, x: number, y: number, width: number, height: number) {
        this.scene = scene;
        this.phaserRectangle = this.scene.add.rectangle(x, y, width, height, 0x00ff00, 0.2);
        this.phaserRectangle.setStrokeStyle(2, 0x00ff00);
        this.phaserRectangle.setInteractive();
        this.scene.input.setDraggable(this.phaserRectangle);
        
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

    get isSelected(): boolean {
        return this._isSelected;
    }

    setPosition(x: number, y: number): void {
        this.phaserRectangle.setPosition(x, y);
    }

    setSelected(selected: boolean): void {
        this._isSelected = selected;
        this.updateVisualStyle();
    }

    private updateVisualStyle(): void {
        if (this._isSelected) {
            this.phaserRectangle.setStrokeStyle(3, 0xff3300);
        } else {
            this.phaserRectangle.setStrokeStyle(2, 0x00ff00);
        }
    }

    destroy(): void {
        this.phaserRectangle.destroy();
    }

    onDrag(dragX: number, dragY: number): void {
        this.phaserRectangle.setPosition(dragX, dragY);
    }

    onClick(): void {
        console.log('Rectangle clicked at:', this.x, this.y);
    }
}