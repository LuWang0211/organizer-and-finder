"use client";

import { useLayoutEffect, useState } from "react";
import {
  DIALOG_PADDING,
  FOOTER_TOP_MARGIN,
  GRID_GAP,
  GRID_ICON_SIZE,
  PAGER_TOP_MARGIN,
} from "./iconPickerLayout";

export type DialogBounds = {
  maxWidth: number;
  maxHeight: number;
  aspectRatio: number;
};

export type IconGridLayout = {
  availableWidth: number;
  availableHeight: number;
  columns: number;
  rows: number;
  iconsPerPage: number;
};

export type IconPickerCapacityRefs = {
  headerRef: React.RefObject<HTMLDivElement | null>;
  pagerRef: React.RefObject<HTMLDivElement | null>;
  footerRef: React.RefObject<HTMLDivElement | null>;
};

export function resolveMaxDialogLayout({
  maxWidth,
  maxHeight,
  aspectRatio,
}: DialogBounds) {
  let width = Math.min(maxWidth, maxHeight * aspectRatio);
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.floor(width),
    height: Math.floor(height),
    aspectRatio,
  };
}

function getIconGridLayout(
  availableWidth: number,
  availableHeight: number,
): IconGridLayout {
  const columns = Math.max(
    1,
    Math.floor((availableWidth + GRID_GAP) / (GRID_ICON_SIZE + GRID_GAP)),
  );
  const rows = Math.max(
    1,
    Math.floor((availableHeight + GRID_GAP) / (GRID_ICON_SIZE + GRID_GAP)),
  );

  return {
    availableWidth,
    availableHeight,
    columns,
    rows,
    iconsPerPage: columns * rows,
  };
}

export function useIconPickerCapacity(
  dialogBounds: DialogBounds,
  { headerRef, pagerRef, footerRef }: IconPickerCapacityRefs,
) {
  const [maxGridLayout, setMaxGridLayout] = useState<IconGridLayout | null>(
    null,
  );

  useLayoutEffect(() => {
    if (maxGridLayout) {
      return;
    }

    let frameId = 0;

    const measure = () => {
      const header = headerRef.current;
      const pager = pagerRef.current;
      const footer = footerRef.current;

      if (!header || !pager || !footer) {
        frameId = window.requestAnimationFrame(measure);
        return;
      }

      const maxDialogLayout = resolveMaxDialogLayout(dialogBounds);
      const contentMaxWidth = maxDialogLayout.width - DIALOG_PADDING * 2;
      const contentMaxHeight = maxDialogLayout.height - DIALOG_PADDING * 2;
      const headerHeight = header.clientHeight;
      const pagerHeight = pager.clientHeight;
      const footerHeight = footer.clientHeight;
      const iconAreaMaxWidth = Math.max(
        0,
        contentMaxWidth - DIALOG_PADDING * 2,
      );
      const iconAreaMaxHeight = Math.max(
        0,
        contentMaxHeight -
          headerHeight -
          pagerHeight -
          PAGER_TOP_MARGIN -
          footerHeight -
          FOOTER_TOP_MARGIN -
          DIALOG_PADDING * 2,
      );

      setMaxGridLayout(getIconGridLayout(iconAreaMaxWidth, iconAreaMaxHeight));
    };

    measure();

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [dialogBounds, maxGridLayout, headerRef, pagerRef, footerRef]);

  return maxGridLayout;
}
