import type { room as RoomPrismaType } from "@prisma/client";
import type { RoomMetadataType } from "@/services/roomService";

export interface HouseDef {
  name: string;
  floorplanPicture: string;
  width: number;
  height: number;
}

export type RoomDef = RoomMetadataType & Pick<RoomPrismaType, "id" | "name">;

export enum ViewerMode {
  Fullscreen = "fullscreen",
  Folded = "folded",
}
