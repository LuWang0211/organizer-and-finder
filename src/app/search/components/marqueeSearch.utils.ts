import type { MarqueeEntry, MarqueeItem } from "./marqueeSearch.types";

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
  textureExists: (key: string) => boolean,
  iconKey?: string | null,
) {
  const fallbackTextureKey = "icon-unknown.png";

  if (!iconKey) {
    return fallbackTextureKey;
  }

  const candidates = [
    iconKey,
    `icon-${iconKey}`,
    `icon-${iconKey}.png`,
    `${iconKey}.png`,
  ];

  return (
    candidates.find((candidate) => textureExists(candidate)) ??
    fallbackTextureKey
  );
}

export function mapDatabaseItemsToMarqueeItems(
  items: Array<{
    name: string;
    iconKey?: string | null;
    locationName?: string | null;
  }>,
  textureExists: (key: string) => boolean,
): MarqueeItem[] {
  const mappedItems = items.map((item) => ({
    textureKey: resolveTextureKey(textureExists, item.iconKey),
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
  textureKeys: MarqueeItem[],
  getTextureSize: (textureKey: string) => { width: number; height: number },
  maxIconWidth: number,
  maxIconHeight: number,
  gap: number,
): MarqueeEntry[] {
  let currentX = 0;

  return textureKeys.map(({ textureKey, label, locationName }) => {
    const { width, height } = getTextureSize(textureKey);
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
