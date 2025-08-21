import { StagingRectangle, EdgeType, SnapPoint } from "./StagingRectangle";
import { StagingPolygon, PolygonVertex, OriginalRectangle } from "./StagingPolygon";
import PolyBool, { Polygon, Vec2 } from '@velipso/polybool';
import { FloorPlanColor } from "@/ui/colors";

export class FloorplanV2Scene extends Phaser.Scene {
    private floorplanV2Image?: Phaser.GameObjects.Image;
    private currentBackgroundInfo = {
        type: "floorplan-v2-1b1b",
        floorplanPicture: "/assets/floorplans/1b1b.png"
    };
    private defaultZoom: number = 1;
    private defaultCameraX: number = 0;
    private defaultCameraY: number = 0;
    private isDragging: boolean = false;
    private lastPointerX: number = 0;
    private lastPointerY: number = 0;
    private isDrawingMode: boolean = false;
    private firstClickPoint?: { x: number, y: number };
    private previewRectangle?: Phaser.GameObjects.Rectangle;
    private stagingRectangles: StagingRectangle[] = [];
    private stagingPolygons: StagingPolygon[] = [];
    private selectedRectangle?: StagingRectangle;
    private selectedPolygon?: StagingPolygon;
    private snapDistance: number = 10;
    private snappingEnabled: boolean = true;

    constructor() {
        super("FloorplanV2Scene");
    }

    preload() {
        this.load.image('floorplan-v2-1b1b', 'assets/floorplans/1b1b.png');
    }

