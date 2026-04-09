import prisma from "@/services/db";

export async function fetchUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      family: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function fetchRoomCountForFamily(familyId: number) {
  return prisma.room.count({
    where: { familyId },
  });
}

export async function fetchLocationCountForFamily(familyId: number) {
  return prisma.location.count({
    where: { familyId },
  });
}

export async function fetchItemCountForFamily(familyId: number) {
  return prisma.item.count({
    where: {
      location: {
        familyId,
      },
    },
  });
}
