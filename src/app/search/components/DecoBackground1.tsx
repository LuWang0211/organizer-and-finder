import { OverlapSizer } from "@phaser/utils";
import type * as Phaser from "phaser";
import type { UIScene } from "@/app/search/scenes/UIScene";

export class DecoBackground1 {
  private scene: UIScene;
  private deco1: Phaser.GameObjects.NineSlice;

  constructor(scene: UIScene, deco1: Phaser.GameObjects.NineSlice) {
    this.scene = scene;
    this.deco1 = deco1;

    this.create();
  }

  create() {
    const viewportWidth = this.scene.scale.width;

    if (viewportWidth > 800) {
      this.createBackgroundForDesktop();
    }
  }

  createBackgroundForDesktop() {
    const sizer = new OverlapSizer(this.scene, {
      top: 0,
      centerX: true,
      centerY: true,
      width: { value: 100, type: "percent" },
      height: { value: 100, type: "pixel" },
    });

    sizer.addChild(this.deco1, {
      minWidth: this.deco1.width,
      minHeight: this.deco1.height,
      align: "center-center",
      expand: { width: true },
    });

    sizer.layout();

    this.scene.tweens.add({
      targets: this.deco1,
      alpha: 1,
      duration: 1000,
      ease: "quart.out",
      persist: false,
    });
  }
}
