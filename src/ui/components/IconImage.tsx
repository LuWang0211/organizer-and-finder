import Image from "next/image";

export interface IconImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Shared icon image component used by IconV2 and ObjectCard.
 * Renders a Next.js Image with consistent styling.
 */
const IconImage = ({ src, alt, width, height }: IconImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    className="object-contain"
    unoptimized
  />
);

IconImage.displayName = "IconImage";

export { IconImage };
