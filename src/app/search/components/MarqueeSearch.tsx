import { debounce, last, sample } from "lodash";
import type { UIScene } from "@/app/search/scenes/UIScene";
import {
  GAP,
  HOVER_STOP_RATIO,
  MARQUEE_TOOLTIP_CLEAR_EVENT,
  MARQUEE_TOOLTIP_EVENT,
  MAX_MARQUEE_SPEED,
  type MarqueeEntry,
  type MarqueeItem,
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
  private searchFlashUntil: number = 0;

  private readonly searchFlashDurationMs = 500;
  private readonly searchFlashSpeed = -2800;
  private readonly reelSettleMinSpeed = -70;
  private readonly reelDecelerationRatio = 2.2;
  private resultReel: {
    landingEntry: MarqueeEntry;
    isStopped: boolean;
  } | null = null;

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
  private hasLoadedInventoryItems = false;

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
    this.resultReel = null;

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

    const effectiveSpeed = this.getEffectiveSpeed(time);
    const movement = this.getFrameMovement(effectiveSpeed, delta);

    this.marqueeEntries.forEach((entry) => {
      const { x, textureKey } = entry;
      if (entry.image === null) {
        entry.frame = this.scene.add.image(x, 650, "scrollframe.png");
        entry.image = this.scene.add.image(x, 650, textureKey);
        entry.image.setInteractive({ useHandCursor: true });
        this.applyEntryVisualState(entry);

        entry.image.on("pointerover", () => {
          if (!entry.isHovered) {
            entry.isHovered = true;
            this.activeHoveredEntry = entry;
            this.applyEntryVisualState(entry);
            this.emitTooltipState(entry);
          }
        });

        entry.image.on("pointerout", () => {
          if (entry.isHovered) {
            entry.isHovered = false;
            this.applyEntryVisualState(entry);
            this.clearTooltipState(entry);
          }
        });
      }

      entry.image.x += movement;
      entry.x = entry.image.x;
      entry.frame!.x = entry.image.x;
      this.applyEntryVisualState(entry);

      if (!this.resultReel?.isStopped && entry.image.x + entry.width / 2 < 0) {
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

  public addItem(
    item: {
      textureKey: string;
      label: string;
      locationName?: string | null;
    },
    x?: number,
  ) {
    const texture = this.scene.textures.get(item.textureKey);
    const { width, height } = texture.getSourceImage();
    const { scaledWidth, scaledHeight, scale } = getScaledDimensions(
      width,
      height,
      this.maxIconWidth,
      this.maxIconHeight,
    );

    const lastEntry = last(this.marqueeEntries);
    const newX =
      x ??
      (lastEntry
        ? lastEntry.x + lastEntry.width / 2 + GAP + scaledWidth / 2
        : 0);

    const entry: MarqueeEntry = {
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
      isSelected: false,
    };

    this.marqueeEntries.push(entry);
    return entry;
  }

  public addRandomItems(count: number) {
    if (this.resultReel?.isStopped) {
      return;
    }

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
    if (this.resultReel?.isStopped) {
      this.centerStoppedResultReel();
      return;
    }

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

  private getEffectiveSpeed(time: number) {
    if (this.resultReel) {
      if (this.resultReel.isStopped) {
        return 0;
      }

      const distanceToFocalPoint =
        this.resultReel.landingEntry.x - this.getFocalX();

      if (distanceToFocalPoint <= 0) {
        this.stopResultReel();
        return 0;
      }

      if (time < this.searchFlashUntil) {
        return this.searchFlashSpeed;
      }

      return Phaser.Math.Clamp(
        -distanceToFocalPoint * this.reelDecelerationRatio,
        this.searchFlashSpeed,
        this.reelSettleMinSpeed,
      );
    }

    return this.isHovering ? this.currentSpeed : this.speed;
  }

  private getFrameMovement(speed: number, delta: number) {
    if (!this.resultReel || this.resultReel.isStopped || speed === 0) {
      return (speed * delta) / 1000;
    }

    const requestedMovement = (speed * delta) / 1000;
    const distanceToFocalPoint =
      this.resultReel.landingEntry.x - this.getFocalX();

    if (distanceToFocalPoint <= 0) {
      this.stopResultReel();
      return 0;
    }

    return Math.max(requestedMovement, -distanceToFocalPoint);
  }

  private stopResultReel() {
    if (!this.resultReel || this.resultReel.isStopped) {
      return;
    }

    const correction = this.getFocalX() - this.resultReel.landingEntry.x;
    this.marqueeEntries.forEach((entry) => {
      entry.x += correction;
      entry.image?.setX(entry.x);
      entry.frame?.setX(entry.x);
    });

    this.resultReel.isStopped = true;
    this.speed = MIN_MARQUEE_SPEED;
    this.currentSpeed = MIN_MARQUEE_SPEED;
    this.targetSpeed = MIN_MARQUEE_SPEED;
    this.resultReel.landingEntry.isSelected = true;
    this.applyEntryVisualState(this.resultReel.landingEntry);
  }

  private getFocalX() {
    return this.scene.scale.gameSize.width / 2;
  }

  private applyEntryVisualState(entry: MarqueeEntry) {
    if (!entry.image || !entry.frame) {
      return;
    }

    const frameScale = entry.isSelected
      ? 1.25
      : entry.isHovered
        ? this.frameHoverScale
        : this.frameBaseScale;
    const imageScale = entry.scale * (entry.isSelected ? 1.18 : 1);

    entry.frame.setScale(frameScale);
    entry.image.setScale(imageScale);
    entry.frame.setDepth(entry.isSelected ? 3 : 1);
    entry.image.setDepth(entry.isSelected ? 4 : 2);
    entry.frame.setTint(entry.isSelected ? 0xffd76a : 0xffffff);
    entry.image.setAlpha(entry.isSelected ? 1 : 0.9);
  }

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
      if (!this.hasLoadedInventoryItems) {
        this.showInventoryItems(mappedItems);
        return;
      }

      this.updateResultDisplay(mappedItems);
    }
  }

  public clearSearchResult() {
    if (!this.hasLoadedInventoryItems) {
      return;
    }

    this.showInventoryItems(this.textureKeys);
    this.speed = MIN_MARQUEE_SPEED;
    this.currentSpeed = MIN_MARQUEE_SPEED;
    this.targetSpeed = MIN_MARQUEE_SPEED;
    this.searchFlashUntil = 0;
  }

  private showInventoryItems(mappedItems: MarqueeItem[]) {
    this.textureKeys = mappedItems;
    this.hasLoadedInventoryItems = true;
    this.resultReel = null;
    this.clearMarqueeEntries();
    this.marqueeEntries = createMarqueeEntries(
      this.scene,
      this.textureKeys,
      this.maxIconWidth,
      this.maxIconHeight,
      GAP,
    );
    this.onResize(this.scene.scale.gameSize);
  }

  private updateResultDisplay(mappedItems: MarqueeItem[]) {
    this.queueSearchResultTransition(mappedItems);
  }

  private queueSearchResultTransition(mappedItems: MarqueeItem[]) {
    const gameWidth = this.scene.scale.gameSize.width;

    this.clearTooltipState();
    this.resultReel = null;
    this.marqueeEntries.forEach((entry) => {
      entry.isSelected = false;
      this.applyEntryVisualState(entry);
    });
    this.isHovering = false;
    this.currentSpeed = MIN_MARQUEE_SPEED;
    this.targetSpeed = MIN_MARQUEE_SPEED;
    this.speed = MAX_MARQUEE_SPEED;
    this.lastSpeedBoostTime = this.scene.game.getTime();
    this.searchFlashUntil =
      this.lastSpeedBoostTime + this.searchFlashDurationMs;

    this.removeEntriesPastRightEdge(gameWidth + GAP);
    const landingEntry = this.queueResultItemsFromRight(mappedItems, gameWidth);
    this.resultReel = {
      landingEntry,
      isStopped: false,
    };
  }

  private queueResultItemsFromRight(
    mappedItems: MarqueeItem[],
    gameWidth: number,
  ) {
    const visibleItemCount = Math.ceil(gameWidth / (this.maxIconWidth + GAP));
    const minimumResultCount = Math.max(visibleItemCount * 4, 16);
    const landingIndex = Math.max(
      visibleItemCount * 2,
      Math.floor(minimumResultCount * 0.7),
    );
    const highlightedResultIndex = Math.floor((mappedItems.length - 1) / 2);
    const resultStartIndex = landingIndex - highlightedResultIndex;
    const queueLength = Math.max(
      minimumResultCount,
      resultStartIndex + mappedItems.length + visibleItemCount,
    );
    const fillerItems = this.getResultFillerItems(mappedItems);
    const rightmostEntry = this.marqueeEntries.reduce<MarqueeEntry | null>(
      (rightmost, entry) => {
        if (!rightmost || entry.x > rightmost.x) {
          return entry;
        }
        return rightmost;
      },
      null,
    );
    let nextX = Math.max(
      gameWidth + GAP,
      rightmostEntry ? rightmostEntry.x + rightmostEntry.width / 2 + GAP : 0,
    );
    let landingEntry: MarqueeEntry | null = null;

    for (let i = 0; i < queueLength; i++) {
      const resultIndex = i - resultStartIndex;
      const item =
        resultIndex >= 0 && resultIndex < mappedItems.length
          ? mappedItems[resultIndex]
          : sample(fillerItems)!;
      const { scaledWidth } = this.getItemDimensions(item);
      nextX += scaledWidth / 2;
      const entry = this.addItem(item, nextX);
      if (i === landingIndex) {
        landingEntry = entry;
      }
      nextX += entry.width / 2 + GAP;
    }

    this.marqueeEntries.sort((a, b) => a.x - b.x);
    return landingEntry ?? last(this.marqueeEntries)!;
  }

  private getResultFillerItems(resultItems: MarqueeItem[]) {
    const nonMatchingInventoryItems = this.textureKeys.filter(
      (item) =>
        !resultItems.some((resultItem) =>
          this.isSameMarqueeItem(item, resultItem),
        ),
    );

    if (nonMatchingInventoryItems.length > 0) {
      return nonMatchingInventoryItems;
    }

    const nonMatchingDefaultItems = this.defaultTextureKeys.filter(
      (item) =>
        !resultItems.some((resultItem) =>
          this.isSameMarqueeItem(item, resultItem),
        ),
    );

    return nonMatchingDefaultItems.length > 0
      ? nonMatchingDefaultItems
      : this.defaultTextureKeys;
  }

  private isSameMarqueeItem(a: MarqueeItem, b: MarqueeItem) {
    return (
      a.textureKey === b.textureKey &&
      a.label === b.label &&
      (a.locationName ?? null) === (b.locationName ?? null)
    );
  }

  private centerStoppedResultReel() {
    if (!this.resultReel?.isStopped) {
      return;
    }

    const correction = this.getFocalX() - this.resultReel.landingEntry.x;
    this.marqueeEntries.forEach((entry) => {
      entry.x += correction;
      entry.image?.setX(entry.x);
      entry.frame?.setX(entry.x);
    });
  }

  private removeEntriesPastRightEdge(rightEdge: number) {
    this.marqueeEntries = this.marqueeEntries.filter((entry) => {
      if (entry.x <= rightEdge) {
        return true;
      }

      if (entry === this.activeHoveredEntry) {
        this.clearTooltipState(entry);
      }
      entry.image?.destroy();
      entry.frame?.destroy();
      return false;
    });
  }

  private clearMarqueeEntries() {
    this.clearTooltipState();
    this.marqueeEntries.forEach((entry) => {
      entry.image?.destroy();
      entry.frame?.destroy();
    });
    this.marqueeEntries = [];
  }

  private getItemDimensions(item: MarqueeItem) {
    const texture = this.scene.textures.get(item.textureKey);
    const { width, height } = texture.getSourceImage();
    return getScaledDimensions(
      width,
      height,
      this.maxIconWidth,
      this.maxIconHeight,
    );
  }
}
