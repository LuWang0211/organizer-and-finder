import { HouseDef, RoomDef } from "./common";
import { getHexNumberByName, FloorPlanColor } from "@/ui/colors";

export class FloorplanViewerScene extends Phaser.Scene {
    private floorplanImage?: Phaser.GameObjects.Image;
    private houseDef?: HouseDef;
    private roomDefs: RoomDef[] = [];
    private roomGraphics: Record<string, Phaser.GameObjects.Graphics> = {};
    private defaultZoom: number = 1;
    private defaultCameraX: number = 0;
    private defaultCameraY: number = 0;
    private isDragging: boolean = false;
    private lastPointerX: number = 0;
    private lastPointerY: number = 0;

    constructor() {
        super("FloorplanViewerScene");
    }

    init(data?: { houseDef: HouseDef, roomDefs: RoomDef[] }) {
        if (data) {
            this.houseDef = data.houseDef;
            this.roomDefs = data.roomDefs || [];
        }
        
    }

    preload() {
        if (this.houseDef?.floorplanPicture) {
            this.load.image('floorplan-background', this.houseDef.floorplanPicture);
        }
    }

    create() {
        if (!this.houseDef) {
            return;
        }

        const { width, height } = this.scale;
        
        // Create background image
        this.floorplanImage = this.add.image(0, 0, 'floorplan-background');
        this.floorplanImage.setOrigin(0.5, 0.5);
        
        // Calculate zoom to fit image nicely in view
        const scaleX = (width * 0.8) / this.floorplanImage.width;
        const scaleY = (height * 0.8) / this.floorplanImage.height;
        this.defaultZoom = Math.min(scaleX, scaleY);
        
        this.cameras.main.setZoom(this.defaultZoom);
        this.cameras.main.centerOn(0, 0);
        
        this.defaultCameraX = this.cameras.main.scrollX;
        this.defaultCameraY = this.cameras.main.scrollY;

        // Add camera controls
        this.setupCameraControls();

        // Draw rooms as polygons (gray fill/stroke)
        this.drawRooms();
    }

    private setupCameraControls() {
        // Mouse/touch dragging
        this.input.on('pointerdown', (pointer: any) => {
            this.isDragging = true;
            this.lastPointerX = pointer.x;
            this.lastPointerY = pointer.y;
        });

        this.input.on('pointermove', (pointer: any) => {
            if (this.isDragging) {
                const deltaX = pointer.x - this.lastPointerX;
                const deltaY = pointer.y - this.lastPointerY;
                
                this.cameras.main.scrollX -= deltaX / this.cameras.main.zoom;
                this.cameras.main.scrollY -= deltaY / this.cameras.main.zoom;
                
                this.lastPointerX = pointer.x;
                this.lastPointerY = pointer.y;
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        // Mouse wheel zoom
        this.input.on('wheel', (pointer: any, gameObjects: any[], deltaX: number, deltaY: number) => {
            const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom * zoomFactor, 0.1, 3);
            
            this.cameras.main.setZoom(newZoom);
        });
    }

    resetView() {
        this.cameras.main.setZoom(this.defaultZoom);
        this.cameras.main.setScroll(this.defaultCameraX, this.defaultCameraY);
    }

    private drawRooms() {
        // Clear existing graphics if redrawing
        Object.values(this.roomGraphics).forEach(g => g.destroy());
        this.roomGraphics = {};

        for (const room of this.roomDefs) {
            if (!room.vertices || room.vertices.length < 3) continue;

            const g = this.add.graphics();

            // Determine color from room metadata (Tailwind-like name) or default gray
            const colorName = (room.color || "gray-500") as FloorPlanColor as any;
            const hexNumber = getHexNumberByName(colorName);

            // Helper to render with optional highlight
            const render = (highlight: boolean) => {
                g.clear();
                g.fillStyle(hexNumber, highlight ? 0.35 : 0.2);
                g.lineStyle(highlight ? 3 : 2, hexNumber, 1);
                g.fillPoints(room.vertices as unknown as Phaser.Types.Math.Vector2Like[], true);
                g.strokePoints(room.vertices as unknown as Phaser.Types.Math.Vector2Like[], true);
            };

            render(false);

            // Make the polygon interactive for potential future interactions
            const phaserPoints = room.vertices.map(v => new Phaser.Geom.Point(v.x, v.y));
            const poly = new Phaser.Geom.Polygon(phaserPoints);
            g.setInteractive(poly, Phaser.Geom.Polygon.Contains);

            // Log interactivity on click and notify app for navigation
            g.on('pointerdown', () => {
                // eslint-disable-next-line no-console
                this.game.events.emit('roomClicked', room.id);
            });

            // Hover effects: highlight and pointer cursor
            g.on('pointerover', () => {
                this.input.setDefaultCursor('pointer');
                g.setDepth(10);
                render(true);
            });
            g.on('pointerout', () => {
                this.input.setDefaultCursor('default');
                g.setDepth(0);
                render(false);
            });

            this.roomGraphics[room.id] = g;
        }
    }
}
