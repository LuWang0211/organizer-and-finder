import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    return await prismaInstance.item.findMany({
      where: { locationid },
      select: { id: true, name: true, quantity: true, inotherobject: true, otherobjectid: true },
    });
  } catch (error) {
    throw new Error('Error fetching items');
  }
}