"use client";

import PhaserGame from "@phaser/Game";

import { FloorPlanScene } from "@/app/floorplan/scenes/FloorPlanScene";

export default function FloorplanPage() {
  return <PhaserGame secondSceneOverride={FloorPlanScene as any} />;
}
