import type { MarqueeEntry, MarqueeItem } from "./marqueeSearch.types";

type MarqueeSearchTextures = {
  exists: (key: string) => boolean;
  get: (key: string) => {
    getSourceImage: () => { width: number; height: number };
  };
};

export type MarqueeSearchSceneLike = {
  textures: MarqueeSearchTextures;
};

export function getScaledDimensions(
  width: number,
  height: number,
  maxIconWidth: number,
  maxIconHeight: number,
) {
  const scale = Math.min(maxIconWidth / width, maxIconHeight / height, 1);
  return {
    scaledWidth: width * scale,
    scaledHeight: height * scale,
    scale,
  };
}

export function resolveTextureKey(
  scene: MarqueeSearchSceneLike,
  iconKey?: string | null,
) {
  const fallbackTextureKey = "icon-unknown.png";

  if (!iconKey) {
    return fallbackTextureKey;
  }

  const textureKey = `icon-${iconKey}.png`;

  return scene.textures.exists(textureKey) ? textureKey : fallbackTextureKey;
}

export function mapDatabaseItemsToMarqueeItems(
  scene: MarqueeSearchSceneLike,
  items: Array<{
    name: string;
    iconKey?: string | null;
    locationName?: string | null;
  }>,
): MarqueeItem[] {
  const mappedItems = items.map((item) => ({
    textureKey: resolveTextureKey(scene, item.iconKey),
    label: item.name,
    locationName: item.locationName ?? null,
  }));

  return mappedItems.sort((a, b) => {
    const aIsUnknown = a.textureKey === "icon-unknown.png";
    const bIsUnknown = b.textureKey === "icon-unknown.png";
    if (aIsUnknown === bIsUnknown) {
      return 0;
    }
    return aIsUnknown ? 1 : -1;
  });
}

export function createMarqueeEntries(
  scene: MarqueeSearchSceneLike,
  textureKeys: MarqueeItem[],
  maxIconWidth: number,
  maxIconHeight: number,
  gap: number,
): MarqueeEntry[] {
  let currentX = 0;

  return textureKeys.map(({ textureKey, label, locationName }) => {
    const { width, height } = scene.textures.get(textureKey).getSourceImage();
    const { scaledWidth, scaledHeight, scale } = getScaledDimensions(
      width,
      height,
      maxIconWidth,
      maxIconHeight,
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

    currentX += scaledWidth + gap;
    return entry;
  });
}
