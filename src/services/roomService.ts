import prisma from "./db";
import { getSession } from "@/auth";

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

export async function fetchRoomsForFamily(roomId: string, prismaInstance = prisma) {
    const session = await getSession();
    try {
        // console.log("familyId, roomId", session?.dbUser.familyId, roomId);
        const rooms = await prismaInstance.room.findMany({
            where: { familyId: session?.dbUser.familyId!,id: roomId, },
        });
        return rooms;
    } catch (error) {
        throw new Error('Error fetching rooms For family');
    }
}