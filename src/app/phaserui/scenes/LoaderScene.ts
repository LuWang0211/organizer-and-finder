import { sortBy } from "lodash";
import type AnchorPlugin from "phaser3-rex-plugins/plugins/anchor-plugin";

export class LoaderScene extends Phaser.Scene {
  private sprite!: Phaser.GameObjects.Sprite;

  constructor() {
    super("LoaderScene");
  }

  create() {
    this.anims.create({
      key: "anime1",
      frames: sortBy(this.textures.get("loader").getFrameNames()).map(
        (frame) => ({ key: "loader", frame: frame }),
      ),
      frameRate: 15,
      repeat: 0,
    });

    this.sprite = this.add.sprite(0, 0, "loader").play("anime1");

    this.sprite.anims.pause();

    (this.plugins.get("rexAnchor") as AnchorPlugin)!.add(this.sprite, {
      centerX: "center",
      centerY: "center-100",
    });

    const nextScene = this.scene.manager.scenes[1];
    this.scene.manager.run(nextScene);
  }

  preload() {
    this.load.atlas(
      "loader",
      "assets/animation/loader.png",
      "assets/animation/loader.json",
    );
  }

  private getCurrentAnmiationProgress() {
    return this.sprite.anims.currentFrame!.progress;
  }

  private isAnmiationAtEnd() {
    return this.sprite.anims.currentFrame!.isLast;
  }

  private uiSceneStarted = false;

  update() {
    const nextScene = this.scene.manager.scenes[1];
    const loaderPlugin = nextScene.load;
    const progress = loaderPlugin.progress;

    // Pause the animation if the loading progress is greater than the current animation progress
    if (this.getCurrentAnmiationProgress() >= progress) {
      this.sprite.anims.pause();
    } else {
      this.sprite.anims.resume();
    }

    if (
      progress === 1 &&
      !loaderPlugin.isLoading() &&
      !this.uiSceneStarted &&
      this.isAnmiationAtEnd()
    ) {
      this.uiSceneStarted = true;

      (nextScene as any).start?.();

      this.scene.setVisible(false);
    }
  }
}
