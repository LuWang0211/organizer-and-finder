"use client";

import { FloorPlanScene } from "@phaser/scenes/FloorPlanScene";
import PhaserGame from "../search/Game";

export default function FloorplanPage() {
  return <PhaserGame secondSceneOverride={FloorPlanScene as any} />;
}
