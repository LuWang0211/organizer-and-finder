"use client";

import { useCallback, useId, useRef } from "react";
import { Icon } from "@/ui/components/Icon";
import IconPicker, {
  type IconPickerHandle,
} from "@/ui/components/IconPicker/IconPicker";
import { type HouseholdIconKey, IconV2 } from "@/ui/components/IconV2";

type IconSelectorProps = {
  iconKey?: HouseholdIconKey | null;
  id?: string;
  onIconKeyChange: (iconKey: HouseholdIconKey | null) => void;
};

export default function IconSelector({
  iconKey = null,
  id,
  onIconKeyChange,
}: IconSelectorProps) {
  const fallbackId = useId();
  const iconPickerRef = useRef<IconPickerHandle>(null);
  const resolvedId = id ?? fallbackId;

  const handleOpenIconPicker = useCallback(async () => {
    const selectedIcon = await iconPickerRef.current?.open();

    if (selectedIcon) {
      onIconKeyChange(selectedIcon);
    }
  }, [onIconKeyChange]);

  const handleClearIcon = useCallback(() => {
    onIconKeyChange(null);
  }, [onIconKeyChange]);

  return (
    <>
      <div className="relative inline-flex">
        <button
          id={resolvedId}
          type="button"
          onClick={handleOpenIconPicker}
          className="cursor-pointer relative rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-highlight"
          aria-label={iconKey ? "Change selected icon" : "Choose an icon"}
        >
          <IconV2 iconKey={iconKey || undefined} aria-hidden="true" />
        </button>
        {iconKey ? (
          <button
            type="button"
            onClick={handleClearIcon}
            className="cursor-pointer absolute right-[calc(var(--spacing)_*-2.5)] -top-2 z-10 rounded-full outline-none focus-visible:ring-2 scale-75"
            aria-label="Remove selected icon"
          >
            <Icon
              iconKey="cancel"
              variant="primary"
              size="tiny"
              border="none"
            />
          </button>
        ) : null}
      </div>
      <IconPicker ref={iconPickerRef} />
    </>
  );
}
