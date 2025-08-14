import AnchorPlugin from "phaser3-rex-plugins/plugins/anchor-plugin";
import { FloorplanV2Scene } from "./FloorplanV2Scene";
import { StagingPolygon } from "./StagingPolygon";
import { getHexNumberByName } from "@/ui/colors";

class PolygonThumbnail {
    private scene: UIScene;
    private polygon: StagingPolygon;
    private mainScene: FloorplanV2Scene;
    // @ts-expect-error TS2564: Property 'container' has no initializer...
    private container: Phaser.GameObjects.Container;
    // @ts-expect-error TS2564
    private thumbnailGraphics: Phaser.GameObjects.Graphics;
    // @ts-expect-error TS2564
    private boundingRect: Phaser.GameObjects.Rectangle;
    private targetWidth: number;
    private targetHeight: number;
    private cachedScaledVertices: {x: number, y: number}[] = [];

    constructor(scene: UIScene, polygon: StagingPolygon, mainScene: FloorplanV2Scene, targetWidth: number, targetHeight: number) {
        this.scene = scene;
        this.polygon = polygon;
        this.mainScene = mainScene;
        this.targetWidth = targetWidth;
        this.targetHeight = targetHeight;

        this.createThumbnail();
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        // Subscribe to color changes from the polygon
        this.polygon.on('colorChanged', this.onColorChanged, this);
    }

    private onColorChanged = (): void => {
        this.updateColor();
    }

    private calculateScaledVertices(): {x: number, y: number}[] {
        const vertices = this.polygon.getVertices();
        if (vertices.length < 3) return [];

        // Calculate bounding box from vertices
        const minX = Math.min(...vertices.map(v => v.x));
        const maxX = Math.max(...vertices.map(v => v.x));
        const minY = Math.min(...vertices.map(v => v.y));
        const maxY = Math.max(...vertices.map(v => v.y));
        const originalWidth = maxX - minX;
        const originalHeight = maxY - minY;

        // Calculate scale to fit within target dimensions while maintaining aspect ratio
        const scaleX = this.targetWidth / originalWidth;
        const scaleY = this.targetHeight / originalHeight;
        const scale = Math.min(scaleX, scaleY);

        // Calculate center of bounding box
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        // Offset vertices to center the shape at origin (0,0)
        const centeredVertices = vertices.map(vertex => ({
            x: vertex.x - centerX,
            y: vertex.y - centerY
        }));

        // Scale the centered vertices for drawing
        return centeredVertices.map(vertex => ({
            x: vertex.x * scale,
            y: vertex.y * scale
        }));
    }

    private drawPolygon(scaledVertices: {x: number, y: number}[]): void {
        if (!this.thumbnailGraphics || scaledVertices.length < 3) return;

        const fillColor = getHexNumberByName(this.polygon.color);
        
        this.thumbnailGraphics.clear();
        this.thumbnailGraphics.fillStyle(fillColor);
        this.thumbnailGraphics.lineStyle(2, 0xffffff);
        this.thumbnailGraphics.fillPoints(scaledVertices, true);
        this.thumbnailGraphics.strokePoints(scaledVertices, true);
    }

