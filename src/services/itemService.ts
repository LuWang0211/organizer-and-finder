import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchItems() {
  try {
    const items = await prisma.item.findMany();
    return items;
  } catch (error) {
    throw new Error('Error fetching items');
  }
}

export async function createItem(name: string) {
  try {
    const newItem = await prisma.item.create({
      data: { name },
    });
    return newItem;
  } catch (error) {
    throw new Error('Error creating item');
  }
}
