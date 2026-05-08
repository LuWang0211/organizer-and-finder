// You can write more code here
import { DecoBackground1 } from "@/app/search/components/DecoBackground1";
import { MarqueeSearch } from "@/app/search/components/MarqueeSearch";
import { SketchBackground } from "@/app/search/components/SketchBackground";
import { createLetterFall } from "@/app/search/Letterfall";

interface Item {
  id: number;
  name: string;
  iconKey?: string | null;
  locationName?: string | null;
}

/** Fetch items from API (client-side) */
async function fetchItemsFromAPI(): Promise<Item[]> {
  try {
    const response = await fetch("/api/items");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const items = await response.json();
    return items;
  } catch (error) {
    return [];
  }
}

export /* START OF COMPILED CODE */

class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  editorCreate(): void {
    // InputBoxBg
    const inputBoxBg = this.add.nineslice(
      0,
      0,
      "search_bar",
      undefined,
      596,
      0,
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
      0,
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

  /* START-USER-CODE */

  // Write your code here

  create() {
    this.start();
  }

  public start() {
    new SketchBackground(this);

    this.editorCreate();

    new DecoBackground1(this, this.deco1);

    const marqueeSearch = new MarqueeSearch(this);

    // Try to fetch real items from API and update marquee
    // Continue with default items if fetch fails (e.g., no database connection)
    fetchItemsFromAPI()
      .then((items: Item[]) => {
        if (items && items.length > 0) {
          marqueeSearch.updateItems(items);
        }
      })
      .catch(() => undefined);

    const inputText = this.add
      .rexInputText(0, -12, 200, 20, {
        text: "hello wawa",
        fontSize: "24px",
        color: "#000000",
        align: "center",
      })
      .on("textchange", (inputText: { text: string }) => {
        createLetterFall(this, inputText.text);
      });

    const sizer = this.rexUI.add.overlapSizer({
      x: 0,
      y: 0,
      height: 117,
      anchor: {
        top: "top+50",
        centerX: "center",
        width: "90%",
      },
    });

    this.inputBoxBg.depth = 1;

    sizer.add(this.inputBoxBg, {
      minWidth: 30,
      minHeight: 5.8,
      align: "center",
      key: "inputBoxBg",
      expand: { width: true },
      aspectRatio: 0,
    });

    sizer.add(inputText, {
      minWidth: 30,
      minHeight: 5.8,
      align: "center-center",
      key: "input",
      expand: { width: true },
      padding: { left: 65, right: 115, bottom: 25 },
      aspectRatio: 0,
    });

    sizer.layout();
  }

  preload() {
    this.load.pack("all", "assets/asset-pack.json");

    // Load individual household item icons for marquee
    const icons = [
      "icon-book.png",
      "icon-bookshelf.png",
      "icon-glasses.png",
      "icon-laptop.png",
      "icon-mug.png",
      "icon-nightstand.png",
      "icon-pajamas.png",
      "icon-remote.png",
    ];

    icons.forEach((icon) => {
      this.load.image(icon, `/icons/household_items/${icon}`);
    });

    // Load scrollframe for icon backgrounds
    this.load.image("scrollframe.png", "/textures/scrollframe.png");
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
