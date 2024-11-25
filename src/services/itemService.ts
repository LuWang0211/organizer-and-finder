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

export async function fetchItemsByContainer(locationid: number, prismaInstance = prisma) {
  try {
    const session = await getSession();
    
    return await prismaInstance.item.findMany({
      where: { locationid, location: { room: { familyId: session?.dbUser.familyId! } } },
      select: { id: true, name: true, quantity: true, inotherobject: true, otherobjectid: true },
    });
  } catch (error) {
    throw new Error('Error fetching items');
  }
}