    private createThumbnail(): void {
        /**
         * GRAPHICS vs POLYGON CHOICE & rexUI COMPATIBILITY
         * 
         * 1. WHY WE USE GRAPHICS INSTEAD OF POLYGON OBJECTS:
         *    - Polygon game objects have origin calculation issues in Phaser
         *    - Origin is calculated incorrectly, causing offset rendering
         *    - Graphics objects provide more consistent rendering behavior
         *    - Graphics approach matches StagingPolygon implementation
         *    
         *    POLYGON OFFSET ISSUE DETAILS:
         *    - Polygon objects calculate displayOrigin as: originX * width, originY * height
         *    - This assumes vertices start from (0,0), but arbitrary polygons don't
         *    - When vertices have negative coordinates, the offset calculation fails
         *    - Example: vertices [(-50,-50), (50,-50), (0,50)] with origin(0.5,0.5)
         *    - DisplayOrigin = (50,50), but should be (0,0) since AABB center is already (0,0)
         *    - Result: shape renders offset from intended center position
         *    - Graphics objects avoid this by drawing relative to position directly
         * 
         * 2. WHY A DUMMY RECTANGLE IS REQUIRED:
         *    - rexUI ScrollablePanel uses masking system to clip content
         *    - Container.getBounds() calculates bounds from child objects
         *    - Graphics objects have unreliable getBounds() - often returns 0x0
         *    - Empty bounds cause rexUI masking to hide the entire container
         *    - Dummy rectangle provides meaningful bounds for rexUI layout system
         *    - Without dummy rect: Container bounds = 0x0 → masked as invisible
         *    - With dummy rect: Container bounds = meaningful → remains visible
         * 
         * This is found by investigating rexUI's source code:
         * - rexUI ScrollableBlock.LayoutChildren() calls MaskChildren()
         * - MaskChildren() checks if child bounds intersect with parent bounds
         * - If no intersection: calls ShowNone() → setChildMaskVisible(false)
         * - Graphics-only containers fail bounds check → become invisible
         * - Rectangle provides the size reference rexUI needs for proper layout
         */
        
        // Calculate and cache scaled vertices
        this.cachedScaledVertices = this.calculateScaledVertices();
        if (this.cachedScaledVertices.length < 3) return;

        // Create graphics object for drawing the polygon
        this.thumbnailGraphics = this.scene.add.graphics();
        
        // Draw the polygon using cached vertices
        this.drawPolygon(this.cachedScaledVertices);
        
        // Create a bounding rectangle for proper getBounds() calculation
        this.boundingRect = this.scene.add.rectangle(0, 0, this.targetWidth, this.targetHeight, 0x000000, 0);
        this.boundingRect.setOrigin(0.5, 0.5);
        
        // Create container that encloses the bounds of the thumbnail
        this.container = this.scene.add.container(0, 0);
        
        // Add bounding rect first (invisible, for bounds calculation)
        this.container.add(this.boundingRect);
        
        // Add thumbnail graphics to container
        this.container.add(this.thumbnailGraphics);

        // Position graphics at (0,0) - with positive coords + origin(0.5,0.5), this centers perfectly
        this.thumbnailGraphics.setPosition(0, 0);

        // Set container size for proper bounds
        this.container.setSize(this.targetWidth, this.targetHeight);

        // Set interactive area on graphics (like StagingPolygon)
        this.setGraphicsInteractiveArea(this.cachedScaledVertices);
    }

    private setGraphicsInteractiveArea(vertices: {x: number, y: number}[]): void {
        // Create hit area using vertices directly (no shift needed for graphics)
        const hitAreaVertices = vertices.map(v => new Phaser.Geom.Point(v.x, v.y));
        const polygon = new Phaser.Geom.Polygon(hitAreaVertices);
        
        // Set interactive on graphics object (like StagingPolygon)
        this.thumbnailGraphics.setInteractive(polygon, Phaser.Geom.Polygon.Contains);
        
        // Add click handler
        this.thumbnailGraphics.on('pointerdown', () => {
            this.mainScene.selectPolygon(this.polygon);
        });
    }

    public updateColor(): void {
        if (!this.thumbnailGraphics) return;

        // Use cached vertices and redraw with new color
        this.drawPolygon(this.cachedScaledVertices);
    }

    public getContainer(): Phaser.GameObjects.Container {
        return this.container;
    }

    public destroy(): void {
        // Unsubscribe from polygon events
        this.polygon.off('colorChanged', this.onColorChanged, this);
        
        if (this.container) {
            this.container.destroy();
        }
    }
}

export class UIScene extends Phaser.Scene {
    private mainScene: FloorplanV2Scene | undefined;
    private shapesList: ShapesList | undefined;

    constructor() {
        super({ key: "UIScene" });
    }

    init(data: { mainScene: FloorplanV2Scene }) {
        this.mainScene = data.mainScene;
    }

    create() {
        // This UI scene will render on top of the main scene
        // All UI elements here are completely independent of camera transformations
        this.shapesList = new ShapesList(this, this.mainScene!);
    }

    update() {
        if (this.shapesList) {
            this.shapesList.update();
        }
    }
}

class ShapesList {
    private uiScene: UIScene;
    private mainScene: FloorplanV2Scene;
    private container: any; // ScrollablePanel from rexUI
    private sizer: any; // Vertical sizer inside the scrollable panel
    private thumbnails: PolygonThumbnail[] = [];
    private isVisible: boolean = false;
    private lastPolygonCount: number = 0;
    
    // Panel configuration
    private readonly PANEL_WIDTH = 200;
    private readonly THUMBNAIL_MARGIN = 24;
    
