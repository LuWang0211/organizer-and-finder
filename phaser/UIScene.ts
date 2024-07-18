
// You can write more code here
import { DecoBackground1 } from "@/app/phaserui/components/DecoBackground1";
import { MarqueeSearch } from "@/app/phaserui/components/MarqueeSearch";
import { SketchBackground } from "@/app/phaserui/components/SketchBackground";
import { createLetterFall } from "@/app/phaserui/letterfall";

export
/* START OF COMPILED CODE */

class UIScene extends Phaser.Scene {

	constructor() {
		super("Scene1");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// InputBoxBg
		const inputBoxBg = this.add.nineslice(0, 0, "search_bar", undefined, 596, 0, 72, 111, 0, 0);

		// deco1
		const deco1 = this.add.nineslice(0, 0, "Decoration1", undefined, 1379, 0, 736, 559, 0, 0);
		deco1.alpha = 0;

		this.inputBoxBg = inputBoxBg;
		this.deco1 = deco1;

		this.events.emit("scene-awake");
	}

	private inputBoxBg!: Phaser.GameObjects.NineSlice;
	private deco1!: Phaser.GameObjects.NineSlice;

	/* START-USER-CODE */

	// Write your code here

	create() {

		new SketchBackground(this);

		this.editorCreate();

		new DecoBackground1(this, this.deco1);

		new MarqueeSearch(this);

		const inputText = this.add.rexInputText(0, -12, 200, 20, {
			text: 'hello wawa',
			fontSize: '24px',
			color: '#000000',
			align: 'center',
		}).on('textchange', (inputText: {text: string} ) => {
			createLetterFall(this, inputText.text)
		});;


		const sizer = this.rexUI.add.overlapSizer({
			x: 0,
			y: 0,
			height : 117,
			anchor: {
				top: 'top+50',
				centerX: 'center',
				width: '90%',
			},

		})

		this.inputBoxBg.depth = 1;

		sizer.add(this.inputBoxBg, {
			minWidth: 30,
			minHeight: 5.8,
			align: 'center',
			key: 'inputBoxBg',
			expand: { width: true},
			aspectRatio: 0
		});

		sizer.add(inputText, {
			minWidth: 30,
			minHeight: 5.8,
			align: 'center-center',
			key: 'input',
			expand: { width: true},
			padding: { left: 65, right: 115, bottom: 25},
			aspectRatio: 0
		})

		sizer.layout()
	}

	preload() {
		this.load.pack("all", "assets/asset-pack.json");
		this.load.atlas("items", "assets/texture/items.png", "assets/texture/items.json");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
