"use client"
import React from 'react'
import { cn } from '@/utils/tailwind'

type Item = { value: string; label: string }

export type MenuSelectProps = {
  items: Item[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  menuClassName?: string
  label?: string
  footerAction?: { label: string; onClick: () => void }
  disabled?: boolean
  maxListHeight?: number
}

export default function MenuSelect({
  items,
  value,
  onChange,
  placeholder = 'Select…',
  className,
  menuClassName,
  label,
  footerAction,
  disabled,
  maxListHeight = 256,
}: MenuSelectProps) {
  const [open, setOpen] = React.useState(false)
  const btnRef = React.useRef<HTMLButtonElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const current = items.find(i => i.value === value)

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return
      const t = e.target as Node
      if (btnRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  function choose(v: string) {
    onChange?.(v)
    setOpen(false)
  }

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <label className="block mb-1 font-semibold select-none">{label}</label>
      ) : null}
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className={cn(
            'w-full text-left p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none',
            disabled && 'opacity-60 cursor-not-allowed'
          )}
        >
          <span className={cn(!current && 'text-muted-foreground')}>{current?.label ?? placeholder}</span>
          <span className="float-right opacity-60">▾</span>
        </button>

        {open && (
          <div
            ref={menuRef}
            className={cn(
              'absolute left-0 right-0 mt-2 z-50 rounded-xl border-4 border-border bg-card shadow-lg overflow-hidden',
              menuClassName
            )}
            role="listbox"
          >
            <div className="overflow-auto" style={{ maxHeight: maxListHeight }}>
              {items.map((it) => (
                <button
                  key={it.value || '__empty__'}
                  type="button"
                  onClick={() => choose(it.value)}
                  className={cn(
                    'w-full text-left px-3 py-2 hover:bg-[color-mix(in_oklch,hsl(var(--card)),black_6%)]',
                    it.value === value && 'bg-[color-mix(in_oklch,hsl(var(--card)),black_8%)] font-semibold'
                  )}
                  role="option"
                  aria-selected={it.value === value}
                >
                  {it.label}
                </button>
              ))}
            </div>
            {footerAction && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    footerAction.onClick()
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[color-mix(in_oklch,hsl(var(--card)),black_6%)] text-primary-accent font-semibold"
                >
                  {footerAction.label}
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
