import { getSession } from '@/auth';
import prisma from '@/services/db';


export async function fetchItems(prismaClient = prisma) {
  try {
    const items = await prismaClient.item.findMany();
    return items;
  } catch (error) {
    throw new Error('Error fetching items');
  }
}

export async function createItem(name: string, prismaClient = prisma) {
  try {
    const newItem = await prismaClient.item.create({
      data: { name },
    });
    return newItem;
  } catch (error) {
    throw new Error('Error creating item');
  }
}

export async function fetchItemsByLocation(locationIdOrName: string, roomName?: string, prismaInstance = prisma) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    // If roomName is provided, construct the location ID
    const locationId = roomName ? `${roomName}_${locationIdOrName}` : locationIdOrName;
    
    return await prismaInstance.item.findMany({
      where: { 
        locationid: locationId, 
        location: { 
          room: { 
            familyId: session.dbUser.familyId! 
          } 
        } 
      },
      select: { 
        id: true, 
        name: true, 
        quantity: true, 
        inotherobject: true, 
        otherobjectid: true 
      },
    });
  } catch (error) {
    console.error('Error in fetchItemsByLocation:', error);
    throw new Error('Error fetching items');
  }
}