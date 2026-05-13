import { HeadlessLoaderScene } from "@phaser/scenes/HeadlessLoaderScene";
import { LoaderScene } from "@phaser/scenes/LoaderScene";
import { hasSeenSharedLoader } from "@phaser/sharedLoaderSession";

const skipAnimatedLoadingScreen = Boolean(
  process.env.NEXT_PUBLIC_SKIP_FULL_LOADING_SCREEN,
);

export function getSharedLoadingScene() {
  if (skipAnimatedLoadingScreen) {
    return HeadlessLoaderScene;
  }

  if (typeof window === "undefined") {
    return LoaderScene;
  }

  return hasSeenSharedLoader() ? HeadlessLoaderScene : LoaderScene;
}
