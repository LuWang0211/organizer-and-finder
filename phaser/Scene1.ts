
// You can write more code here

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

		this.wawa = wawa;

		this.events.emit("scene-awake");
	}

	private wawa!: Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body };

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		this.wawa.body.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
	}

	preload() {
		this.load.pack("all", "assets/asset-pack.json");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
