import { getSession } from "@/auth";
import prisma from "./db";

export async function fetchLocationsByRoom(roomId: string, prismaInstance = prisma) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    const locations = await prismaInstance.location.findMany({
      where: { 
        roomId, 
        room: { 
          familyId: session.dbUser.familyId! 
        } 
      },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            quantity: true,
            inotherobject: true,
            otherobjectid: true,
          },
        },
      },
    });

    if (!locations) {
      throw new Error('Locations not found');
    }

    return locations;
  } catch (error) {
    console.error('Error in fetchLocationsByRoom:', error);
    throw new Error('Error fetching locations');
  }
}

export async function createLocation(roomId: string, name: string, prismaInstance = prisma) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    // Create location ID as roomId + name
    const id = `${roomId}_${name}`;

    const location = await prismaInstance.location.create({
      data: {
        id,
        name,
        roomId,
        familyId: session.dbUser.familyId!,
      },
    });

    return location;
  } catch (error) {
    console.error('Error in createLocation:', error);
    throw new Error('Error creating location');
  }
}
