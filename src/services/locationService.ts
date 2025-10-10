import { getSession } from "@/auth";
import prisma from "./db";
import type { IconKey } from "@/ui/icon-presets";

export async function fetchLocationsByRoom(roomId: string) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    const locations = await prisma.location.findMany({
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
            iconKey: true,
          },
        },
      },
    });

    if (!locations) {
      throw new Error('Locations not found');
    }

    const locationsTyped = (locations ?? []).map(({ iconKey, ...otherProps }) =>
      ({
        iconKey: iconKey as IconKey | null,
        ...otherProps
      })
    );

    return locationsTyped;
  } catch (error) {
    console.error('Error in fetchLocationsByRoom:', error);
    throw new Error('Error fetching locations');
  }
}

export async function fetchLocationsForHouse(houseId: number) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    const locations = await prisma.location.findMany({
      where: {
        familyId: session.dbUser.familyId!,
        room: {
          houseId,
        },
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return locations;
  } catch (error) {
    console.error('Error in fetchLocationsForHouse:', error);
    throw new Error('Error fetching locations');
  }
}

type CreateLocationOptions = { icon?: IconKey }

export async function createLocation(
  roomId: string,
  name: string,
  options?: CreateLocationOptions
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    // Verify the user has permission to add location to this room
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        familyId: session.dbUser.familyId!,
      },
    });

    if (!room) {
      throw new Error('Room not found or you do not have permission to add locations to this room');
    }

    // Format only the ID, keep the display name as user input
    const formattedIdPart = name.replace(/\s+/g, '_');
    const id = `${roomId}_${formattedIdPart}`;

    const location = await prisma.location.create({
      data: {
        id,
        name,  // Keep original user input for display
        roomId,
        familyId: session.dbUser.familyId!,
        iconKey: options?.icon ?? undefined,
      },
    });

    return location;
  } catch (error) {
    console.error('Error in createLocation:', error);
    throw new Error('Error creating location');
  }
}

export type LocationType = Awaited<ReturnType<typeof fetchLocationsByRoom>>[0];