    constructor(uiScene: UIScene, mainScene: FloorplanV2Scene) {
        this.uiScene = uiScene;
        this.mainScene = mainScene;
        
        // Create vertical sizer for thumbnails
        this.sizer = uiScene.rexUI.add.sizer({
            orientation: 'y',
            space: { item: this.THUMBNAIL_MARGIN }
        });
        
        // Create scrollable panel using rexUI
        this.container = uiScene.rexUI.add.scrollablePanel({
            x: 0,
            y: 0,
            width: this.PANEL_WIDTH,
            height: 200, // Will be adjusted dynamically
            panel: {
                child: this.sizer
            }
        });
        
        // Add background using rexUI's addBackground method (this will auto-resize)
        const background = uiScene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x000000, 0.3).setStrokeStyle(2, 0x333333);
        this.container.addBackground(background);
        
        this.container.setOrigin(1.0, 0);
        // Use anchor plugin to position on right side, 200 units from top
        (uiScene.plugins.get('rexAnchor')! as AnchorPlugin).add(this.container, {
            right: 'right-10',
            top: 'top+100'
        });

        // Layout after adding background
        this.container.layout();

        // // Add debug border to see the panel bounds
        // this.container.drawBounds(uiScene.add.graphics(), 0xff0000);
        
        this.container.setDepth(1000); // High depth to stay on top
        
        // Hide initially - positioning will be done when shown
        this.container.setVisible(false);
    }
    
    private updatePosition(): void {
        // Position is handled by rex anchor plugin, no manual positioning needed
    }
    
    public update(): void {
        // Update shapes list - only polygons, no rectangles
        const polygons = this.mainScene.getStagingPolygons();
        const totalShapes = polygons.length;
        
        if (totalShapes === 0 && this.isVisible) {
            this.hide();
            this.lastPolygonCount = 0;
        } else if (totalShapes > 0 && !this.isVisible) {
            this.show();
            this.updateShapesList(polygons);
            this.lastPolygonCount = totalShapes;
        } else if (totalShapes > 0 && this.isVisible && totalShapes !== this.lastPolygonCount) {
            // Only update if count changed
            this.updateShapesList(polygons);
            this.lastPolygonCount = totalShapes;
        }
    }
    
    private show(): void {
        this.isVisible = true;
        // Update position when showing since background height is now properly set
        this.updatePosition();
        this.container.setVisible(true);
    }
    
    private hide(): void {
        this.isVisible = false;
        this.container.setVisible(false);
    }
    
    private updateShapesList(polygons: StagingPolygon[]): void {
        // Clear existing thumbnails from sizer
        this.sizer.clear(true);
        // Destroy old thumbnails
        this.thumbnails.forEach(thumbnail => thumbnail.destroy());
        this.thumbnails = [];
        
        // Create thumbnails and add to sizer
        const thumbnailWidth = this.PANEL_WIDTH - this.THUMBNAIL_MARGIN * 2;
        const thumbnailHeight = 150;
        
        polygons.forEach((polygon, index) => {
            const thumbnail = new PolygonThumbnail(this.uiScene, polygon, this.mainScene, thumbnailWidth, thumbnailHeight);
            const thumbnailContainer = thumbnail.getContainer();
            
            if (thumbnailContainer) {
                this.thumbnails.push(thumbnail);
                this.sizer.add(thumbnailContainer);
            }
        });
        
        // Measure actual content height by summing thumbnail container heights and gaps
        let contentHeight = 0;
        this.thumbnails.forEach((thumbnail, index) => {
            const container = thumbnail.getContainer();
            if (container) {
                const bounds = container.getBounds();
                contentHeight += bounds.height;
                
                // Add margin between thumbnails (but not after the last one)
                if (index < this.thumbnails.length - 1) {
                    contentHeight += this.THUMBNAIL_MARGIN;
                }
            }
        });
        const maxViewportHeight = this.uiScene.cameras.main.height - 200; // Leave 200px margin (100px top + 100px bottom)
        const panelHeight = Math.min(contentHeight, maxViewportHeight);
        
        // Resize container to fit content but not exceed viewport
        this.container.setMinSize(this.PANEL_WIDTH, panelHeight);
        
        // Force layout update for background to resize properly
        this.container.layout();
        
        this.container.drawBounds(this.uiScene.add.graphics().clear(), 0x00ffff);
        
        // Set higher depth for thumbnail containers so they're interactive above background
        this.thumbnails.forEach(thumbnail => {
            thumbnail.getContainer().setDepth(2000); // Higher than container depth (1000)
        });
    }
    
}