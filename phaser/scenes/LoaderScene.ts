import { markSharedLoaderSeen } from "@phaser/sharedLoaderSession";
import { applyAnchor } from "@phaser/utils";
import { sortBy } from "lodash";
import * as Phaser from "phaser";

export class LoaderScene extends Phaser.Scene {
  private sprite!: Phaser.GameObjects.Sprite;
  private nextScene!: Phaser.Scene;
  private animationFinished = false;
  private createAt = 0;
  private readonly minimumVisibleDurationMs = 3200;

  constructor() {
    super("LoaderScene");
  }

  create() {
    this.createAt = this.time.now;
    const frameNames = sortBy(this.textures.get("loader").getFrameNames()).map(
      (frame) => `${frame}`,
    );

    this.anims.create({
      key: "loader-anime",
      frames: frameNames.map((frame) => ({ key: "loader", frame })),
      duration: this.minimumVisibleDurationMs,
      repeat: 0,
    });

    this.sprite = this.add.sprite(0, 0, "loader", frameNames[0]);

    applyAnchor(this.sprite, this, {
      centerX: true,
      centerY: true,
      offsetY: -100,
    });

    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.animationFinished = true;
    });
    this.sprite.play("loader-anime");

    const nextScene = this.scene.manager.scenes[1];
    this.nextScene = nextScene;
    this.scene.manager.run(nextScene);
    this.scene.bringToTop("LoaderScene");
  }

  preload() {
    this.load.atlas(
      "loader",
      "/assets/animation/loader.png",
      "/assets/animation/loader.json",
    );
  }

  private shapeAnimationToProgress(progress: number) {
    const easedProgress = Phaser.Math.Easing.Cubic.Out(
      Phaser.Math.Clamp(progress, 0, 1),
    );

    this.sprite.anims.timeScale = Phaser.Math.Linear(0.7, 1.25, easedProgress);
  }

  private uiSceneStarted = false;

  update() {
    const nextScene = this.nextScene;
    const loaderPlugin = nextScene.load;
    const progress = loaderPlugin.progress;
    this.shapeAnimationToProgress(progress);

    if (
      progress >= 1 &&
      !loaderPlugin.isLoading() &&
      this.time.now - this.createAt >= this.minimumVisibleDurationMs &&
      this.animationFinished &&
      !this.uiSceneStarted
    ) {
      this.uiSceneStarted = true;

      markSharedLoaderSeen();
      (nextScene as any).start?.();
      this.scene.setVisible(false);
    }
  }
}
