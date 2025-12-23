"use client";

import PhaserGame from "../phaserui/Game";
import { FloorPlanScene } from "../phaserui/scenes/FloorPlanScene";

export default function FloorplanPage() {
  return <PhaserGame secondSceneOverride={FloorPlanScene as any} />;
}
