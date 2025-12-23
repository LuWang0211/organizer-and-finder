import { type FloorPlanColor, getHexNumberByName } from "@/ui/colors";
import { type HouseDef, type RoomDef, ViewerMode } from "./common";

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

  private initialSelectedRoomId?: string;

  init(data?: {
    houseDef: HouseDef;
    roomDefs: RoomDef[];
    mode: ViewerMode;
    selectedRoomId?: string;
  }) {
    if (data) {
      this.houseDef = data.houseDef;
      this.roomDefs = data.roomDefs || [];
      this.currentMode = data.mode;
      this.initialSelectedRoomId = data.selectedRoomId;
    }
  }

  preload() {
    if (this.houseDef?.floorplanPicture) {
      this.load.image("floorplan-background", this.houseDef.floorplanPicture);
    }
  }

  create() {
    if (!this.houseDef) {
      return;
    }

    // Create background image, centered at world (0,0).
    this.floorplanImage = this.add.image(0, 0, "floorplan-background");
    this.floorplanImage.setOrigin(0.5, 0.5);

    // Initial fit using current mode (fullscreen or folded).
    // If selectedRoomId was provided, zoom to that room immediately.
    this.resetView(this.currentMode, {
      animate: false,
      roomId: this.initialSelectedRoomId,
    });

    // Add camera controls
    this.setupCameraControls();

    // Draw rooms as polygons (gray fill/stroke)
    this.drawRooms();

    // Listen for pin events from app: pin(mode, element?)
    // - If a room id is provided as element, zoom and center to that room
    // - Otherwise, center the whole floorplan based on mode
    this.pinHandler = (mode: ViewerMode, element?: unknown) => {
      if (!this.floorplanImage) return;
      this.currentMode = mode;
      this.resetView(mode, {
        roomId: typeof element === "string" ? element : undefined,
      });
    };
    this.game.events.on("pin", this.pinHandler);

    // Recenter on Phaser scale resize
    this.resizeHandler = () => {
      this.resetView(this.currentMode);
    };
    this.scale.on("resize", this.resizeHandler);

    // Remove listeners on shutdown to prevent leaks
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.pinHandler) {
        this.game.events.off("pin", this.pinHandler);
        this.pinHandler = undefined;
      }
      if (this.resizeHandler) {
        this.scale.off("resize", this.resizeHandler);
        this.resizeHandler = undefined;
      }
    });
  }

  private setupCameraControls() {
    // Mouse/touch dragging
    this.input.on("pointerdown", (pointer: any) => {
      this.isDragging = true;
      this.lastPointerX = pointer.x;
      this.lastPointerY = pointer.y;
    });

    this.input.on("pointermove", (pointer: any) => {
      if (this.isDragging) {
        const deltaX = pointer.x - this.lastPointerX;
        const deltaY = pointer.y - this.lastPointerY;

        this.cameras.main.scrollX -= deltaX / this.cameras.main.zoom;
        this.cameras.main.scrollY -= deltaY / this.cameras.main.zoom;

        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;
      }
    });

    this.input.on("pointerup", () => {
      this.isDragging = false;
    });

    this.input.on("pointerupoutside", () => {
      this.isDragging = false;
    });

    this.input.on(Phaser.Input.Events.GAME_OUT, () => {
      this.isDragging = false;
    });

    // Mouse wheel zoom
    this.input.on(
      "wheel",
      (pointer: any, gameObjects: any[], deltaX: number, deltaY: number) => {
        const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Phaser.Math.Clamp(
          this.cameras.main.zoom * zoomFactor,
          0.1,
          3,
        );

        this.cameras.main.setZoom(newZoom);
      },
    );
  }

  // Compute the zoom level to fit a content box (contentWidth x contentHeight)
  // into a viewport box (fitWidth x fitHeight) with an optional margin factor.
  private computeFitZoom(
    fitWidth: number,
    fitHeight: number,
    contentWidth: number,
    contentHeight: number,
    marginFactor: number = 0.8,
  ): number {
    return Math.min(
      (fitWidth * marginFactor) / contentWidth,
      (fitHeight * marginFactor) / contentHeight,
    );
  }

  // Center the floorplan based on the given mode (or a specific room if provided).
  // 1) Treat camera width/height as viewport pixels (screen-space); zoom does not change these.
  // 2) To place world(0,0) at a desired screen point S=(x,y) with no scaling, the camera center should move to
  //    C = (cam.width/2 - x, cam.height/2 - y).
  // 3) When zoomed by z, camera coordinates are scaled, so divide the whole center shift by z:
  //    C = ((cam.width/2 - x)/z, (cam.height/2 - y)/z).
  // 4) For mode → pick S: fullscreen S=(cam.width/2, cam.height/2); folded S=(cam.width/4, cam.height/2).
  // 5) Compute target zoom z from the fit (~80% of available width/height; folded uses width/2) and pan to C.
  resetView(
    mode: ViewerMode = ViewerMode.Fullscreen,
    opts?: {
      animate?: boolean;
      duration?: number;
      ease?: string;
      roomId?: string;
    },
  ) {
    const cam = this.cameras.main;
    const gameW = this.scale.width;
    const gameH = this.scale.height;
    const fitWidth = mode === ViewerMode.Folded ? gameW / 2 : gameW;
    const fitHeight = gameH;
    const room = opts?.roomId
      ? this.roomDefs.find((r) => r.id === opts.roomId)
      : undefined;

    const animate = opts?.animate ?? true;
    const duration = opts?.duration ?? 300;
    const ease = opts?.ease ?? "Sine.easeOut";

    // Desired on-screen pixel S where the anchor should appear
    const targetScreenX = mode === ViewerMode.Folded ? gameW / 4 : gameW / 2;
    const targetScreenY = gameH / 2;

    // Unified flow: compute anchor (room center or world origin) and target zoom
    let anchorX = 0;
    let anchorY = 0;
    let targetZoom: number;
    if (room) {
      const { centerX, centerY, boxW, boxH } = this.getRoomBox(room);
      // Anchor is the room center in world space (unscaled)
      anchorX = centerX;
      anchorY = centerY;
      targetZoom = this.computeFitZoom(fitWidth, fitHeight, boxW, boxH, 0.8);
    } else {
      if (!this.floorplanImage) return;
      targetZoom = this.computeFitZoom(
        fitWidth,
        fitHeight,
        this.floorplanImage.width,
        this.floorplanImage.height,
        0.8,
      );
    }

    // Camera-space shift from desired screen center (divide whole delta by zoom)
    // Δscreen = (cam.width/2 - Sx, cam.height/2 - Sy)
    // Δcamera = Δscreen / zoom (convert to the same space as anchor)
    const dxCamera = (cam.width / 2 - targetScreenX) / targetZoom;
    const dyCamera = (cam.height / 2 - targetScreenY) / targetZoom;
    // Pan target is the world center used by pan/centerOn:
    // C = anchor (world) + Δcamera (world). Do NOT scale anchor by zoom.
    const panX = anchorX + dxCamera;
    const panY = anchorY + dyCamera;

    if (animate) {
      cam.zoomTo(targetZoom, duration, ease, true);
      cam.pan(panX, panY, duration, ease, true);
    } else {
      cam.setZoom(targetZoom);
      cam.centerOn(panX, panY);
    }
  }

  private drawRooms() {
    // Clear existing graphics if redrawing
    Object.values(this.roomGraphics).forEach((g) => g.destroy());
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
        g.fillPoints(
          room.vertices as unknown as Phaser.Types.Math.Vector2Like[],
          true,
        );
        g.strokePoints(
          room.vertices as unknown as Phaser.Types.Math.Vector2Like[],
          true,
        );
      };

      render(false);

      // Make the polygon interactive for potential future interactions
      const phaserPoints = room.vertices.map(
        (v) => new Phaser.Geom.Point(v.x, v.y),
      );
      const poly = new Phaser.Geom.Polygon(phaserPoints);
      g.setInteractive(poly, Phaser.Geom.Polygon.Contains);

      // Notify app for navigation; React will emit a pin event with the selected room
      g.on("pointerdown", () => {
        this.game.events.emit("roomClicked", room.id);
      });

      // Hover effects: highlight and pointer cursor
      g.on("pointerover", () => {
        this.input.setDefaultCursor("pointer");
        g.setDepth(10);
        render(true);
      });
      g.on("pointerout", () => {
        this.input.setDefaultCursor("default");
        g.setDepth(0);
        render(false);
      });

      this.roomGraphics[room.id] = g;
    }
  }

  private getRoomBox(room: RoomDef) {
    // Prefer querying the Phaser Graphics bounds so we match the actual rendered shape
    // (including any stroke width or transforms). Fallback to vertex AABB if needed.
    const g = this.roomGraphics[room.id];
    if (g) {
      const b = Phaser.Display.Bounds.GetBounds(g) as Phaser.Geom.Rectangle;
      // Phaser.Geom.Rectangle has x, y, width, height, centerX, centerY
      const boxW = Math.max(1, b.width);
      const boxH = Math.max(1, b.height);
      if (isFinite(boxW) && isFinite(boxH) && boxW > 0 && boxH > 0) {
        const centerX = b.centerX;
        const centerY = b.centerY;
        return { boxW, boxH, centerX, centerY };
      }
    }

    // Fallback: compute AABB from room vertices
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const v of room.vertices as any[]) {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.y < minY) minY = v.y;
      if (v.y > maxY) maxY = v.y;
    }
    const boxW = Math.max(1, maxX - minX);
    const boxH = Math.max(1, maxY - minY);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return { boxW, boxH, centerX, centerY };
  }
}
