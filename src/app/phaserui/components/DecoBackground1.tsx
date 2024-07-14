import { UIScene } from "@phaser/UIScene";

export class DecoBackground1 {

    private scene: UIScene;
    private deco1: Phaser.GameObjects.NineSlice;

    constructor(scene: UIScene, deco1: Phaser.GameObjects.NineSlice) {
        this.scene = scene;
        this.deco1 = deco1;

        this.create();
    }

    create() {
        const viewportWidth = this.scene.scale.width;

        if (viewportWidth > 800) {
            this.createBackgroundForDesktop();
        }
    }

    createBackgroundForDesktop() {
        // Add decroative elements
        const sizer = this.scene.rexUI.add.overlapSizer({
            x: 0,
            y: 0,
            anchor: {
                top: `top+${768 / 2 - this.deco1.height / 2}`,
                centerX: 'center',
                width: '100%',
            },
        })

        sizer.add(this.deco1, {
            minWidth: this.deco1.width,
            minHeight: this.deco1.height,
            align: 'center',
            key: 'deco1',
            expand: { width: true},
            aspectRatio: 0
        });

        sizer.layout();
    }
}
 