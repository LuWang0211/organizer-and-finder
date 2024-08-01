import { UIScene } from "@phaser/UIScene";

export class HeadlessLoaderScene extends Phaser.Scene {
    constructor() {
		super("HeadlessLoaderScene");
	}

    create() {
        // Find the second scene and start it
        
        const secondScene = this.scene.manager.scenes[1];

        this.scene.manager.run(secondScene)

        if (secondScene instanceof UIScene) {
            secondScene.load.on("complete", () => { secondScene.start(); });
        }
    }

    preload() {
	}
}
