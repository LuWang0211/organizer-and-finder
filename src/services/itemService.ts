import { getSession } from '@/auth';
import prisma from '@/services/db';
import type { IconKey } from '@/ui/icon-presets'

export async function fetchItems(prismaClient = prisma) {
  try {
    const items = await prismaClient.item.findMany();
    return items;
  } catch (error) {
    throw new Error('Error fetching items');
  }
}

type CreateItemOptions = {
  locationId: string  // Required - every item must have a location
  // TODO: Implement "Unknown Location" feature - create an unknown location for each room
  // Pattern: {roomId}_unknown (e.g., "kitchen_unknown")
  // Need to: 1) Create migration/seed for existing rooms, 2) Auto-create on new room creation
  icon?: IconKey
  quantity?: number
}

export async function createItem(
  name: string,
  options: CreateItemOptions,
  prismaClient = prisma
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    // locationId is now required - throw error if missing
    if (!options?.locationId) {
      throw new Error('Location ID is required for creating an item');
    }

    // ALWAYS verify the user has permission to add item to this location
    const location = await prismaClient.location.findFirst({
      where: {
        id: options.locationId,
        familyId: session.dbUser.familyId!,
      },
    });

    if (!location) {
      throw new Error('Location not found or you do not have permission to add items to this location');
    }

    const newItem = await prismaClient.item.create({
      data: {
        name,  // Keep original user input for display
        locationid: options.locationId,  // Always required
        quantity: typeof options?.quantity === 'number' ? options?.quantity : undefined,
        iconKey: options?.icon ?? undefined,
      },
    });
    return newItem;
  } catch (error) {
    // Re-throw specific errors with their original messages
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error creating item');
  }
}

export async function fetchItemsByLocation(locationid: string, roomName?: string, prismaInstance = prisma) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    // If roomName is provided, construct the location ID
    const locationId = roomName ? `${roomName}_${locationid}` : locationid;
    
    const results = await prismaInstance.item.findMany({
      where: { locationid: locationId, location: { room: { familyId: session?.dbUser.familyId! } } },
      select: { id: true, name: true, quantity: true, inotherobject: true, otherobjectid: true, iconKey: true },
    });
    const resultTyped = (results ?? []).map(({ iconKey, ...otherProps }) => 
      ({
        iconKey: iconKey as IconKey | null,
        ...otherProps
      })
    );
    return resultTyped;
  } catch (error) {
    throw new Error('Error fetching items');
  }
}

export type ItemType = Awaited<ReturnType<typeof fetchItemsByLocation>>[0];
