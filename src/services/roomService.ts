import prisma from "./db";

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
