import { FloorplanV2Scene } from "./FloorplanV2Scene";
import { getHexNumberByName, FloorPlanColor } from "@/ui/colors";

export interface PolygonVertex {
    x: number;
    y: number;
}

export interface OriginalRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class StagingPolygon {
    private scene: FloorplanV2Scene;
    private phaserGraphics: Phaser.GameObjects.Graphics;
    private _isSelected: boolean = false;
    private vertices: PolygonVertex[] = [];
    private originalRectangles: OriginalRectangle[] = [];
    private _color: FloorPlanColor = "gray-500"; // Default color

    constructor(scene: FloorplanV2Scene, vertices: PolygonVertex[], originalRectangles: OriginalRectangle[]) {
        this.scene = scene;
        this.vertices = vertices;
        this.originalRectangles = originalRectangles;

        this.phaserGraphics = this.scene.add.graphics();
        
        (this.phaserGraphics as any).stagingPolygon = this;
        
        this.render();
        
        // Set interactive area after rendering
        this.updateInteractiveArea();
    }

    get gameObject(): Phaser.GameObjects.Graphics {
        return this.phaserGraphics;
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    get polygonVertices(): PolygonVertex[] {
        return [...this.vertices];
    }

    get sourceRectangles(): OriginalRectangle[] {
        return [...this.originalRectangles];
    }

    get color(): FloorPlanColor {
        return this._color;
    }

    setColor(color: FloorPlanColor): void {
        this._color = color;
        this.render();
    }

    setSelected(selected: boolean): void {
        this._isSelected = selected;
        this.render();
    }

    private render(): void {
        this.phaserGraphics.clear();
        
        const hexColorNumber = getHexNumberByName(this._color);
        
        if (this._isSelected) {
            // Selected styling - highlighted border
            this.phaserGraphics.fillStyle(hexColorNumber, 0.3); // Color fill with transparency
            this.phaserGraphics.lineStyle(3, 0xff3300); // Red border when selected
        } else {
            // Default styling
            this.phaserGraphics.fillStyle(hexColorNumber, 0.2); // Color fill with transparency
            this.phaserGraphics.lineStyle(2, hexColorNumber); // Color border
        }

        // Fill and stroke the polygon
        this.phaserGraphics.fillPoints(this.vertices, true);
        this.phaserGraphics.strokePoints(this.vertices, true);
    }

    private updateInteractiveArea(): void {
        const phaserPoints = this.vertices.map(v => new Phaser.Geom.Point(v.x, v.y));
        const polygon = new Phaser.Geom.Polygon(phaserPoints);
        
        this.phaserGraphics.setInteractive(polygon, Phaser.Geom.Polygon.Contains);
    }

    destroy(): void {
        this.phaserGraphics.destroy();
    }

    onClick(): void {
        console.log('Polygon clicked with vertices:', this.vertices);
        console.log('Original rectangles:', this.originalRectangles);
    }

    // Serialize to JSON
    toJSON(): object {
        return {
            vertices: this.vertices,
            originalRectangles: this.originalRectangles,
            color: this._color
        };
    }

    // Create from JSON
    static fromJSON(scene: FloorplanV2Scene, data: any): StagingPolygon {
        const polygon = new StagingPolygon(scene, data.vertices, data.originalRectangles);
        if (data.color) {
            polygon.setColor(data.color);
        }
        return polygon;
    }
}