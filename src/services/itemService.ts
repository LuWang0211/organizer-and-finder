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

type PrismaLike = { item: { create: Function } }

type CreateItemOptions = {
  locationId?: string
  icon?: IconKey
  quantity?: number
}

export async function createItem(
  name: string,
  arg2?: CreateItemOptions | PrismaLike,
  arg3?: PrismaLike
) {
  const looksLikePrisma = (v: any): v is PrismaLike => !!v && typeof v === 'object' && 'item' in v

  const prismaClient = looksLikePrisma(arg2) ? arg2 : (arg3 ?? prisma)
  const options: CreateItemOptions | undefined = looksLikePrisma(arg2) ? undefined : arg2

  try {
    // Replace spaces with underscores in the name
    const formattedName = name.replace(/\s+/g, '_');
    
    const newItem = await prismaClient.item.create({
      data: {
        name: formattedName,
        // Persist location if provided; icon is accepted for future use
        locationid: options?.locationId ?? undefined,
        quantity: typeof options?.quantity === 'number' ? options?.quantity : undefined,
        iconKey: options?.icon ?? undefined,
      },
    });
    return newItem;
  } catch (error) {
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
