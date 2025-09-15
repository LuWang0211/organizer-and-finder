import { HouseDef, RoomDef, ViewerMode } from "./common";
import { getHexNumberByName, FloorPlanColor } from "@/ui/colors";

export class FloorplanViewerScene extends Phaser.Scene {
    private floorplanImage?: Phaser.GameObjects.Image;
    private houseDef?: HouseDef;
    private roomDefs: RoomDef[] = [];
    private roomGraphics: Record<string, Phaser.GameObjects.Graphics> = {};
    private isDragging: boolean = false;
    private pinHandler?: (mode: ViewerMode, element?: unknown) => void;
    private lastPointerX: number = 0;
    private lastPointerY: number = 0;
    private currentMode: ViewerMode = ViewerMode.Fullscreen;
    private resizeHandler?: () => void;

    constructor() {
        super("FloorplanViewerScene");
    }

    init(data?: { houseDef: HouseDef, roomDefs: RoomDef[], mode: ViewerMode }) {
        if (data) {
            this.houseDef = data.houseDef;
            this.roomDefs = data.roomDefs || [];
            this.currentMode = data.mode;
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

        // Create background image, centered at world (0,0).
        this.floorplanImage = this.add.image(0, 0, 'floorplan-background');
        this.floorplanImage.setOrigin(0.5, 0.5);

        // Initial fit using current mode (fullscreen or folded).
        // Use animate: false so the very first frame is correctly centered.
        this.resetView(this.currentMode, { animate: false });

        // Add camera controls
        this.setupCameraControls();

        // Draw rooms as polygons (gray fill/stroke)
        this.drawRooms();

        // Listen for pin events from app
        this.pinHandler = (mode: ViewerMode, _element?: unknown) => {
            if (!this.floorplanImage) return;
            this.currentMode = mode;
            this.resetView(mode);
        };
        this.game.events.on('pin', this.pinHandler);

        // Recenter on Phaser scale resize
        this.resizeHandler = () => {
            this.resetView(this.currentMode);
        };
        this.scale.on('resize', this.resizeHandler);

        // Remove listeners on shutdown to prevent leaks
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.pinHandler) {
                this.game.events.off('pin', this.pinHandler);
                this.pinHandler = undefined;
            }
            if (this.resizeHandler) {
                this.scale.off('resize', this.resizeHandler);
                this.resizeHandler = undefined;
            }
        });
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

    // Compute desired zoom and scroll to fit image in a given viewport box
    private computeViewportZoom(params: { fitWidth: number; fitHeight: number; marginFactor?: number; }) {
        if (!this.floorplanImage) return null;
        const { fitWidth, fitHeight, marginFactor = 0.8 } = params;
        const imgW = this.floorplanImage.width;
        const imgH = this.floorplanImage.height;
        const zoom = Math.min((fitWidth * marginFactor) / imgW, (fitHeight * marginFactor) / imgH);
        return { zoom };
    }

    // Public: Center the floorplan based on the given mode.
    // Screen-space model (no speculative algebra):
    // 1) Treat camera width/height as viewport pixels (screen-space); zoom does not change these.
    // 2) To place world(0,0) at a desired screen point S=(x,y) with no scaling, the camera center should move to
    //    C = (cam.width/2 - x, cam.height/2 - y).
    // 3) When zoomed by z, camera coordinates are scaled, so divide the whole center shift by z:
    //    C = ((cam.width/2 - x)/z, (cam.height/2 - y)/z).
    // 4) For mode → pick S: fullscreen S=(cam.width/2, cam.height/2); folded S=(cam.width/4, cam.height/2).
    // 5) Compute target zoom z from the fit (~80% of available width/height; folded uses width/2) and pan to C.
    resetView(mode: ViewerMode = ViewerMode.Fullscreen, opts?: { animate?: boolean; duration?: number; ease?: string }) {
        const cam = this.cameras.main;
        const gameW = this.scale.width;
        const gameH = this.scale.height;
        const fitWidth = (mode === ViewerMode.Folded) ? gameW / 2 : gameW;
        const fitHeight = gameH;
        const fit = this.computeViewportZoom({ fitWidth, fitHeight });
        if (!fit) return;

        const animate = opts?.animate ?? true;
        const duration = opts?.duration ?? 300;
        const ease = opts?.ease ?? 'Sine.easeOut';

        // Desired on-screen pixel for world (0,0): center (fullscreen) or left-half center (folded)
        const targetScreenX = (mode === ViewerMode.Folded) ? gameW / 4 : gameW / 2;
        const targetScreenY = gameH / 2;

        const targetZoom = fit.zoom;
        // Why divide by zoom here (not multiply):
        // - We compute a screen-space center shift Δs = (cam.width/2 - targetScreenX, cam.height/2 - targetScreenY).
        // - Zoom is applied after pan, so Δscreen = Δcamera × zoom.
        // - To get the camera-space shift, divide by zoom: Δcamera = Δs / zoom.
        // - Thus the camera center to pan to is:
        const worldCenterX = (cam.width / 2 - targetScreenX) / targetZoom;
        const worldCenterY = (cam.height / 2 - targetScreenY) / targetZoom;

        if (animate) {
            cam.zoomTo(targetZoom, duration, ease, true);
            cam.pan(worldCenterX, worldCenterY, duration, ease, true);
        } else {
            cam.setZoom(targetZoom);
            cam.centerOn(worldCenterX, worldCenterY);
        }
    }

    // (All debug overlay and crosshair helpers removed for production cleanliness)

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

            // Notify app for navigation on click
            g.on('pointerdown', () => {
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
