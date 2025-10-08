import type { Game } from 'phaser'
import type { FeedbackScene, FeedbackAnimationType } from './FeedbackScene'

/**
 * Singleton manager for the Phaser feedback animation game.
 * Maintains a single Game instance with one Scene that handles both animations.
 * The React component sends events to trigger which animation to play.
 */
class FeedbackGameManager {
  private game: Game | null = null
  private scene: FeedbackScene | null = null
  private timeoutId: number | null = null

  /**
   * Initialize the Phaser game. Only creates the game once; subsequent calls update dimensions.
   * Must be called from client-side only (browser environment).
   */
  async initialize(container: HTMLElement, width: number, height: number) {
    if (this.game) {
      // Already initialized, re-parent canvas to new container and resize
      const canvas = this.game.canvas
      if (canvas && canvas.parentElement !== container) {
        container.appendChild(canvas)
      }
      this.game.scale.resize(width, height)
      return
    }

    // Dynamic import to avoid SSR issues
    const [PhaserModule, { FeedbackScene }] = await Promise.all([
      import('phaser'),
      import('./FeedbackScene')
    ])

    const { Game } = PhaserModule
    const Phaser = PhaserModule.default || PhaserModule

    // Create single Game instance with FeedbackScene
    this.game = new Game({
      type: Phaser.AUTO,
      width,
      height,
      parent: container,
      transparent: true,
      scene: FeedbackScene,
    })

    // Wait for game to be ready before returning
    return new Promise<void>((resolve) => {
      this.game!.events.once('ready', () => {
        this.scene = this.game!.scene.getScene('FeedbackScene') as FeedbackScene

        // Wait for the scene's create() to complete before resolving
        if (this.scene) {
          this.scene.events.once('create', () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Send event to Scene to play the specified animation type.
   * The Scene handles switching between success/error animations.
   */
  playAnimation(
    type: FeedbackAnimationType,
    durationMs: number,
    onComplete: () => void
  ) {
    if (!this.scene) {
      console.warn('[FeedbackGame] FeedbackScene not ready yet')
      return
    }

    // Clear any existing timeout
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    // Send event notification to Scene to trigger the animation
    this.scene.events.emit('play-animation', { type, durationMs })

    // Set timeout for completion callback
    const effectiveDuration = type === 'success' ? Math.round(durationMs * 2.5) : durationMs
    this.timeoutId = window.setTimeout(() => {
      onComplete()
      this.timeoutId = null
    }, Math.max(900, effectiveDuration))
  }

  /**
   * Resize the game canvas. Used when overlay dimensions change.
   */
  resize(width: number, height: number) {
    if (this.game) {
      this.game.scale.resize(width, height)
    }
  }

  /**
   * Clean up resources. Should only be called when completely done with feedback overlays.
   */
  destroy() {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    if (this.game) {
      this.game.destroy(true)
      this.game = null
      this.scene = null
    }
  }
}

// Singleton instance - one Game for the entire application
export const feedbackGameManager = new FeedbackGameManager()
