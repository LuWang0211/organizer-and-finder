import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchContainersByRoom(roomId: number, prismaInstance = prisma) {
  try {
    return await prismaInstance.location.findMany({
      where: { roomId },
      // select: { id: true, name: true },
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
  } catch (error) {
    throw new Error('Error fetching containers');
  }
}
