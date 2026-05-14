"use client";

import { useId } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/ui/components/Combobox";
import { cn } from "@/utils/tailwind";

type Item = { value: string; label: string };

export type MenuSelectProps = {
  items: Item[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  label?: string;
  footerAction?: { label: string; onClick: () => void };
  disabled?: boolean;
  maxListHeight?: number;
};

export default function MenuSelect({
  items,
  value,
  onChange,
  placeholder = "Select…",
  className,
  menuClassName,
  label,
  footerAction,
  disabled,
  maxListHeight = 256,
}: MenuSelectProps) {
  const menuSelectId = useId();
  const anchorRef = useComboboxAnchor();
  const current = items.find((i) => i.value === value);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={menuSelectId}
          className="block mb-1 font-semibold select-none"
        >
          {label}
        </label>
      )}
      <Combobox
        items={items}
        value={current ?? null}
        onValueChange={(item: Item | null) => {
          if (item) onChange?.(item.value);
        }}
        isItemEqualToValue={(a: Item, b: Item) => a.value === b.value}
        disabled={disabled}
      >
        <div ref={anchorRef}>
          <ComboboxInput
            id={menuSelectId}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        <ComboboxContent anchor={anchorRef} className={cn(menuClassName)}>
          <ComboboxList style={{ maxHeight: maxListHeight }}>
            {(item: Item, index: number) => (
              <ComboboxItem key={item.value} value={item} index={index}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          {footerAction && (
            <button
              type="button"
              onClick={footerAction.onClick}
              className="w-full text-left px-3 py-2 hover:bg-[color-mix(in_oklch,var(--color-card-default),black_6%)] text-primary-accent font-semibold"
            >
              {footerAction.label}
            </button>
          )}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
