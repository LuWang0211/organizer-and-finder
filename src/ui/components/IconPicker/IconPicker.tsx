"use client";

import { useImperativeHandle, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/ui/components/Dialog";
import type { HouseholdIconKey } from "../IconV2";
import {
  IconPickerCloseButton,
  IconPickerDecorations,
  IconPickerHeaderDivider,
} from "./IconPickerElements";
import { IconPickerGrid } from "./IconPickerGrid";
import { IconPickerPager } from "./IconPickerPager";
import { ICONS_LIBRARY } from "./iconPickerIcons";
import {
  type DialogBounds,
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
export type IconPickerHandle = {
  open: () => Promise<HouseholdIconKey | null>;
};

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

        {maxGridLayout ? (
          <IconPickerGrid
            layout={maxGridLayout}
            currentPage={currentPage}
            totalPages={totalPages}
            onSelectIcon={handleSelectIcon}
          />
        ) : null}

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
