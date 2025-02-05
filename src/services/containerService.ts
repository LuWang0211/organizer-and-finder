import { getSession } from "@/auth";
import prisma from "./db";

export async function fetchContainersByRoom(roomId: string, prismaInstance = prisma) {
  try {

    const session = await getSession();

    return await prismaInstance.location.findMany({
      where: { roomId, room: { familyId: session?.dbUser.familyId! } },
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
