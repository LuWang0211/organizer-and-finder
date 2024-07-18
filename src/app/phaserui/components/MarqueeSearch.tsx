import { UIScene } from "@phaser/UIScene";
import { debounce, last, sample } from "lodash";


interface MarqueeEntry {
    frameName: string;
    x: number;
    image: Phaser.GameObjects.Image | null;
}

const MIN_MARQUEE_SPEED = -25;
const MAX_MARQUEE_SPEED = -550;
const GAP = 10;

export class MarqueeSearch  {
    private scene: UIScene;

    private frameNames: Array<string> = [];

    private size: Phaser.Structs.Size = new Phaser.Structs.Size;

    private marqueeEntries: MarqueeEntry[] = [];

    // The minimum number of entries that should be in the marquee at any given time
    private minimumNumberOfEntries: number = 10;

    private speed: number = MIN_MARQUEE_SPEED;

    private lastSpeedBoostTime: number = 0;

    constructor(scene: UIScene) {

        this.scene = scene;

        this.create();
    }

    create() {

        const texture = this.scene.textures.get("items");

        this.frameNames = texture.getFrameNames();

        const frame = texture.get(texture.firstFrame);

        this.size = new Phaser.Structs.Size(frame.width, frame.height);

        this.marqueeEntries = this.frameNames.map((frameName, index) => ({
            frameName,
            x: 0 + index * (this.size.width + GAP),
            image: null
        }));

        this.scene.events.on("update", this.update, this);

        this.scene.input.on("pointermove", debounce(this.onPointerMove, 25, { leading: true}), this);

        this.scene.scale.on("resize", this.onResize, this);
    }

    update(time: number, delta: number) {
            let elementsToRemove = 0;        

            // Move the marquee left by the speed
            this.marqueeEntries.forEach((entry) => {
                const { x, frameName } = entry;
                if (entry.image === null) {
                    entry.image = this.scene.add.image(x, 650, "items", frameName);
                }

                entry.image.x += (this.speed * delta / 1000);
                entry.x = entry.image.x;

                if (entry.image.x + (this.size.width / 2) < 0) {
                    entry.image.destroy();
                    entry.image = null;
                    elementsToRemove++;
                }
            });

            // Remove elements that are off screen
            this.marqueeEntries.splice(0, elementsToRemove);

            const numberOfEntriesToAdd = this.minimumNumberOfEntries - this.marqueeEntries.length;

            // Add new elements to the marquee
            this.addRandomItems(numberOfEntriesToAdd);

            // Slow down the marquee if it hasn't been sped up in a while
            if (time - this.lastSpeedBoostTime > 1000) {
                this.speed *= 0.9;
                this.speed = Phaser.Math.Clamp(this.speed, MAX_MARQUEE_SPEED, MIN_MARQUEE_SPEED);
                this.lastSpeedBoostTime = time;
            }
    }

    public addRandomItems(count: number) {
        for (let i = 0; i < count; i++) {
            this.addItem(sample(this.frameNames)!);
        }
    }

    public addItem(frameName: string) {
        this.marqueeEntries.push({
            frameName,
            x: last(this.marqueeEntries)!.x + this.size.width + GAP,
            image: null
        });
    }

    onResize(gameSize: Phaser.Structs.Size) {
        this.minimumNumberOfEntries = Math.max(Math.ceil(gameSize.width / (this.size.width + GAP)) + 1, 3);
    }

    onPointerMove(pointer: Phaser.Input.Pointer) {
        // Speed up the marquee
        this.speed *= 1.5;

        this.speed = Phaser.Math.Clamp(this.speed, MAX_MARQUEE_SPEED, MIN_MARQUEE_SPEED);

        this.lastSpeedBoostTime = this.scene.game.getTime();
    }
}