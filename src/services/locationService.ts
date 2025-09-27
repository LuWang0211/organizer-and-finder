import { getSession } from "@/auth";
import prisma from "./db";
import type { IconKey } from "@/ui/icon-presets";

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

export async function fetchAllLocationsForCurrentUser(prismaInstance = prisma) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    const locations = await prismaInstance.location.findMany({
      where: {
        familyId: session.dbUser.familyId!,
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return locations;
  } catch (error) {
    console.error('Error in fetchAllLocationsForCurrentUser:', error);
    throw new Error('Error fetching locations');
  }
}

type PrismaLike = { location: { create: Function } }
type CreateLocationOptions = { icon?: IconKey }

export async function createLocation(
  roomId: string,
  name: string,
  arg3?: CreateLocationOptions | PrismaLike,
  arg4?: PrismaLike
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    const looksLikePrisma = (v: any): v is PrismaLike => !!v && typeof v === 'object' && 'location' in v
    const prismaInstance = looksLikePrisma(arg3) ? arg3 : (arg4 ?? prisma)
    const _options: CreateLocationOptions | undefined = looksLikePrisma(arg3) ? undefined : arg3

    // Replace spaces with underscores in the name
    const formattedName = name.replace(/\s+/g, '_');
    const id = `${roomId}_${formattedName}`;

    const location = await prismaInstance.location.create({
      data: {
        id,
        name: formattedName,  // Use the formatted name here
        roomId,
        familyId: session.dbUser.familyId!,
        iconKey: _options?.icon ?? undefined,
      },
    });

    return location;
  } catch (error) {
    console.error('Error in createLocation:', error);
    throw new Error('Error creating location');
  }
}

export type LocationType = Awaited<ReturnType<typeof fetchLocationsByRoom>>[0];
