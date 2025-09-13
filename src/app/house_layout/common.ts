import { RoomMetadataType } from "@/services/roomService";
import { room as RoomPrismaType} from "@prisma/client"

export interface HouseDef {
    name: string;
    floorplanPicture: string,
    width: number,
    height: number
}

export type RoomDef = RoomMetadataType & Pick<RoomPrismaType, 'id' | 'name'>

export enum ViewerMode {
    Fullscreen = 'fullscreen',
    Folded = 'folded',
}
