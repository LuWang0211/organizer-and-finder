import { Scene } from 'phaser'

export type FeedbackAnimationType = 'success' | 'error'

/**
 * Single Scene that handles both success and error animations.
 * Receives events to switch between animations dynamically.
 */
export class FeedbackScene extends Scene {
  private updateListener?: () => void

  constructor() {
    super('FeedbackScene')
  }

  preload() {
    // Phaser's built-in preload mechanism - no manual prefetch needed
    this.load.image('walking', '/assets/animation/walking_kitten.png')
    this.load.image('crying', '/assets/animation/crying_kitten.png')
  }

  create() {
    // Listen for animation trigger events from the React component
    this.events.on('play-animation', this.playAnimation, this)
  }

  playAnimation(data: { type: FeedbackAnimationType; durationMs: number }) {
    // Clear any existing animations and objects
    this.tweens.killAll()
    this.children.removeAll()

    // Remove previous update listener if exists
    if (this.updateListener) {
      this.events.off('update', this.updateListener)
      this.updateListener = undefined
    }

    // Create the appropriate animation based on type
    if (data.type === 'success') {
      this.createSuccessAnimation(data.durationMs)
    } else {
      this.createErrorAnimation()
    }
  }

  private createSuccessAnimation(durationMs: number) {
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

    const effectiveDuration = Math.round(durationMs * 2.5)
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

    // Store update listener so we can remove it later
    this.updateListener = () => {
      ball.x = img.x + baseOffsetX
      ball.y = img.y + baseOffsetY + jump.y
    }
    this.events.on('update', this.updateListener)
  }

  private createErrorAnimation() {
    const { width, height } = this.scale
    const centerX = width / 2
    const centerY = height / 2

    const img = this.add.image(centerX, centerY - 10, 'crying').setOrigin(0.5)

    const tex = this.textures.get('crying').getSourceImage() as HTMLImageElement
    const iw = tex.width
    const ih = tex.height
    const scale = Math.min(width * 0.8 / iw, height * 0.6 / ih, 1)
    img.setScale(scale)

    this.tweens.add({
      targets: img,
      scale: scale * 1.03,
      yoyo: true,
      duration: 420,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  shutdown() {
    this.events.off('play-animation')
    if (this.updateListener) {
      this.events.off('update', this.updateListener)
      this.updateListener = undefined
    }
    this.tweens.killAll()
    this.children.removeAll()
  }
}
