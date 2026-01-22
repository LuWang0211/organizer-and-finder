import type { ProfileData } from "@/app/profile/types";
import prisma from "@/services/db";

export async function fetchProfileData(userId: number): Promise<ProfileData> {
  // Fetch user with family relation
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      family: {
        include: {
          house: true,
          rooms: true,
          locations: {
            include: {
              items: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Calculate total items and rooms
  let totalItems = 0;
  let totalRooms = 0;

  if (user.family) {
    // Count all locations and their items
    const locations = await prisma.location.findMany({
      where: { familyId: user.family.id },
      include: {
        items: true,
      },
    });

    totalItems = locations.reduce((sum, loc) => sum + loc.items.length, 0);

    // Count all rooms
    totalRooms = await prisma.room.count({
      where: { familyId: user.family.id },
    });
  }

  // Get the first house if exists
  const house =
    user.family && user.family.house.length > 0
      ? { id: user.family.house[0].id, name: user.family.house[0].name }
      : null;

  return {
    user: {
      name: user.name,
      email: user.email,
      username: user.username,
    },
    family: user.family ? { id: user.family.id, name: user.family.name } : null,
    house,
    stats: {
      totalItems,
      totalRooms,
    },
  };
}
