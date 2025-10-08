"use client"
import { useMemo, useState, useActionState, useEffect, useRef } from 'react'
import { Button } from '@/ui/components/button'
import { Icon } from '@/ui/components/icon'
import { ICON_COMPONENTS, ITEM_ICON_OPTIONS, type IconKey } from '@/ui/icon-presets'
import MenuSelect from '@/ui/components/menu-select'
import { useRouter } from 'next/navigation'
import FeedbackOverlay, { type OverlayStatus } from '@/ui/components/FeedbackOverlay/FeedbackOverlay'

type LocationOption = { id: string; name: string }

type ActionResult = { ok: true } | { ok: false; error: string }

export default function AddItemForm({
  locations,
  action,
  defaultLocationId,
}: {
  locations: LocationOption[]
  action: (prevState: ActionResult | null, formData: FormData) => Promise<ActionResult>
  defaultLocationId?: string
}) {
  const [qty, setQty] = useState<number>(1)
  const [icon, setIcon] = useState<IconKey | ''>('')
  const [locId, setLocId] = useState<string>(defaultLocationId || '')
  const router = useRouter()
  const [result, formAction, isPending] = useActionState<ActionResult | null, FormData>(action, null)
  const [overlay, setOverlay] = useState<OverlayStatus>(null)
  const wasPendingRef = useRef<boolean>(false)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const belowMinTimeoutRef = useRef<number | null>(null)
  const [triedBelowMin, setTriedBelowMin] = useState(false)

  const invalidQty = useMemo(() => !Number.isFinite(qty) || qty < 1, [qty])

  const IconPreview = icon ? ICON_COMPONENTS[icon] : null

  // When server action returns, pop overlay and navigate on success
  const onSubmitCapture: React.FormEventHandler<HTMLFormElement> = () => {
    // Track a fresh pending cycle; overlay will trigger when pending finishes
    wasPendingRef.current = false
  }

  // Trigger overlay only after a pending->settled transition to avoid using stale result
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

  // Cleanup any hint timeout on unmount
  useEffect(() => {
    return () => {
      if (belowMinTimeoutRef.current) {
        window.clearTimeout(belowMinTimeoutRef.current)
        belowMinTimeoutRef.current = null
      }
    }
  }, [])

  return (
    <>
    <form ref={formRef} action={formAction} onSubmitCapture={onSubmitCapture} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Name</label>
        <input
          name="name"
          required
          placeholder="e.g., Coffee Beans"
          ref={nameRef}
          className="w-full p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Quantity</label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Decrease quantity"
            className="w-12 h-12 text-xl"
            onClick={() => {
              setQty(v => {
                const current = Number.isFinite(v) ? (v as number) : 1
                if (current <= 1) {
                  if (belowMinTimeoutRef.current) window.clearTimeout(belowMinTimeoutRef.current)
                  setTriedBelowMin(true)
                  belowMinTimeoutRef.current = window.setTimeout(() => setTriedBelowMin(false), 1600)
                  return 1
                }
                return Math.max(1, current - 1)
              })
            }}
          >
            -
          </Button>
          <input
            name="quantity"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={1}
            step={1}
            value={Number.isFinite(qty) ? qty : ''}
            onChange={(e) => {
              const v = Number(e.target.value)
              setQty(Number.isFinite(v) ? Math.floor(v) : (e.target.value === '' ? NaN : NaN))
            }}
            className="w-24 text-center p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Increase quantity"
            className="w-12 h-12 text-xl"
            onClick={() => setQty(v => (Number.isFinite(v) ? v + 1 : 1))}
          >
            +
          </Button>
        </div>
        {(invalidQty || triedBelowMin) && (
          <div className="text-red-600 text-sm mt-1">Please enter a valid quantity of at least 1.</div>
        )}
      </div>

      <div>
        <MenuSelect
          label="Location Name"
          items={[{ value: '', label: 'Unknown Location' }, ...locations.map(l => ({ value: l.id, label: l.name }))]}
          value={locId}
          onChange={(v) => setLocId(v)}
          maxListHeight={150}
          footerAction={{ label: '➕ Add new location', onClick: () => router.push('/add_location') }}
        />
        {/* Keep a hidden input so server action receives the value */}
        <input type="hidden" name="locationId" value={locId} />
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
            {ITEM_ICON_OPTIONS.map(opt => (
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

      {/* Keep a sane quantity value server-side too */}
      <input type="hidden" name="__qty_fallback" value={invalidQty ? '1' : String(qty)} />

      <div className="pt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={() => history.back()} disabled={isPending}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={isPending || invalidQty}>
          {isPending ? 'Saving…' : 'Save Item'}
        </Button>
      </div>
    </form>
    <FeedbackOverlay
      status={overlay}
      message={!result || result.ok ? undefined : result.error}
      widthPx={1000}
      heightPx={260}
      successMessage="Item added successfully!"
      onDone={() => {
        if (result?.ok) {
          // Stay on page; reset form for quick subsequent entries
          formRef.current?.reset()
          setQty(1)
          setIcon('')
          // keep location selection
          // focus name for quick typing
          nameRef.current?.focus()
        }
        setOverlay(null)
      }}
      durationMs={overlay === 'success' ? 1400 : 2000}
    />
    </>
  )
}
