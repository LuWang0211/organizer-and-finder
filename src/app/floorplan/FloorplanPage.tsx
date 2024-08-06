"use client";

import PhaserGame from "../phaserui/game";
import { FloorPlanScene } from "../phaserui/scenes/FloorPlanScene";

export default function FloorplanPage() {

    return <PhaserGame secondSceneOverride={FloorPlanScene as any}  />;
}