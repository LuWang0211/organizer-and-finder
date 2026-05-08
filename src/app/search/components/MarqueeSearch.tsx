import type { UIScene } from "@phaser/SearchUIScene";
import { debounce, last, sample } from "lodash";

export interface MarqueeItem {
  textureKey: string;
  label: string;
  locationName?: string | null;
}

interface MarqueeEntry {
  textureKey: string;
  label: string;
  locationName: string | null;
  x: number;
  width: number;
  height: number;
  scale: number;
  image: Phaser.GameObjects.Image | null;
  frame: Phaser.GameObjects.Image | null;
  isHovered: boolean;
}

const MIN_MARQUEE_SPEED = -25;
const MAX_MARQUEE_SPEED = -250;
const GAP = 55;
const MARQUEE_TOOLTIP_EVENT = "search-marquee-tooltip";
const MARQUEE_TOOLTIP_CLEAR_EVENT = "search-marquee-tooltip-clear";

type MarqueeTooltipDetail = {
  label: string;
  locationName: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
};

export class MarqueeSearch {
  private scene: UIScene;

  // Default fallback items (used when no real items are loaded)
  private defaultTextureKeys: Array<{ textureKey: string; label: string }> = [
    {
      textureKey: "icon-nightstand.png",
      label: "Bedroom Nightstand",
    },
    { textureKey: "icon-pajamas.png", label: "Cozy Pajamas" },
  ];

  private textureKeys: Array<{
    textureKey: string;
    label: string;
    locationName?: string | null;
  }>;

  private readonly maxIconWidth = 120;
  private readonly maxIconHeight = 120;

  private marqueeEntries: MarqueeEntry[] = [];

  // The minimum number of entries that should be in the marquee at any given time
  private minimumNumberOfEntries: number = 10;

  private speed: number = MIN_MARQUEE_SPEED;

  private lastSpeedBoostTime: number = 0;

  private isHovering: boolean = false;

  private previousSpeed: number = MIN_MARQUEE_SPEED;

  private activeHoveredEntry: MarqueeEntry | null = null;

  constructor(scene: UIScene) {
    this.scene = scene;
    this.textureKeys = [...this.defaultTextureKeys];
    this.create();
  }

  private getScaledDimensions(width: number, height: number) {
    const scale = Math.min(
      this.maxIconWidth / width,
      this.maxIconHeight / height,
      1,
    );
    return {
      scaledWidth: width * scale,
      scaledHeight: height * scale,
      scale,
    };
  }

  create() {
    // Clear existing marquee entries and their images/frames
    this.marqueeEntries.forEach((entry) => {
      if (entry.image) entry.image.destroy();
      if (entry.frame) entry.frame.destroy();
    });
    this.marqueeEntries = [];

    // Initialize marquee entries with individual icons and their scaled sizes
    let currentX = 0;
    this.marqueeEntries = this.textureKeys.map(
      ({ textureKey, label, locationName }) => {
        const texture = this.scene.textures.get(textureKey);
        const { width, height } = texture.getSourceImage();
        const { scaledWidth, scaledHeight, scale } = this.getScaledDimensions(
          width,
          height,
        );

        const entry: MarqueeEntry = {
          textureKey,
          label,
          locationName: locationName ?? null,
          x: currentX,
          width: scaledWidth,
          height: scaledHeight,
          scale,
          image: null,
          frame: null,
          isHovered: false,
        };

        currentX += scaledWidth + GAP;
        return entry;
      },
    );

    this.scene.events.on("update", this.update, this);

    this.scene.input.on(
      "pointermove",
      debounce(this.onPointerMove, 25, { leading: true }),
      this,
    );

    this.scene.scale.on("resize", this.onResize, this);
    this.onResize(this.scene.scale.gameSize);
  }

