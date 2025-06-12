export interface HouseDef {
    name: string;
    floorplanPicture: string,
    width: number,
    height: number
}

export interface RoomDef {
    id: string;
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
}
