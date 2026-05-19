import { debounce, last, sample } from "lodash";
import type { UIScene } from "@/app/search/scenes/UIScene";
import {
  GAP,
  HOVER_STOP_RATIO,
  MARQUEE_TOOLTIP_CLEAR_EVENT,
  MARQUEE_TOOLTIP_EVENT,
  MAX_MARQUEE_SPEED,
  type MarqueeEntry,
  type MarqueeTooltipDetail,
  MIN_MARQUEE_SPEED,
} from "./marqueeSearch.types";
import {
  createMarqueeEntries,
  getScaledDimensions,
  mapDatabaseItemsToMarqueeItems,
} from "./marqueeSearch.utils";

export class MarqueeSearch {
  private scene: UIScene;

  private textureKeys: Array<{
    textureKey: string;
    label: string;
    locationName?: string | null;
  }> = [];

  private marqueeEntries: MarqueeEntry[] = [];
  private marqueeHoverArea = new Phaser.Geom.Rectangle(0, 0, 0, 0);

  private maxIconWidth = 120;
  private maxIconHeight = 120;

  private speed: number = MIN_MARQUEE_SPEED;

  private lastSpeedBoostTime: number = 0;

  private defaultTextureKeys: Array<{
    textureKey: string;
    label: string;
    locationName: string | null;
  }> = [
    {
      textureKey: "icon-glasses.png",
      label: "Glasses",
      locationName: "Bedroom(example)",
    },
    {
      textureKey: "icon-mug.png",
      label: "Mug",
      locationName: "Kitchen(example)",
    },
    {
      textureKey: "icon-pajamas.png",
      label: "Pajamas",
      locationName: "Bedroom",
    },
  ];

  private activeHoveredEntry: MarqueeEntry | null = null;

  private readonly frameBaseScale = 1;
  private readonly frameHoverScale = 1.125;

  private readonly pointerMoveHandler = debounce(
    () => this.onPointerMove(),
    25,
    { leading: true },
  );

  constructor(scene: UIScene) {
    this.scene = scene;
    this.textureKeys = [...this.defaultTextureKeys];
    this.create();
  }

  create() {
    this.clearTooltipState();

    this.marqueeEntries.forEach((entry) => {
      if (entry.image) entry.image.destroy();
      if (entry.frame) entry.frame.destroy();
    });
    this.marqueeEntries = [];

    this.scene.events.off("update", this.update, this);
    this.scene.input.off("pointermove", this.pointerMoveHandler, this);
    this.scene.scale.off("resize", this.onResize, this);

    this.marqueeEntries = createMarqueeEntries(
      this.scene,
      this.textureKeys,
      this.maxIconWidth,
      this.maxIconHeight,
      GAP,
    );

    this.scene.events.on("update", this.update, this);

    this.scene.input.on("pointermove", this.pointerMoveHandler);

    this.scene.scale.on("resize", this.onResize, this);
    this.onResize(this.scene.scale.gameSize);
  }

  update(time: number, delta: number) {
    const pointer = this.scene.input.activePointer;
    const inMarqueeArea = this.marqueeHoverArea.contains(pointer.x, pointer.y);
    let elementsToRemove = 0;

    if (inMarqueeArea && !this.isHovering) {
      this.isHovering = true;
      this.targetSpeed = 0;
    } else if (!inMarqueeArea && this.isHovering) {
      this.isHovering = false;
      this.targetSpeed = MIN_MARQUEE_SPEED;
    }

    this.currentSpeed = Phaser.Math.Linear(
      this.currentSpeed,
      this.targetSpeed,
      0.1,
    );

    if (!this.isHovering && time - this.lastSpeedBoostTime > 1000) {
      this.speed *= 0.9;
      this.speed = Phaser.Math.Clamp(
        this.speed,
        MAX_MARQUEE_SPEED,
        MIN_MARQUEE_SPEED,
      );
      this.lastSpeedBoostTime = time;
    }

    const effectiveSpeed = this.isHovering ? this.currentSpeed : this.speed;

    this.marqueeEntries.forEach((entry) => {
      const { x, textureKey } = entry;
      if (entry.image === null) {
        entry.frame = this.scene.add.image(x, 650, "scrollframe.png");
        entry.frame.setScale(this.frameBaseScale);
        entry.image = this.scene.add.image(x, 650, textureKey);
        entry.image.setScale(entry.scale);
        entry.image.setInteractive({ useHandCursor: true });

        entry.image.on("pointerover", () => {
          if (!entry.isHovered) {
            entry.isHovered = true;
            entry.frame!.setScale(this.frameHoverScale);
            entry.image!.setScale(entry.scale * 1.1);
            this.activeHoveredEntry = entry;
            this.emitTooltipState(entry);
          }
        });

        entry.image.on("pointerout", () => {
          if (entry.isHovered) {
            entry.isHovered = false;
            entry.frame!.setScale(this.frameBaseScale);
            entry.image!.setScale(entry.scale);
            this.clearTooltipState(entry);
          }
        });
      }

      entry.image.x += (effectiveSpeed * delta) / 1000;
      entry.x = entry.image.x;
      entry.frame!.x = entry.image.x;

      if (entry.image.x + entry.width / 2 < 0) {
        entry.image.destroy();
        entry.frame!.destroy();
        entry.image = null;
        entry.frame = null;
        entry.isHovered = false;
        elementsToRemove++;
      }
    });

    if (elementsToRemove > 0) {
      this.marqueeEntries.splice(0, elementsToRemove);
      this.addRandomItems(elementsToRemove);
    }
  }

