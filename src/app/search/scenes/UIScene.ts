// You can write more code here

import { HTMLInputText, OverlapSizer } from "@phaser/utils";
import { DecoBackground1 } from "@/app/search/components/DecoBackground1";
import { createLetterFall } from "@/app/search/components/Letterfall";
import { MarqueeSearch } from "@/app/search/components/MarqueeSearch";
import { SketchBackground } from "@/app/search/components/SketchBackground";
import type { ItemType } from "@/services/itemService";

/* START OF COMPILED CODE */

export class UIScene extends Phaser.Scene {
  private marqueeSearch?: MarqueeSearch;
  private pendingMarqueeItems: ItemType[] | null = null;

  constructor() {
    super("UIScene");

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  init() {
    const initialItems = this.game.registry.get("initialData")?.initialItems;

    if (initialItems) {
      this.setMarqueeItems(initialItems);
    }
  }

  start() {
    new SketchBackground(this);

    this.editorCreate();

    new DecoBackground1(this, this.deco1);

    this.marqueeSearch = new MarqueeSearch(this);
    if (this.pendingMarqueeItems && this.pendingMarqueeItems.length > 0) {
      this.marqueeSearch.updateItems(this.pendingMarqueeItems);
      this.pendingMarqueeItems = null;
    }

    const inputText = new HTMLInputText(this, {
      width: 200,
      height: 20,
      text: "hello wawa",
      fontSize: "24px",
      color: "#000000",
      align: "center",
    }).onTextChange((inputText: HTMLInputText) => {
      createLetterFall(this, inputText.text);
    });

    const sizer = new OverlapSizer(this, {
      top: 50,
      centerX: true,
      width: { value: 90, type: "percent" },
      height: 117,
    });

    // Add inputBoxBg to sizer
    sizer.addChild(this.inputBoxBg, {
      minWidth: 1613.8,
      minHeight: 117,
      align: "center-center",
      expand: { width: true },
    });

    sizer.addChild(inputText, {
      minWidth: 30,
      minHeight: 5.8,
      align: "center-center",
      expand: { width: true, height: true },
      padding: { left: 65, right: 115, bottom: 15 },
    });

    sizer.layout();
  }

  public setMarqueeItems(items: ItemType[]) {
    this.pendingMarqueeItems = items;
  }

  preload() {
    this.load.pack("all", "/assets/asset-pack.json");
    this.load.atlas(
      "items",
      "/assets/texture/items.png",
      "/assets/texture/items.json",
    );

    const icons = [
      "icon-book.png",
      "icon-bookshelf.png",
      "icon-glasses.png",
      "icon-laptop.png",
      "icon-mug.png",
      "icon-nightstand.png",
      "icon-pajamas.png",
      "icon-remote.png",
      "icon-unknown.png",
    ];

    icons.forEach((icon) => {
      this.load.image(icon, `/icons/household_items/${icon}`);
    });

    // Load scrollframe for icon backgrounds
    this.load.image("scrollframe.png", "/textures/scrollframe.png");
  }

  editorCreate(): void {
    // InputBoxBg
    const inputBoxBg = this.add.nineslice(
      0,
      0,
      "search_bar",
      undefined,
      596,
      6,
      72,
      111,
      0,
      0,
    );

    // deco1
    const deco1 = this.add.nineslice(
      0,
      0,
      "Decoration1",
      undefined,
      1379,
      308,
      736,
      559,
      0,
      0,
    );
    deco1.alpha = 0;

    this.inputBoxBg = inputBoxBg;
    this.deco1 = deco1;

    this.events.emit("scene-awake");
  }

  private inputBoxBg!: Phaser.GameObjects.NineSlice;
  private deco1!: Phaser.GameObjects.NineSlice;

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
