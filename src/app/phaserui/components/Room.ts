import { getRectangleEdges } from "@/utils/geometry";
import { noop, throttle } from "lodash";

type Rect = Phaser.GameObjects.Rectangle;

export class Room {
    private scene: Phaser.Scene;

    private _onResize?: () => void;
    protected _type: string = "room";

    constructor(scene: Phaser.Scene, color: number = 0x6666ff, onResize?: () => void) {
        this.scene = scene;
        this._onResize = throttle(onResize || noop, 100);

        this.create(color);
    }

    private edges!: { top: Rect; right: Rect; bottom: Rect; left: Rect; };
    private rect!: Rect;

    public get lines() {
       return getRectangleEdges(this.rect.getBounds());
    }

    public get type() {
        return this._type;
    }

    /**
     * Create a rectangle with draggable edges
     * 
     * @param color 
     */
    create(color: number) {
        this.rect = this.scene.add.rectangle(0, 0, 100, 100, color);
        this.rect.setOrigin(0, 0);

        this.createEdges()

        this.scene.input.setDraggable(this.rect.setInteractive({
            cursor: "move"
        }));
        
        this.scene.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) =>
            {
                const rect = this.rect;

                dragX = Phaser.Math.Snap.To(dragX, 50);
                dragY = Phaser.Math.Snap.To(dragY, 50);


                if (gameObject === rect) {
                     this.updateRectangle(rect, dragX, dragY, rect.width, rect.height);
                }else if (gameObject === this.edges!.top) {
                    this.resizeFromTop(rect, dragX, dragY);
                } else if (gameObject === this.edges!.right) {
                    this.resizeFromRight(rect, dragX, dragY);
                } else if (gameObject === this.edges!.bottom) {
                    this.resizeFromBottom(rect, dragX, dragY);
                } else if (gameObject === this.edges!.left) {
                    this.resizeFromLeft(rect, dragX, dragY);
                }

            });
        
        this.scene.input.on('pointermove', throttle(this.onMoveOutOfEdge, 50), this);


        for (const edge of Object.values(this.edges)) {
            edge.on('pointermove', this.onHoverEdge, this);
        }
    }

    /**
     * Show edges when hovering over them
     *  
     */
    onHoverEdge() {
        const edges = Object.values(this.edges);
        for (const edge of edges) {
            edge.alpha = 1;
        }
    }

    /**
     * Hide edges when pointer is out of bounds
     * 
     * @param pointer
     */
    onMoveOutOfEdge(pointer: Phaser.Input.Pointer) {
        const  { x, y} = pointer.position;
        const edges = Object.values(this.edges);
        const isWithinRects = edges.some(edge => edge.getBounds().contains(x, y));

        if (!isWithinRects) {
            for (const edge of edges) {
                edge.alpha = 0.001;
            }
        }
    }


    createEdges() {
        const rectBounds = this.rect.getBounds();

        // Create transparent edges for dragging
        this.edges = {
            top: this.createEdge(rectBounds.left, rectBounds.top - 5, rectBounds.width, 10, "row-resize"),
            right: this.createEdge(rectBounds.right - 5, rectBounds.top, 10, rectBounds.height, "col-resize"),
            bottom: this.createEdge(rectBounds.left, rectBounds.bottom - 5, rectBounds.width, 10, "row-resize"),
            left: this.createEdge(rectBounds.left - 5, rectBounds.top, 10, rectBounds.height, "col-resize"),
        };
    }

    createEdge(x: number, y: number, width: number, height: number, cursor: string) {
        const edge = this.scene.add.rectangle(x + width / 2, y + height / 2, width, height, 0xff0000, 0.5);
        edge.setInteractive({ draggable: true, cursor }).depth = 50;
        return edge;
    }

    updateRectangle(rect: Phaser.GameObjects.Rectangle, x: number, y: number, width: number, height: number) {
        // Ensure minimum size
        const minWidth = 20;
        const minHeight = 20;
        width = Math.max(minWidth, width);
        height = Math.max(minHeight, height);

        // Update the rectangle position and size
        rect.setSize(width, height);
        rect.setPosition(x, y);

        // Update handles positions
        const rectBounds = rect.getBounds();
        this.updateEdge(this.edges!.top, (rectBounds.left + rectBounds.right) / 2, rectBounds.top - 5, rectBounds.width, 10);
        this.updateEdge(this.edges!.right, rectBounds.right + 5, (rectBounds.top + rectBounds.bottom) / 2, 10, rectBounds.height);
        this.updateEdge(this.edges!.bottom, (rectBounds.left + rectBounds.right) / 2, rectBounds.bottom + 5, rectBounds.width, 10);
        this.updateEdge(this.edges!.left, rectBounds.left - 5, (rectBounds.top + rectBounds.bottom) / 2, 10, rectBounds.height);

        this._onResize?.();
    }

    updateEdge(edge: Phaser.GameObjects.Rectangle, x: number, y: number, width: number, height: number) {
        edge.setPosition(x, y).setSize(width, height);
    }


    resizeFromTop(rect: Phaser.GameObjects.Rectangle, dragX: number, dragY: number) {
        const rectBounds = rect.getBounds();
        const newHeight = rectBounds.bottom - dragY;
        this.updateRectangle(rect, rectBounds.left, dragY, rectBounds.width, newHeight);
    }

    resizeFromRight(rect: Phaser.GameObjects.Rectangle, dragX: number, dragY: number) {
        const rectBounds = rect.getBounds();
        const newWidth = dragX - rectBounds.left;
        this.updateRectangle(rect, rectBounds.left, rectBounds.top, newWidth, rectBounds.height);
    }

    resizeFromBottom(rect: Phaser.GameObjects.Rectangle, dragX: number, dragY: number) {
        const rectBounds = rect.getBounds();
        const newHeight = dragY - rectBounds.top;
        this.updateRectangle(rect, rectBounds.left, rectBounds.top, rectBounds.width, newHeight);
    }

    resizeFromLeft(rect: Phaser.GameObjects.Rectangle, dragX: number, dragY: number) {
        const rectBounds = rect.getBounds();
        const newWidth = rectBounds.right - dragX;
        this.updateRectangle(rect, dragX, rectBounds.top, newWidth, rectBounds.height);
    }

    /**
     * Serialize the room to a JSON object for saving the state of the room
     */ 
    serialize() {
        const bounds = this.rect.getBounds();
        return {
            type: this.type,
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height
        };
    }
}

export class Hallway extends Room {

    constructor(scene: Phaser.Scene, onResize?: () => void) {
        super(scene, 0xFFFFFF, onResize);
        this._type = "hallway";
    }
}
