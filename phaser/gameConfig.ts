import { getSharedLoadingScene } from "@phaser/loadingScene";

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
  };
}
