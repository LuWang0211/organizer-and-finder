import prisma from "./db";
import { getSession } from "@/auth";
import { room } from "@prisma/client"



export async function fetchHouseForFamily(familyId: number) {
    try {
        const house = await prisma.house.findFirst({
            where: { familyId },
        });

        return house;
    } catch (error) {
        throw new Error('Error fetching house');
    }
}

export async function fetchRoomsForHouse(houseId: number) {
    try {
        const rooms = await prisma.room.findMany({
            where: { houseId },
        });

        return rooms;
    } catch (error) {
        throw new Error('Error fetching rooms');
    }
}

export interface RoomMetadataType {
    color: string,
    vertices: Array<{
        x: number,
        y: number
    }>
}

export async function fetchRoomForFamily(roomId: string, prismaInstance = prisma) : Promise<room | null> {
    const session = await getSession();
    try {
        const rooms = await prismaInstance.room.findMany({
            where: { familyId: session?.dbUser.familyId!,id: roomId, },
        });

        if (rooms.length > 1) {
            console.warn('Multiple rooms found for family', rooms);
        }

        return rooms[0] || null;
    } catch (error) {
        throw new Error('Error fetching rooms For family');
    }
}