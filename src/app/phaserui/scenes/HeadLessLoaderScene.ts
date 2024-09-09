
import Phaser from "phaser";
export class HeadlessLoaderScene extends Phaser.Scene {
    constructor() {
		super("HeadlessLoaderScene");
	}

    create() {
        // Find the second scene and start it
        const secondScene = this.scene.manager.scenes[1];

        secondScene.load.on("complete", () => { 
            (secondScene as any).start?.(); 
        });

        this.scene.manager.run(secondScene);
    }

    preload() {
	}
}