  public addItem(item: {
    textureKey: string;
    label: string;
    locationName?: string | null;
  }) {
    const texture = this.scene.textures.get(item.textureKey);
    const { width, height } = texture.getSourceImage();
    const { scaledWidth, scaledHeight, scale } = getScaledDimensions(
      width,
      height,
      this.maxIconWidth,
      this.maxIconHeight,
    );

    const lastEntry = last(this.marqueeEntries);
    const newX = lastEntry ? lastEntry.x + lastEntry.width + GAP : 0;

    this.marqueeEntries.push({
      textureKey: item.textureKey,
      label: item.label,
      locationName: item.locationName ?? null,
      x: newX,
      width: scaledWidth,
      height: scaledHeight,
      scale,
      image: null,
      frame: null,
      isHovered: false,
    });
  }

  public addRandomItems(count: number) {
    for (let i = 0; i < count; i++) {
      this.addItem(sample(this.textureKeys)!);
    }
  }

  onResize(gameSize: Phaser.Structs.Size) {
    const minWidth = Math.ceil(gameSize.width / 100) + 1;
    const thresholdY = Math.floor(gameSize.height * HOVER_STOP_RATIO);
    this.marqueeHoverArea.setTo(
      0,
      thresholdY,
      gameSize.width,
      gameSize.height - thresholdY,
    );

    const currentCount = this.marqueeEntries.length;
    if (currentCount < minWidth) {
      this.addRandomItems(minWidth - currentCount);
    }
  }

  onPointerMove() {
    this.speed *= 1.5;
    this.speed = Phaser.Math.Clamp(
      this.speed,
      MAX_MARQUEE_SPEED,
      MIN_MARQUEE_SPEED,
    );
    this.lastSpeedBoostTime = this.scene.game.getTime();
  }

  private isHovering = false;
  private currentSpeed = MIN_MARQUEE_SPEED;
  private targetSpeed = MIN_MARQUEE_SPEED;

  private emitTooltipState(entry: MarqueeEntry) {
    const detail: MarqueeTooltipDetail = {
      label: entry.label,
      locationName: entry.locationName,
      x: entry.x,
      y: 650 - entry.height / 2 - 10,
      width: entry.width,
      height: entry.height,
    };
    window.dispatchEvent(new CustomEvent(MARQUEE_TOOLTIP_EVENT, { detail }));
  }

  private clearTooltipState(entry?: MarqueeEntry | null) {
    if (entry && this.activeHoveredEntry !== entry) {
      return;
    }

    this.activeHoveredEntry = null;
    window.dispatchEvent(new CustomEvent(MARQUEE_TOOLTIP_CLEAR_EVENT));
  }

  public updateItems(
    items: Array<{
      name: string;
      iconKey?: string | null;
      locationName?: string | null;
    }>,
  ) {
    const mappedItems = mapDatabaseItemsToMarqueeItems(this.scene, items);
    if (mappedItems.length > 0) {
      this.textureKeys = mappedItems;
      this.create();
    }
  }
}
