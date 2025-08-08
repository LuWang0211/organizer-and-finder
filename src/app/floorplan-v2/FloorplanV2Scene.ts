import { StagingRectangle, EdgeType, SnapPoint } from "./StagingRectangle";

export class FloorplanV2Scene extends Phaser.Scene {
    private floorplanV2Image?: Phaser.GameObjects.Image;
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
    private selectedRectangle?: StagingRectangle;
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
        this.events.on('toggleSnapping', this.toggleSnapping, this);
        
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
        const centerX = (point1.x + point2.x) / 2;
        const centerY = (point1.y + point2.y) / 2;

        const stagingRectangle = new StagingRectangle(this, centerX, centerY, width, height);

        this.stagingRectangles.push(stagingRectangle);
    }

    selectRectangle(rectangle: StagingRectangle): void {
        if (this.selectedRectangle) {
            this.selectedRectangle.setSelected(false);
        }

        this.selectedRectangle = rectangle;
        rectangle.setSelected(true);

        this.events.emit('rectangleSelected', rectangle);
    }

    clearSelection(): void {
        if (this.selectedRectangle) {
            this.selectedRectangle.setSelected(false);
            this.selectedRectangle = undefined;
            this.events.emit('rectangleSelected', null);
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
}