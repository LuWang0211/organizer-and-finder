"use client";

import { useImperativeHandle, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/ui/components/Dialog";
import { cn } from "@/utils/tailwind";
import { Icon } from "../Icon";
import {
  HOUSEHOLD_ICON_IMAGES,
  type HouseholdIconKey,
  IconV2,
} from "../IconV2";
import {
  IconPickerCloseButton,
  IconPickerDecorations,
  IconPickerHeaderDivider,
} from "./IconPickerElements";
import { DIALOG_PADDING, GRID_GAP, GRID_ICON_SIZE } from "./iconPickerLayout";
import {
  type DialogBounds,
  type IconGridLayout,
  resolveMaxDialogLayout,
  useIconPickerCapacity,
} from "./useIconPickerCapacity";

const DIALOG_MAX_VIEWPORT_RATIO = 0.8;

function getClosestAspectRatio(viewportRatio: number) {
  const fourByThree = 4 / 3;
  const sixteenByNine = 16 / 9;

  return Math.abs(viewportRatio - fourByThree) <=
    Math.abs(viewportRatio - sixteenByNine)
    ? fourByThree
    : sixteenByNine;
}

function getDialogLayout(): DialogBounds {
  if (typeof window === "undefined") {
    return {
      maxWidth: 580,
      maxHeight: 435,
      aspectRatio: 4 / 3,
    };
  }

  return {
    maxWidth: Math.floor(window.innerWidth * DIALOG_MAX_VIEWPORT_RATIO),
    maxHeight: Math.floor(window.innerHeight * DIALOG_MAX_VIEWPORT_RATIO),
    aspectRatio: getClosestAspectRatio(window.innerWidth / window.innerHeight),
  };
}

const ICONS_LIBRARY = Object.keys(HOUSEHOLD_ICON_IMAGES) as HouseholdIconKey[];

export type IconPickerHandle = {
  open: () => Promise<HouseholdIconKey | null>;
};

function IconPickerPager({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <div
      className={cn("flex items-center justify-center gap-3", {
        hidden: totalPages <= 1,
      })}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={isFirstPage}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
          {
            "cursor-not-allowed": isFirstPage,
          },
        )}
      >
        <Icon
          iconKey="arrow-left"
          size="sm"
          variant={isFirstPage ? "default" : "highlight"}
        />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const isCurrentPage = i === currentPage;

          return (
            <button
              key={`page-${i + 1}`}
              type="button"
              onClick={() => onPageChange(i)}
              className={cn(
                "h-3 rounded-full transition-all duration-300 icon-grad-highlight",
                isCurrentPage
                  ? "w-8 border border-highlight"
                  : "w-3 hover:icon-grad-primary-accent cursor-pointer",
              )}
              aria-label={`Page ${i + 1}`}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={isLastPage}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group",
          {
            "cursor-not-allowed": isLastPage,
          },
        )}
      >
        <Icon
          iconKey="arrow-right"
          size="sm"
          variant={isLastPage ? "default" : "highlight"}
        />
      </button>
    </div>
  );
}

function IconPickerGridLoader({
  layout,
  currentPage,
  totalPages,
  onSelectIcon,
}: {
  layout: IconGridLayout | null;
  currentPage: number;
  totalPages: number;
  onSelectIcon: (iconKey: HouseholdIconKey) => void;
}) {
  if (!layout) {
    return null;
  }

  return (
    <IconPickerGrid
      layout={layout}
      currentPage={currentPage}
      totalPages={totalPages}
      onSelectIcon={onSelectIcon}
    />
  );
}

function IconPickerGrid({
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

  // If there are multiple pages, we fix the grid container's width and height to prevent layout shifts during page transitions
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

export default function IconPicker({
  onClose,
  ref,
}: {
  onClose?: () => void;
  ref?: React.Ref<IconPickerHandle>;
}) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const pagerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const pendingOpenResolverRef = useRef<
    ((iconKey: HouseholdIconKey | null) => void) | null
  >(null);
  const pendingOpenPromiseRef = useRef<Promise<HouseholdIconKey | null> | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogBounds] = useState<DialogBounds>(getDialogLayout);
  const maxGridLayout = useIconPickerCapacity(dialogBounds, {
    headerRef,
    pagerRef,
    footerRef,
  });
  const maxDialogLayout = resolveMaxDialogLayout(dialogBounds);
  const totalPages = maxGridLayout
    ? Math.max(1, Math.ceil(ICONS_LIBRARY.length / maxGridLayout.iconsPerPage))
    : 0;

  function resolvePendingOpen(iconKey: HouseholdIconKey | null) {
    pendingOpenResolverRef.current?.(iconKey);
    pendingOpenResolverRef.current = null;
    pendingOpenPromiseRef.current = null;
  }

  function handleSelectIcon(iconKey: HouseholdIconKey) {
    resolvePendingOpen(iconKey);
    setIsOpen(false);
    onClose?.();
  }

  useImperativeHandle(
    ref,
    () => ({
      open() {
        if (pendingOpenPromiseRef.current) {
          return pendingOpenPromiseRef.current;
        }

        setCurrentPage(0);
        setIsOpen(true);

        const promise = new Promise<HouseholdIconKey | null>((resolve) => {
          pendingOpenResolverRef.current = resolve;
        });

        pendingOpenPromiseRef.current = promise;
        return promise;
      },
    }),
    [],
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);

        if (!open) {
          resolvePendingOpen(null);
          onClose?.();
        }
      }}
    >
      <DialogContent
        renderCloseButton={() => <IconPickerCloseButton />}
        className="min-w-1/3 w-auto flex flex-col gap-0 rounded-4xl border-none bg-linear-to-br from-[color-mix(in_oklch,white_40%,var(--color-card-default))] via-card-default to-[color-mix(in_oklch,black_10%,var(--color-card-default))] p-8 shadow-2xl before:pointer-events-none before:absolute before:inset-0 before:rounded-4xl before:border-[2.5px] before:border-solid before:border-foreground-accent before:opacity-40 after:pointer-events-none after:absolute after:inset-3 after:rounded-[28px] after:border after:border-dashed after:border-foreground-accent/30 sm:rounded-4xl"
        style={{
          maxWidth: maxDialogLayout.width,
          maxHeight: maxDialogLayout.height,
        }}
      >
        <DialogTitle className="sr-only">Choose an Icon</DialogTitle>
        <IconPickerDecorations />

        <div ref={headerRef} className="relative">
          <div className="mx-auto w-fit">
            <div className="mb-2 text-center">
              <h3 className="mb-1 text-[24px] text-foreground">
                Choose an Icon
              </h3>
              <p className="text-[14px] text-foreground-accent">
                Browse our collection of whimsical icons
              </p>
            </div>
            <IconPickerHeaderDivider />
          </div>
        </div>

        <IconPickerGridLoader
          layout={maxGridLayout}
          currentPage={currentPage}
          totalPages={totalPages}
          onSelectIcon={handleSelectIcon}
        />

        <div ref={pagerRef} className="mt-6 flex justify-center">
          {maxGridLayout ? (
            <IconPickerPager
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="flex items-center justify-center gap-3" />
          )}
        </div>

        <div ref={footerRef} className="mt-4 text-center">
          <p className="text-[11px] italic text-foreground-accent">
            Each icon carries its own little magic
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
