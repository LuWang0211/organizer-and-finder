import { getSharedLoadingScene } from "@phaser/loadingScene";
import AnchorPlugin from "phaser3-rex-plugins/plugins/anchor-plugin";
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { UIScene } from "@/app/search/scenes/UIScene";

export function createConfig(secondScene?: Phaser.Types.Scenes.SceneType) {
  const scene: Phaser.Types.Scenes.SceneType[] = [getSharedLoadingScene()];

  if (secondScene) {
    scene.push(secondScene);
  }
  
  return {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    transparent: true,
    scene,
    dom: {
      createContainer: true,
    },
    scale: {
      mode: Phaser.Scale.NONE,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 300 },
        debug: false,
      },
    },
    // ...
    plugins: {
      scene: [
        {
          key: "rexUI",
          plugin: UIPlugin,
          mapping: "rexUI",
        },
      ],

      global: [
        {
          key: "rexInputTextPlugin",
          plugin: InputTextPlugin,
          start: true,
        },
        {
          key: "rexAnchor",
          plugin: AnchorPlugin,
          start: true,
        },
      ],
    },
  };
}
