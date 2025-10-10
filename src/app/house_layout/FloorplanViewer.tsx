"use client";

import dynamic from "next/dynamic";
import type { HouseDef, RoomDef } from "./common";

interface FloorPlanViewerProps {
  houseDef: HouseDef;
  isPanelOpen: boolean;
  roomDefs: RoomDef[];
  className?: string;
}

const DynamicFloorplanViewerGame = dynamic(
  () => import("./FloorplanViewerGame"),
  { ssr: false },
);

export default function FloorplanViewer(props: FloorPlanViewerProps) {
  return <DynamicFloorplanViewerGame {...props} />;
}
