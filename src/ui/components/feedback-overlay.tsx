"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardDescription } from '@/ui/components/card'
import { createPortal } from 'react-dom'

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
  const gameRef = useRef<any>(null)
  const timeoutRef = useRef<number | null>(null)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  // Render overlay into body to avoid clipping by ancestor overflow/transform
  useEffect(() => {
    const host = document.createElement('div')
    host.setAttribute('data-feedback-overlay', 'true')
    document.body.appendChild(host)
    setPortalEl(host)
    return () => {
      document.body.removeChild(host)
    }
  }, [])

  useEffect(() => {
    if (!status || !containerRef.current) return
    let cancelled = false

    ;(async () => {
      // Preload image in DOM first to avoid Phaser black frame during scene preload
      const prefetch = (src: string) => new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = src
      })

      const successSrc = '/assets/animation/walking_kitten.png'
      const errorSrc = '/assets/animation/crying_kitten.png'
      const assetToLoad = status === 'success' ? successSrc : errorSrc

      await Promise.all([
        import('phaser'),
        prefetch(assetToLoad),
      ])
      const Phaser = await import('phaser')
      const { Scene, Game, AUTO } = Phaser

      const effectiveDuration = status === 'success' ? Math.round(durationMs * 2.5) : durationMs

      class SuccessScene extends Scene {
        constructor() { super('SuccessScene') }
        preload() {
          this.load.image('walking', '/assets/animation/walking_kitten.png')
        }
        create() {
          const { width, height } = this.scale
          const centerY = height / 2
          const img = this.add.image(-60, centerY, 'walking').setOrigin(0.5)

          const tex = this.textures.get('walking').getSourceImage() as HTMLImageElement
          const iw = tex.width
          const ih = tex.height
          const scale = Math.min(width * 0.6 / iw, height * 0.6 / ih, 1)
          img.setScale(scale)
          const dispW = iw * scale
          const dispH = ih * scale

          // Add a ball '⚽'
          const ballFont = Math.max(18, Math.round(dispH * 0.18))
          const baseOffsetX = dispW * 0.30
          const baseOffsetY = -dispH * 0.05
          const ball = this.add.text(img.x + baseOffsetX, img.y + baseOffsetY, '⚽', { fontSize: `${ballFont}px` })
          ball.setOrigin(0.5)

          const deltaX = width + 140
          this.tweens.add({
            targets: img,
            x: `+=${deltaX}`,
            duration: effectiveDuration,
            ease: 'Sine.easeInOut',
          })
          this.tweens.add({
            targets: img,
            y: `+=6`,
            yoyo: true,
            repeat: -1,
            duration: 180,
            ease: 'Sine.easeInOut',
          })

          // Ball jump: tween a virtual offset and apply on update so it rides the bobbing cat
          const jump = { y: 0 }
          this.tweens.add({
            targets: jump,
            y: -Math.max(12, dispH * 0.30),
            yoyo: true,
            repeat: -1,
            duration: 420,
            ease: 'Quad.easeOut',
            hold: 60,
          })
          this.events.on('update', () => {
            ball.x = img.x + baseOffsetX
            ball.y = img.y + baseOffsetY + jump.y
          })
        }
      }

      class ErrorScene extends Scene {
        constructor() { super('ErrorScene') }
        preload() {
          this.load.image('crying', '/assets/animation/crying_kitten.png')
        }
        create() {
          const { width, height } = this.scale
          const centerX = width / 2
          const centerY = height / 2

          const img = this.add.image(centerX, centerY - 10, 'crying').setOrigin(0.5)
          // Fit image into the canvas preserving aspect ratio
          const tex = this.textures.get('crying').getSourceImage() as HTMLImageElement
          const iw = tex.width
          const ih = tex.height
          const scale = Math.min(width * 0.8 / iw, height * 0.6 / ih, 1)
          img.setScale(scale)
          this.tweens.add({ targets: img, scale: scale * 1.03, yoyo: true, duration: 420, repeat: -1, ease: 'Sine.easeInOut' })
        }
      }

      const game = new Game({
        type: AUTO,
        width: containerRef.current!.clientWidth,
        height: containerRef.current!.clientHeight,
        parent: containerRef.current!,
        transparent: true,
        scene: status === 'success' ? SuccessScene : ErrorScene,
      })
      if (cancelled) {
        game.destroy(true)
        return
      }
      gameRef.current = game

      timeoutRef.current = window.setTimeout(() => {
        onDone()
      }, Math.max(900, effectiveDuration))
    })()

    return () => {
      cancelled = true
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [status, message, onDone, durationMs])

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
