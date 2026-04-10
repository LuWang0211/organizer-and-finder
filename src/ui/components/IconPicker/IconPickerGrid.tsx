"use client";

import { useMemo } from "react";
import { type HouseholdIconKey, IconV2 } from "../IconV2";
import { ICONS_LIBRARY } from "./iconPickerIcons";
import { DIALOG_PADDING, GRID_GAP, GRID_ICON_SIZE } from "./iconPickerLayout";
import type { IconGridLayout } from "./useIconPickerCapacity";

export function IconPickerGrid({
  layout,
  currentPage,
  totalPages,
  onSelectIcon,
}: {
  layout: IconGridLayout;
  currentPage: number;
  totalPages: number;
  onSelectIcon: (iconKey: HouseholdIconKey) => void;
}) {
  const pageStartIndex = currentPage * layout.iconsPerPage;
  const visibleIcons = ICONS_LIBRARY.slice(
    pageStartIndex,
    pageStartIndex + layout.iconsPerPage,
  );
  const visibleColumnCount = Math.max(
    1,
    Math.min(layout.columns, visibleIcons.length),
  );

  const fixedWidthHeight = useMemo(() => {
    if (totalPages > 1) {
      return {
        width: `${layout.availableWidth}px`,
        height: `${layout.availableHeight}px`,
      };
    }
    return {};
  }, [totalPages, layout.availableWidth, layout.availableHeight]);

  return (
    <div
      className="relative flex flex-col justify-start items-start"
      style={fixedWidthHeight}
    >
      <div
        className="relative z-10 grid place-content-center bg-linear-to-br from-mute/40 to-transparent rounded-2xl"
        style={{
          gridTemplateColumns: `repeat(${visibleColumnCount}, ${GRID_ICON_SIZE}px)`,
          gridAutoRows: `${GRID_ICON_SIZE}px`,
          columnGap: `${GRID_GAP}px`,
          rowGap: `${GRID_GAP}px`,
          padding: `${DIALOG_PADDING / 2}px`,
        }}
      >
        {visibleIcons.map((iconKey, i) => (
          <button
            key={`iconKey-${i.toString()}`}
            type="button"
            aria-label={iconKey}
            onClick={() => onSelectIcon(iconKey)}
            className="flex h-[50px] w-[50px] items-center justify-center"
          >
            <IconV2 iconKey={iconKey} />
          </button>
        ))}
      </div>
    </div>
  );
}