  update(time: number, delta: number) {
    // Check if pointer is in the marquee area (bottom half of screen)
    const pointer = this.scene.input.activePointer;
    const inMarqueeArea = pointer.y > this.scene.scale.height * 0.5;

    // Update hover state and speed based on pointer position
    if (inMarqueeArea && !this.isHovering) {
      this.isHovering = true;
      if (this.speed !== 0) {
        this.previousSpeed = this.speed;
      }
      this.speed = 0;
    } else if (!inMarqueeArea && this.isHovering) {
      this.isHovering = false;
      this.speed =
        this.previousSpeed !== 0 ? this.previousSpeed : MIN_MARQUEE_SPEED;
    }

    let elementsToRemove = 0;

    // Move the marquee left by the speed
    this.marqueeEntries.forEach((entry) => {
      const { x, textureKey, label, width, scale } = entry;
      if (entry.image === null) {
        entry.frame = this.scene.add.image(x, 650, "scrollframe.png");
        entry.frame.setScale(0.4);
        entry.image = this.scene.add.image(x, 650, textureKey);
        entry.image.setScale(scale);
        entry.image.setInteractive({ useHandCursor: true });

        // Add hover effects
        entry.image.on("pointerover", () => {
          if (!entry.isHovered) {
            entry.isHovered = true;
            entry.frame!.setScale(0.45);
            entry.image!.setScale(scale * 1.1);
            this.activeHoveredEntry = entry;
            this.emitTooltipState(entry);
          }
        });

        entry.image.on("pointerout", () => {
          if (entry.isHovered) {
            entry.isHovered = false;
            entry.frame!.setScale(0.4);
            entry.image!.setScale(scale);
            this.clearTooltipState(entry);
          }
        });
      }

      entry.image.x += (this.speed * delta) / 1000;
      entry.frame!.x = entry.image.x;
      entry.x = entry.image.x;

      if (this.activeHoveredEntry === entry) {
        this.emitTooltipState(entry);
      }

      if (entry.image.x + width / 2 < 0) {
        if (this.activeHoveredEntry === entry) {
          this.clearTooltipState(entry);
        }
        entry.image.destroy();
        entry.frame!.destroy();
        entry.image = null;
        entry.frame = null;
        elementsToRemove++;
      }
    });

    // Remove elements that are off screen
    this.marqueeEntries.splice(0, elementsToRemove);

    const numberOfEntriesToAdd =
      this.minimumNumberOfEntries - this.marqueeEntries.length;

    // Add new elements to the marquee
    this.addRandomItems(numberOfEntriesToAdd);

    // Slow down the marquee if it hasn't been sped up in a while (only when not hovering)
    if (!this.isHovering && time - this.lastSpeedBoostTime > 1000) {
      this.speed *= 0.9;
      this.speed = Phaser.Math.Clamp(
        this.speed,
        MAX_MARQUEE_SPEED,
        MIN_MARQUEE_SPEED,
      );
      this.lastSpeedBoostTime = time;
    }
  }

  public addRandomItems(count: number) {
    for (let i = 0; i < count; i++) {
      this.addItem(sample(this.textureKeys)!);
    }
  }

  public addItem(item: {
    textureKey: string;
    label: string;
    locationName?: string | null;
  }) {
    const texture = this.scene.textures.get(item.textureKey);
    const { width, height } = texture.getSourceImage();
    const { scaledWidth, scaledHeight, scale } = this.getScaledDimensions(
      width,
      height,
    );

    const lastEntry = last(this.marqueeEntries);

    this.marqueeEntries.push({
      textureKey: item.textureKey,
      label: item.label,
      locationName: item.locationName ?? null,
      x: lastEntry ? lastEntry.x + lastEntry.width + GAP : 0,
      width: scaledWidth,
      height: scaledHeight,
      scale,
      image: null,
      frame: null,
      isHovered: false,
    });
  }

  onResize(gameSize: Phaser.Structs.Size) {
    this.minimumNumberOfEntries = Math.max(
      Math.ceil(gameSize.width / (this.maxIconWidth + GAP)) + 1,
      3,
    );
  }

  onPointerMove(_pointer: Phaser.Input.Pointer) {
    // Only speed up if not hovering (when hovering, speed is locked to 0)
    if (!this.isHovering) {
      this.speed *= 1.5;

      this.speed = Phaser.Math.Clamp(
        this.speed,
        MAX_MARQUEE_SPEED,
        MIN_MARQUEE_SPEED,
      );

      this.lastSpeedBoostTime = this.scene.game.getTime();
    }
  }

  /** Convert database items to marquee items format */
  private mapDatabaseItemsToMarqueeItems(
    items: Array<{
      name: string;
      iconKey?: string | null;
      locationName?: string | null;
    }>,
  ): MarqueeItem[] {
    const iconKeyToTextureKey: Record<string, string> = {
      book: "icon-book.png",
      bookshelf: "icon-bookshelf.png",
      glasses: "icon-glasses.png",
      laptop: "icon-laptop.png",
      mug: "icon-mug.png",
      nightstand: "icon-nightstand.png",
      pajamas: "icon-pajamas.png",
      remote: "icon-remote.png",
    };

    const mappedItems = items
      .filter((item) => item.iconKey && iconKeyToTextureKey[item.iconKey])
      .map((item) => ({
        textureKey: iconKeyToTextureKey[item.iconKey!],
        label: item.name,
        locationName: item.locationName ?? null,
      }));

    return mappedItems;
  }

  /** Update marquee items from database */
  public updateItems(
    items: Array<{
      name: string;
      iconKey?: string | null;
      locationName?: string | null;
    }>,
  ) {
    const mappedItems = this.mapDatabaseItemsToMarqueeItems(items);
    if (mappedItems.length > 0) {
      // Swap the source list only. Existing visible entries keep scrolling out,
      // and new entries will start using the real database items naturally.
      this.textureKeys = mappedItems;
    }
  }

  private emitTooltipState(entry: MarqueeEntry) {
    if (typeof window === "undefined" || !entry.image) {
      return;
    }

    const bounds = entry.image.getBounds();
    const detail: MarqueeTooltipDetail = {
      label: entry.label,
      locationName: entry.locationName,
      x: bounds.x + bounds.width / 2,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };

    window.dispatchEvent(
      new CustomEvent<MarqueeTooltipDetail>(MARQUEE_TOOLTIP_EVENT, {
        detail,
      }),
    );
  }

  private clearTooltipState(entry: MarqueeEntry) {
    if (this.activeHoveredEntry !== entry) {
      return;
    }

    this.activeHoveredEntry = null;

    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(new Event(MARQUEE_TOOLTIP_CLEAR_EVENT));
  }
}
