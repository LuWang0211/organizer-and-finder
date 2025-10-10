"use client";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/ui/components/Button";
import FeedbackOverlay, {
  type OverlayStatus,
} from "@/ui/components/FeedbackOverlay/FeedbackOverlay";
import { Icon } from "@/ui/components/Icon";
import MenuSelect from "@/ui/components/MenuSelect";
import {
  ICON_COMPONENTS,
  type IconKey,
  LOCATION_ICON_OPTIONS,
} from "@/ui/iconPresets";

type RoomOption = { id: string; name: string };

type ActionResult = { ok: true } | { ok: false; error: string };

export default function AddLocationForm({
  rooms,
  action,
  defaultRoomId,
}: {
  rooms: RoomOption[];
  action: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  defaultRoomId?: string;
}) {
  const [roomId, setRoomId] = useState<string>(
    (defaultRoomId || rooms[0]?.id) ?? "",
  );
  const [icon, setIcon] = useState<IconKey | "">("");
  const [result, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(action, null);
  const [overlay, setOverlay] = useState<OverlayStatus>(null);
  const wasPendingRef = useRef<boolean>(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const nameId = useId();
  const iconSelectionId = useId();

  useEffect(() => {
    if (isPending) {
      wasPendingRef.current = true;
      return;
    }
    if (!isPending && wasPendingRef.current && result) {
      setOverlay(result.ok ? "success" : "error");
      wasPendingRef.current = false;
    }
  }, [isPending, result]);

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        onSubmitCapture={() => {
          wasPendingRef.current = false;
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor={nameId} className="block mb-1 font-semibold">
            Name
          </label>
          <input
            id={nameId}
            name="name"
            required
            placeholder="e.g., Pantry"
            ref={nameRef}
            className="w-full p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
          />
        </div>

        <div>
          <MenuSelect
            label="Room Name"
            items={rooms.map((r) => ({ value: r.id, label: r.name }))}
            value={roomId}
            onChange={(v) => setRoomId(v)}
          />
          <input type="hidden" name="roomId" value={roomId} />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Icon (optional)</label>
          <div className="flex items-center gap-3">
            <select
              name="icon"
              value={icon}
              onChange={(e) => setIcon((e.target.value as IconKey) || "")}
              className="p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
            >
              <option value="">No icon</option>
              {LOCATION_ICON_OPTIONS.map((opt) => (
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

        <div className="pt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => history.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            Save Location
          </Button>
        </div>
      </form>
      <FeedbackOverlay
        status={overlay}
        message={!result || result.ok ? undefined : result.error}
        successMessage="Location added successfully!"
        widthPx={720}
        heightPx={260}
        onDone={() => {
          if (result?.ok) {
            formRef.current?.reset();
            setIcon("");
            // keep selected room
            nameRef.current?.focus();
          }
          setOverlay(null);
        }}
        durationMs={overlay === "success" ? 1400 : 2000}
      />
    </>
  );
}
