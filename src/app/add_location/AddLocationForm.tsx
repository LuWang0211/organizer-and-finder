"use client"
import { useEffect, useRef, useState, useActionState } from 'react'
import { Button } from '@/ui/components/button'
import { Icon } from '@/ui/components/icon'
import { ICON_COMPONENTS, LOCATION_ICON_OPTIONS, type IconKey } from '@/ui/icon-presets'
import MenuSelect from '@/ui/components/menu-select'
import FeedbackOverlay, { type OverlayStatus } from '@/ui/components/feedback-overlay'

type RoomOption = { id: string; name: string }

type ActionResult = { ok: true } | { ok: false; error: string }

export default function AddLocationForm({
  rooms,
  action,
  defaultRoomId,
}: {
  rooms: RoomOption[]
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  defaultRoomId?: string
}) {
  const [roomId, setRoomId] = useState<string>((defaultRoomId || rooms[0]?.id) ?? '')
  const [icon, setIcon] = useState<IconKey | ''>('')
  const [result, formAction, isPending] = useActionState<ActionResult | null, FormData>(action, null)
  const [overlay, setOverlay] = useState<OverlayStatus>(null)
  const wasPendingRef = useRef<boolean>(false)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (isPending) {
      wasPendingRef.current = true
      return
    }
    if (!isPending && wasPendingRef.current && result) {
      setOverlay(result.ok ? 'success' : 'error')
      wasPendingRef.current = false
    }
  }, [isPending, result])

  const IconPreview = icon ? ICON_COMPONENTS[icon] : null

  return (
    <>
    <form
      ref={formRef}
      action={formAction}
      onSubmitCapture={() => { wasPendingRef.current = false }}
      className="space-y-4"
    >
      <div>
        <label className="block mb-1 font-semibold">Name</label>
        <input
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
          items={rooms.map(r => ({ value: r.id, label: r.name }))}
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
            onChange={(e) => setIcon((e.target.value as IconKey) || '')}
            className="p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
          >
            <option value="">No icon</option>
            {LOCATION_ICON_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
          <div className="min-w-[64px]">
            <Icon variant="secondary" size="default">
              {IconPreview ? <IconPreview /> : null}
            </Icon>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={() => history.back()} disabled={isPending}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={isPending}>Save Location</Button>
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
          formRef.current?.reset()
          setIcon('')
          // keep selected room
          nameRef.current?.focus()
        }
        setOverlay(null)
      }}
      durationMs={overlay === 'success' ? 1400 : 2000}
    />
    </>
  )
}
