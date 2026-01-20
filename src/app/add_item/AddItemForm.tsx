"use client";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePrevious } from "react-use";
import { Button } from "@/ui/components/Button";
import {
  ControlledPopover,
  type ControlledPopoverRef,
} from "@/ui/components/ControlledPopover";
import FeedbackOverlay, {
  type FeedbackOverlayRef,
} from "@/ui/components/FeedbackOverlay/FeedbackOverlay";
import { Icon } from "@/ui/components/Icon";
import MenuSelect from "@/ui/components/MenuSelect";
import { type IconKey, ITEM_ICON_OPTIONS } from "@/ui/iconPresets";

type LocationOption = { id: string; name: string };

type ActionResult = { ok: true } | { ok: false; error: string };

export default function AddItemForm({
  locations,
  action,
  defaultLocationId,
}: {
  locations: LocationOption[];
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  defaultLocationId?: string;
}) {
  const [qty, setQty] = useState<number>(1);
  const [icon, setIcon] = useState<IconKey | "">("");
  const [locId, setLocId] = useState<string>(defaultLocationId || "");
  const router = useRouter();
  const [result, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(action, null);
  const overlayRef = useRef<FeedbackOverlayRef>(null);
  const prevIsPending = usePrevious(isPending);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const popoverRef = useRef<ControlledPopoverRef>(null);

  const invalidQty = useMemo(() => !Number.isFinite(qty) || qty < 1, [qty]);

  // Trigger overlay only after a pending->settled transition to avoid using stale result
  useEffect(() => {
    // If we were pending and now we are not, and we have a result, show feedback
    if (prevIsPending && !isPending && result) {
      const overlay = overlayRef.current;
      if (!overlay) return;

      (async () => {
        await overlay.open({
          message: result.ok ? "Item added successfully!" : result.error,
        });
        await overlay.playAnimation(result.ok ? "success" : "error", {
          durationMs: result.ok ? 1400 : 2000,
        });
        overlay.close();

        if (result.ok) {
          // Stay on page; reset form for quick subsequent entries
          formRef.current?.reset();
          setQty(1);
          setIcon("");
          // keep location selection
          // focus name for quick typing
          nameRef.current?.focus();
        }
      })();
    }
  }, [isPending, result, prevIsPending]);

  const nameId = useId();
  const quantityId = useId();
  const iconSelectionId = useId();

  return (
    <>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor={nameId} className="block mb-1 font-semibold">
            Name
          </label>
          <input
            id={nameId}
            name="name"
            required
            placeholder="e.g., Coffee Beans"
            ref={nameRef}
            className="w-full p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
          />
        </div>

        <div>
          <label htmlFor={quantityId} className="block mb-1 font-semibold">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <Button
              id={quantityId}
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Decrease quantity"
              className="w-12 h-12 text-xl"
              onClick={() => {
                setQty((v) => {
                  const current = Number.isFinite(v) ? (v as number) : 1;
                  if (current <= 1) {
                    popoverRef.current?.show("Minimum quantity is 1", 1600);
                    return 1;
                  }
                  return current - 1;
                });
              }}
            >
              -
            </Button>
            <ControlledPopover ref={popoverRef} variant="primary">
              <input
                name="quantity"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={1}
                step={1}
                value={Number.isFinite(qty) ? qty : ""}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setQty(
                    Number.isFinite(v)
                      ? Math.floor(v)
                      : e.target.value === ""
                        ? NaN
                        : NaN,
                  );
                }}
                className="w-24 text-center p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
              />
            </ControlledPopover>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Increase quantity"
              className="w-12 h-12 text-xl"
              onClick={() => setQty((v) => (Number.isFinite(v) ? v + 1 : 1))}
            >
              +
            </Button>
          </div>
          {invalidQty && (
            <div className="text-red-600 text-sm mt-1">
              Please enter a valid quantity of at least 1.
            </div>
          )}
        </div>

        <div>
          <MenuSelect
            label="Location Name"
            items={locations.map((l) => ({ value: l.id, label: l.name }))}
            value={locId}
            onChange={(v) => setLocId(v)}
            maxListHeight={150}
            footerAction={{
              label: "➕ Add new location",
              onClick: () => router.push("/add_location"),
            }}
          />
          {/* Keep a hidden input so server action receives the value */}
          <input type="hidden" name="locationId" value={locId} />
        </div>

        <div>
          <label htmlFor={iconSelectionId} className="block mb-1 font-semibold">
            Icon (optional)
          </label>
          <div className="flex items-center gap-3">
            <select
              id={iconSelectionId}
              name="icon"
              value={icon}
              onChange={(e) => setIcon((e.target.value as IconKey) || "")}
              className="p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
            >
              <option value="">No icon</option>
              {ITEM_ICON_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="min-w-[64px]">
              <Icon
                variant="secondary"
                size="default"
                iconKey={icon || undefined}
              />
            </div>
          </div>
        </div>

        {/* Keep a sane quantity value server-side too */}
        <input
          type="hidden"
          name="__qty_fallback"
          value={invalidQty ? "1" : String(qty)}
        />

        <div className="pt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => history.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isPending || invalidQty}
          >
            {isPending ? "Saving…" : "Save Item"}
          </Button>
        </div>
      </form>
      <FeedbackOverlay ref={overlayRef} />
    </>
  );
}
