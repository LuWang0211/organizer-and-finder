// You can write more code here

import { DecoBackground1 } from "@/app/search/components/DecoBackground1";
import { createLetterFall } from "@/app/search/components/Letterfall";
import { MarqueeSearch } from "@/app/search/components/MarqueeSearch";
import { SketchBackground } from "@/app/search/components/SketchBackground";
import type { ItemType } from "@/services/itemService";

export const EVENT_LETTER_FALL = "EVT_LETTER_FALL";

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

    const letterFallHandler = (text: string) => this.letterFall(text);

    this.game.events.on(EVENT_LETTER_FALL, letterFallHandler);

    // Register the cleanup handler for scene shutdown
    this.events.once(
      "shutdown",
      () => {
        this.game.events.off(EVENT_LETTER_FALL, letterFallHandler);
      },
      this,
    );
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

    this.deco1 = deco1;

    this.events.emit("scene-awake");
  }

  private deco1!: Phaser.GameObjects.NineSlice;

  letterFall(text: string) {
    createLetterFall(this, text);
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
