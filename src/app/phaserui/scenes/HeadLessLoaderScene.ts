import { UIScene } from "@phaser/UIScene";

export class HeadlessLoaderScene extends Phaser.Scene {
    constructor() {
		super("HeadlessLoaderScene");
	}

    create() {
        this.scene.manager.run("UIScene");

        const uiScene: UIScene= this.scene.manager.getScene("UIScene") as UIScene;
        
        uiScene.load.on("complete", () => { uiScene.start(); });
    }

    preload() {
	}
}
