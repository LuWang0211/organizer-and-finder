import Image from "next/image";
import { HOUSEHOLD_ICON_IMAGES } from "./IconV2";
import type { ObjectCardIconKey } from "./ObjectCard";

export type IconImageProps = {
  alt: string;
  baseSize: number; // Base size to calculate final icon size (optional)
  ratio: number; // Icon size ratio relative to baseSize (0.2 to 1.0)
  iconSrc?: string;
  iconKey?: ObjectCardIconKey;
};

export function calculateIconSize(baseSize: number, iconRatio: number): number {
  const ratio = Math.min(Math.max(iconRatio, 0.2), 1.5);
  return Math.round(baseSize * ratio);
}

/**
 * Shared icon image component used by IconV2 and ObjectCard.
 * Renders a Next.js Image with consistent styling.
 */
const IconImage = ({
  alt,
  baseSize,
  ratio,
  iconSrc,
  iconKey,
}: IconImageProps) => {
  const imageSrc =
    iconSrc || (iconKey ? HOUSEHOLD_ICON_IMAGES[iconKey] : undefined);

  if (!imageSrc) {
    return null;
  }

  const actualSize = calculateIconSize(baseSize, ratio);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={actualSize}
      height={actualSize}
      className="object-contain focus-visible:outline-none"
      sizes="(max-width: 768px) 64px, 256px"
    />
  );
};

IconImage.displayName = "IconImage";

export { IconImage };
