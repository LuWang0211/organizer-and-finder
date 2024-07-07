
// You can write more code here

import { createLetterFall } from "@/app/phaserui/letterfall";
import AnchorPlugin from "phaser3-rex-plugins/plugins/anchor-plugin";

export
	/* START OF COMPILED CODE */

class Scene1 extends Phaser.Scene {

	constructor() {
		super("Scene1");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// wawa
		const wawa = this.add.image(606, 187, "wawa") as Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body };
		wawa.name = "wawa";
		this.physics.add.existing(wawa, false);
		wawa.body.bounce.x = 1;
		wawa.body.bounce.y = 1;
		wawa.body.allowGravity = false;
		wawa.body.allowDrag = false;
		wawa.body.allowRotation = false;
		wawa.body.collideWorldBounds = true;
		wawa.body.setSize(352, 352, false);

		// InputBoxContainer
		const inputBoxContainer = this.add.container(0, 0);

		// image_1
		const image_1 = this.add.image(0, 0, "search_bar");
		inputBoxContainer.add(image_1);

		this.wawa = wawa;
		this.inputBoxContainer = inputBoxContainer;

		this.events.emit("scene-awake");
	}

	private wawa!: Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body };
	private inputBoxContainer!: Phaser.GameObjects.Container;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		const inputText = this.add.rexInputText(0, -12, 200, 20, {
			text: 'hello wawa',
			fontSize: '24px',
			color: '#000000',
		}).on('textchange', (inputText: {text: string} ) => {
			createLetterFall(this, inputText.text)
		});;

		// Anchor positioning
		(this.plugins.get('rexAnchor') as AnchorPlugin).add(this.inputBoxContainer, {
			top: 'top+100',
			centerX: 'center',
		});


		this.inputBoxContainer.add(inputText);


		this.wawa.body.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));

	}

	preload() {
		this.load.pack("all", "assets/asset-pack.json");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
