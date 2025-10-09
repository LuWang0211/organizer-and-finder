"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardDescription } from '@/ui/components/card'
import { createPortal } from 'react-dom'
import { feedbackGameManager } from './FeedbackGame'

export type OverlayStatus = 'success' | 'error' | null

export interface FeedbackOverlayProps {
  status: OverlayStatus
  message?: string
  onDone: () => void
  durationMs?: number
  successMessage?: string
  widthPx?: number
  heightPx?: number
}

export default function FeedbackOverlay({
  status,
  message,
  onDone,
  durationMs = 2400,
  successMessage,
  widthPx = 560,
  heightPx = 240,
}: FeedbackOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  const [isGameReady, setIsGameReady] = useState(false)

  // Render overlay into body to avoid clipping by ancestor overflow/transform
  // Keep portal mounted to preserve Phaser canvas between overlays
  useEffect(() => {
    const host = document.createElement('div')
    host.setAttribute('data-feedback-overlay', 'true')
    document.body.appendChild(host)
    setPortalEl(host)
    // Only remove on component unmount (not when status changes)
    return () => {
      if (document.body.contains(host)) {
        document.body.removeChild(host)
      }
    }
  }, [])

  // Initialize game when container is ready and overlay is shown
  useEffect(() => {
    if (!containerRef.current || !status) return

    let cancelled = false;

    (async () => {
      // Initialize the singleton game instance (or resize if already exists)
      await feedbackGameManager.initialize(containerRef.current!, widthPx, heightPx)

      if (!cancelled) {
        setIsGameReady(true)
      }
    })()

    return () => {
      cancelled = true
      setIsGameReady(false)
    }
  }, [status, widthPx, heightPx])

  // Play animation when game is ready and status changes
  useEffect(() => {
    if (!status || !isGameReady) return

    feedbackGameManager.playAnimation(status, durationMs, onDone)
  }, [status, isGameReady, durationMs, onDone])

  if (!status || !portalEl) return null

  const displayMessage = status === 'success' ? (successMessage ?? 'Added successfully!') : (message || 'Something went wrong')

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-[90vw]" style={{ width: widthPx }}>
        <Card className="w-full p-0 overflow-hidden" style={{ height: heightPx }}>
          <div ref={containerRef} className="w-full h-full relative">
            <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
              <CardDescription className="text-[20px] font-extrabold text-text-main">
                {displayMessage}
              </CardDescription>
            </div>
          </div>
        </Card>
      </div>
    </div>
  , portalEl)
}
