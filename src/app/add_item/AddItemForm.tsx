"use client";

import { useRouter } from "next/navigation";
import {
  useActionState,
  useCallback,
  useEffect,
  useId,
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
import IconSelector from "@/ui/components/IconSelector";
import type { HouseholdIconKey } from "@/ui/components/IconV2";
import MenuSelect from "@/ui/components/MenuSelect";

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
  const [icon, setIcon] = useState<HouseholdIconKey | null>(null);
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

  useEffect(() => {
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
          formRef.current?.reset();
          setQty(1);
          setIcon(null);
          nameRef.current?.focus();
        }
      })();
    }
  }, [isPending, prevIsPending, result]);

  const nameId = useId();
  const quantityId = useId();
  const iconSelectionId = useId();

  const validateQuantity = useCallback((value: number) => {
    if (!Number.isFinite(value) || value < 1) {
      popoverRef.current?.show(
        "Please enter a valid quantity of at least 1",
        2000,
      );
      return false;
    }

    return true;
  }, []);

  const handleInvalid = useCallback(
    (e: React.InvalidEvent<HTMLInputElement>) => {
      e.preventDefault();
      validateQuantity(qty);
    },
    [qty, validateQuantity],
  );

  return (
    <>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor={nameId} className="mb-1 block font-semibold">
            Name
          </label>
          <input
            id={nameId}
            name="name"
            required
            placeholder="e.g., Coffee Beans"
            ref={nameRef}
            className="w-full p-3 rounded-xl border-4 border-border bg-card-default text-foreground outline-none"
          />
        </div>

        <div>
          <label htmlFor={quantityId} className="mb-1 block font-semibold">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <Button
              id={quantityId}
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Decrease quantity"
              className="h-12 w-12 text-xl"
              onClick={() => {
                setQty((value) => {
                  const current = Number.isFinite(value) ? value : 1;
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
                  const value = Number(e.target.value);
                  setQty(
                    Number.isFinite(value)
                      ? Math.floor(value)
                      : e.target.value === ""
                        ? NaN
                        : NaN,
                  );
                }}
                onInvalid={handleInvalid}
                className="w-24 text-center p-3 rounded-xl border-4 border-border bg-card-default text-foreground outline-none"
              />
            </ControlledPopover>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Increase quantity"
              className="h-12 w-12 text-xl"
              onClick={() => {
                setQty((value) => value + 1);
              }}
            >
              +
            </Button>
          </div>
        </div>

        <div>
          <MenuSelect
            label="Location Name"
            items={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            value={locId}
            onChange={(value) => setLocId(value)}
            maxListHeight={150}
            footerAction={{
              label: "➕ Add new location",
              onClick: () => router.push("/add_location"),
            }}
          />
          <input type="hidden" name="locationId" value={locId} />
        </div>

        <div className="flex flex-row justify-start items-center gap-4">
          <label htmlFor={iconSelectionId} className="mb-1 block font-semibold">
            Icon (optional)
          </label>
          <div className="flex items-center gap-3 flex-1">
            <IconSelector
              id={iconSelectionId}
              iconKey={icon}
              onIconKeyChange={setIcon}
            />
            <input type="hidden" name="icon" value={icon ?? ""} />
          </div>
        </div>

        <input
          type="hidden"
          name="__qty_fallback"
          value={!Number.isFinite(qty) || qty < 1 ? "1" : String(qty)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => history.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Saving…" : "Save Item"}
          </Button>
        </div>
      </form>
      <FeedbackOverlay ref={overlayRef} />
    </>
  );
}