    create() {
        const { width, height } = this.scale;
        
        this.floorplanV2Image = this.add.image(0, 0, 'floorplan-v2-1b1b');
        this.floorplanV2Image.setOrigin(0.5, 0.5);
        
        const scaleX = (width * 0.618) / this.floorplanV2Image.width;
        const scaleY = (height * 0.618) / this.floorplanV2Image.height;
        this.defaultZoom = Math.min(scaleX, scaleY);
        
        this.cameras.main.setZoom(this.defaultZoom);
        this.cameras.main.centerOn(0, 0);
        
        this.defaultCameraX = this.cameras.main.scrollX;
        this.defaultCameraY = this.cameras.main.scrollY;
        
        this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
            if (!this.isDrawingMode && (gameObject as any).stagingRectangle) {
                const stagingRect = (gameObject as any).stagingRectangle as StagingRectangle;
                
                if ((gameObject as any).edgeType) {
                    // Handle edge resizing using Phaser's drag coordinates
                    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
                    stagingRect.onEdgeResize((gameObject as any).edgeType, worldPoint.x, worldPoint.y);
                } else {
                    // Handle rectangle dragging
                    stagingRect.onDrag(dragX, dragY);
                }
                this.selectRectangle(stagingRect);
            }
        });

        this.input.on('pointerdown', (pointer: any, currentlyOver: any[]) => {
            if (!this.isDrawingMode) {
                if (currentlyOver.length > 0) {
                    const clickedObject = currentlyOver[0];
                    
                    if ((clickedObject as any).stagingRectangle) {
                        const stagingRect = (clickedObject as any).stagingRectangle as StagingRectangle;
                        this.selectRectangle(stagingRect);
                    } else if ((clickedObject as any).stagingPolygon) {
                        const stagingPolygon = (clickedObject as any).stagingPolygon as StagingPolygon;
                        this.selectPolygon(stagingPolygon);
                    }
                } else {
                    this.clearSelection();
                    this.startCameraDrag(pointer);
                }
            }
        });

        this.input.on('pointermove', (pointer: any) => {
            if (!this.isDrawingMode && this.isDragging) {
                this.updateCameraDrag(pointer);
            }
        });

        this.input.on('pointerup', () => {
            if (!this.isDrawingMode) {
                this.stopCameraDrag();
            }
        });
        
        this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
            if (!this.isDrawingMode) {
                const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
                const currentZoom = this.cameras.main.zoom;
                const newZoom = Phaser.Math.Clamp(currentZoom * zoomFactor, 0.1, 3);
                this.cameras.main.setZoom(newZoom);
            }
        });

        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointermove', this.handlePointerMove, this);

        this.events.on('resetScale', this.resetScale, this);
        this.events.on('toggleDrawingMode', this.toggleDrawingMode, this);
        this.events.on('deleteSelectedRectangle', this.deleteSelectedRectangle, this);
        this.events.on('deleteSelectedPolygon', this.deleteSelectedPolygon, this);
        this.events.on('changePolygonColor', this.changePolygonColor, this);
        this.events.on('setPolygonLabel', this.setPolygonLabel, this);
        this.events.on('toggleSnapping', this.toggleSnapping, this);
        this.events.on('combineRectangles', this.combineRectangles, this);
        this.events.on('reloadBackgroundImage', this.reloadBackgroundImage, this);
        
        // Launch UI scene for camera-independent UI elements
        this.scene.launch('UIScene', { mainScene: this });
        
        this.game.events.emit('sceneReady', this);
    }

    resetScale() {
        this.cameras.main.setZoom(this.defaultZoom);
        this.cameras.main.setScroll(this.defaultCameraX, this.defaultCameraY);
    }

    toggleDrawingMode(isDrawing: boolean) {
        this.isDrawingMode = isDrawing;
        
        if (!isDrawing) {
            this.cancelCurrentDrawing();
        }
    }

    cancelCurrentDrawing() {
        this.firstClickPoint = undefined;
        if (this.previewRectangle) {
            this.previewRectangle.destroy();
            this.previewRectangle = undefined;
        }
    }

    handlePointerDown(pointer: Phaser.Input.Pointer) {
        if (!this.isDrawingMode) return;

        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        if (!this.firstClickPoint) {
            this.firstClickPoint = { x: worldPoint.x, y: worldPoint.y };
            
            this.previewRectangle = this.add.rectangle(
                worldPoint.x, 
                worldPoint.y, 
                0, 
                0, 
                0xff0000, 
                0.3
            );
            this.previewRectangle.setStrokeStyle(2, 0xff0000);
        } else {
            this.createRectangle(this.firstClickPoint, { x: worldPoint.x, y: worldPoint.y });
            this.cancelCurrentDrawing();
        }
    }

    handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.isDrawingMode || !this.firstClickPoint || !this.previewRectangle) return;

        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        const width = worldPoint.x - this.firstClickPoint.x;
        const height = worldPoint.y - this.firstClickPoint.y;
        const centerX = this.firstClickPoint.x + width / 2;
        const centerY = this.firstClickPoint.y + height / 2;

        this.previewRectangle.setPosition(centerX, centerY);
        this.previewRectangle.setSize(Math.abs(width), Math.abs(height));
    }

    createRectangle(point1: { x: number, y: number }, point2: { x: number, y: number }) {
        const width = Math.abs(point2.x - point1.x);
        const height = Math.abs(point2.y - point1.y);
        
        // Prevent zero-dimension rectangles that cause hitAreaCallback errors
        // when clicking the same point twice during rectangle drawing
        if (width < 5 || height < 5) {
            return; // Don't create rectangles smaller than 5x5 pixels
        }
        
        const centerX = (point1.x + point2.x) / 2;
        const centerY = (point1.y + point2.y) / 2;

        const stagingRectangle = new StagingRectangle(this, centerX, centerY, width, height);

        this.stagingRectangles.push(stagingRectangle);
        this.emitRectangleCountChanged();
    }

    selectRectangle(rectangle: StagingRectangle): void {
        // Clear any polygon selection
        if (this.selectedPolygon) {
            this.selectedPolygon.setSelected(false);
            this.selectedPolygon = undefined;
        }

        if (this.selectedRectangle) {
            this.selectedRectangle.setSelected(false);
        }

        this.selectedRectangle = rectangle;
        rectangle.setSelected(true);

        this.events.emit('rectangleSelected', rectangle);
    }

    selectPolygon(polygon: StagingPolygon): void {
        // Clear any rectangle selection
        if (this.selectedRectangle) {
            this.selectedRectangle.setSelected(false);
            this.selectedRectangle = undefined;
            this.events.emit('rectangleSelected', null);
        }

        if (this.selectedPolygon) {
            this.selectedPolygon.setSelected(false);
        }

        this.selectedPolygon = polygon;
        polygon.setSelected(true);

        this.events.emit('polygonSelected', polygon);
    }

    clearSelection(): void {
        if (this.selectedRectangle) {
            this.selectedRectangle.setSelected(false);
            this.selectedRectangle = undefined;
            this.events.emit('rectangleSelected', null);
        }

        if (this.selectedPolygon) {
            this.selectedPolygon.setSelected(false);
            this.selectedPolygon = undefined;
            this.events.emit('polygonSelected', null);
        }
    }

    getSelectedRectangle(): StagingRectangle | undefined {
        return this.selectedRectangle;
    }

    deleteSelectedRectangle(): void {
        if (this.selectedRectangle) {
            const rectangleToDelete = this.selectedRectangle;
            
            const index = this.stagingRectangles.indexOf(rectangleToDelete);
            if (index > -1) {
                this.stagingRectangles.splice(index, 1);
            }
            
            rectangleToDelete.destroy();
            
            this.selectedRectangle = undefined;
            this.events.emit('rectangleSelected', null);
            this.emitRectangleCountChanged();
        }
    }

    deleteSelectedPolygon(): void {
        if (this.selectedPolygon) {
            const polygonToDelete = this.selectedPolygon;
            
            const index = this.stagingPolygons.indexOf(polygonToDelete);
            if (index > -1) {
                this.stagingPolygons.splice(index, 1);
            }
            
            polygonToDelete.destroy();
            
            this.selectedPolygon = undefined;
            this.events.emit('polygonSelected', null);
            this.emitPolygonCountChanged();
        }
    }

    changePolygonColor(color: FloorPlanColor): void {
        if (this.selectedPolygon) {
            this.selectedPolygon.setColor(color);
            // Re-emit the polygon selected event to update the UI with new color
            this.events.emit('polygonSelected', this.selectedPolygon);
        }
    }

    setPolygonLabel(label: string): void {
        if (this.selectedPolygon) {
            this.selectedPolygon.setLabel(label);
            // Re-emit the polygon selected event to update the UI with new label
            this.events.emit('polygonSelected', this.selectedPolygon);
        }
    }

    startCameraDrag(pointer: Phaser.Input.Pointer): void {
        this.isDragging = true;
        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;
    }

    updateCameraDrag(pointer: Phaser.Input.Pointer): void {
        if (this.isDragging) {
            const deltaX = pointer.x - this.lastPointerX;
            const deltaY = pointer.y - this.lastPointerY;
            
            this.cameras.main.scrollX -= deltaX / this.cameras.main.zoom;
            this.cameras.main.scrollY -= deltaY / this.cameras.main.zoom;
            
            this.lastPointerX = pointer.x;
            this.lastPointerY = pointer.y;
        }
    }

    stopCameraDrag(): void {
        this.isDragging = false;
    }

    toggleSnapping(enabled: boolean): void {
        this.snappingEnabled = enabled;
    }

    isSnappingEnabled(): boolean {
        return this.snappingEnabled;
    }

    findSnapPoints(rectangle: StagingRectangle, edge: EdgeType, worldX: number, worldY: number): SnapPoint[] {
        const snapPoints: SnapPoint[] = [];
        
        for (const otherRect of this.stagingRectangles) {
            if (otherRect === rectangle) continue;
            
            const otherBounds = otherRect.gameObject.getBounds();
            
            switch (edge) {
                case 'top':
                case 'bottom':
                    // Check horizontal edges of other rectangles
                    const snapToTop = Math.abs(worldY - otherBounds.top);
                    const snapToBottom = Math.abs(worldY - otherBounds.bottom);
                    
                    if (snapToTop <= this.snapDistance) {
                        snapPoints.push({
                            x: worldX,
                            y: otherBounds.top,
                            distance: snapToTop,
                            type: 'edge'
                        });
                    }
                    
                    if (snapToBottom <= this.snapDistance) {
                        snapPoints.push({
                            x: worldX,
                            y: otherBounds.bottom,
                            distance: snapToBottom,
                            type: 'edge'
                        });
                    }
                    break;
                    
                case 'left':
                case 'right':
                    // Check vertical edges of other rectangles
                    const snapToLeft = Math.abs(worldX - otherBounds.left);
                    const snapToRight = Math.abs(worldX - otherBounds.right);
                    
                    if (snapToLeft <= this.snapDistance) {
                        snapPoints.push({
                            x: otherBounds.left,
                            y: worldY,
                            distance: snapToLeft,
                            type: 'edge'
                        });
                    }
                    
                    if (snapToRight <= this.snapDistance) {
                        snapPoints.push({
                            x: otherBounds.right,
                            y: worldY,
                            distance: snapToRight,
                            type: 'edge'
                        });
                    }
                    break;
            }
        }
        
        return snapPoints.sort((a, b) => a.distance - b.distance);
    }

    getSnapPosition(worldX: number, worldY: number, snapPoints: SnapPoint[]): { x: number, y: number, snapped: boolean } {
        if (snapPoints.length === 0) {
            return { x: worldX, y: worldY, snapped: false };
        }
        
        const closest = snapPoints[0];
        return { x: closest.x, y: closest.y, snapped: true };
    }

    emitRectangleCountChanged(): void {
        this.events.emit('rectangleCountChanged', this.stagingRectangles.length);
    }

    emitPolygonCountChanged(): void {
        this.events.emit('polygonCountChanged', this.stagingPolygons.length);
    }

    combineRectangles(): void {
        if (this.stagingRectangles.length === 0) {
            alert('No rectangles to combine!');
            return;
        }

        // Remove duplicates first
        const uniqueRectangles = this.removeDuplicateRectangles();

        // For multiple rectangles, check if all are connected
        if (uniqueRectangles.length > 1 && !this.areAllRectanglesConnected(uniqueRectangles)) {
            alert('Warning: Not all rectangles are connected (overlap or touch). Cannot combine disconnected groups.');
            return;
        }

        // Convert rectangles to polygons and union them (works for single or multiple)
        this.unionRectanglesIntoPolygon(uniqueRectangles);
    }

    private removeDuplicateRectangles(): StagingRectangle[] {
        const unique: StagingRectangle[] = [];
        
        for (const rect of this.stagingRectangles) {
            const bounds = rect.gameObject.getBounds();
            const isDuplicate = unique.some(uniqueRect => {
                const uniqueBounds = uniqueRect.gameObject.getBounds();
                return Math.abs(bounds.x - uniqueBounds.x) < 0.1 &&
                       Math.abs(bounds.y - uniqueBounds.y) < 0.1 &&
                       Math.abs(bounds.width - uniqueBounds.width) < 0.1 &&
                       Math.abs(bounds.height - uniqueBounds.height) < 0.1;
            });
            
            if (!isDuplicate) {
                unique.push(rect);
            }
        }
        
        return unique;
    }

    private areAllRectanglesConnected(rectangles: StagingRectangle[]): boolean {
        if (rectangles.length <= 1) return true;

        // Build adjacency graph
        const adjacency: boolean[][] = [];
        for (let i = 0; i < rectangles.length; i++) {
            adjacency[i] = [];
            for (let j = 0; j < rectangles.length; j++) {
                adjacency[i][j] = i === j || this.rectanglesOverlapOrTouch(rectangles[i], rectangles[j]);
            }
        }

        // Use DFS to check if all rectangles are reachable from the first one
        const visited: boolean[] = new Array(rectangles.length).fill(false);
        this.dfs(0, adjacency, visited);

        return visited.every(v => v);
    }

    private rectanglesOverlapOrTouch(rect1: StagingRectangle, rect2: StagingRectangle): boolean {
        const bounds1 = rect1.gameObject.getBounds();
        const bounds2 = rect2.gameObject.getBounds();

        // Check for overlap or edge-to-edge contact
        const horizontalOverlap = bounds1.right >= bounds2.left && bounds1.left <= bounds2.right;
        const verticalOverlap = bounds1.bottom >= bounds2.top && bounds1.top <= bounds2.bottom;

        return horizontalOverlap && verticalOverlap;
    }

    private dfs(node: number, adjacency: boolean[][], visited: boolean[]): void {
        visited[node] = true;
        for (let i = 0; i < adjacency[node].length; i++) {
            if (adjacency[node][i] && !visited[i]) {
                this.dfs(i, adjacency, visited);
            }
        }
    }

    private unionRectanglesIntoPolygon(rectangles: StagingRectangle[]): void {
        // Convert rectangles to PolyBool format
        let unionResult = this.rectangleToPolyBoolPolygon(rectangles[0]);

        for (let i = 1; i < rectangles.length; i++) {
            const rectPolygon = this.rectangleToPolyBoolPolygon(rectangles[i]);
            unionResult = PolyBool.union(unionResult, rectPolygon);
        }

        // Convert result back to our format
        if (unionResult.regions.length === 0) {
            alert('Error: Union operation failed');
            return;
        }

        // Take the first (and should be only) region
        const region = unionResult.regions[0];
        const vertices: PolygonVertex[] = region.map(point => ({ x: point[0], y: point[1] }));

        const originalRectangles: OriginalRectangle[] = rectangles.map(rect => ({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        }));

        // Create polygon
        const polygon = new StagingPolygon(this, vertices, originalRectangles);
        this.stagingPolygons.push(polygon);

        // Remove original rectangles
        rectangles.forEach(rect => rect.destroy());
        this.stagingRectangles = [];
        this.selectedRectangle = undefined;
        this.events.emit('rectangleSelected', null);
        this.emitRectangleCountChanged();
        this.emitPolygonCountChanged();
    }

    private rectangleToPolyBoolPolygon(rectangle: StagingRectangle): Polygon {
        const bounds = rectangle.gameObject.getBounds();
        
        return {
            regions: [[
                [bounds.left, bounds.top] as Vec2,
                [bounds.right, bounds.top] as Vec2,
                [bounds.right, bounds.bottom] as Vec2,
                [bounds.left, bounds.bottom] as Vec2
            ]],
            inverted: false
        };
    }

    public getStagingPolygons(): StagingPolygon[] {
        return this.stagingPolygons;
    }

    reloadBackgroundImage(imageDataUrl: string, filename?: string): void {
        if (this.floorplanV2Image) {
            // Create a new texture from the data URL
            const textureKey = 'custom-background-' + Date.now();
            
            // Use the loader to add the texture properly
            this.load.image(textureKey, imageDataUrl);
            
            // Listen for when the texture is loaded
            this.load.once('complete', () => {
                if (this.floorplanV2Image) {
                    // Replace the texture
                    this.floorplanV2Image.setTexture(textureKey);
                    
                    // Update background info with new type and path
                    this.currentBackgroundInfo.type = filename ? filename.replace(/\.[^/.]+$/, '') : textureKey;
                    this.currentBackgroundInfo.floorplanPicture = filename || "custom-uploaded-image";
                    
                    // Recalculate zoom based on new image dimensions, following the original create() logic
                    const { width, height } = this.scale;
                    const scaleX = (width * 0.618) / this.floorplanV2Image.width;
                    const scaleY = (height * 0.618) / this.floorplanV2Image.height;
                    this.defaultZoom = Math.min(scaleX, scaleY);
                    
                    // Apply the zoom to camera, not the image object
                    this.cameras.main.setZoom(this.defaultZoom);
                    this.cameras.main.centerOn(0, 0);
                    
                    // Update default camera position for reset functionality
                    this.defaultCameraX = this.cameras.main.scrollX;
                    this.defaultCameraY = this.cameras.main.scrollY;
                }
            });
            
            // Start loading
            this.load.start();
        }
    }

    public getBackgroundInfo(): any {
        return {
            ...this.currentBackgroundInfo,
            width: this.floorplanV2Image?.width || 0,
            height: this.floorplanV2Image?.height || 0
        };
    }

}