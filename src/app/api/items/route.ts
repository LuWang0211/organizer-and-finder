// src/app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchItems, createItem, fetchItemsByLocation } from '@services/itemService'; // Import the service functions

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    try {
      // If `locationId` is provided, fetch items by that location ID
      if (locationId) {
        const items = await fetchItemsByLocation(Number(locationId));
        return NextResponse.json(items, { status: 200 });
      }

      // Otherwise, fetch all items
      const items = await fetchItems();
      return NextResponse.json(items, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Error fetching items" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const newItem = await createItem(name);
    return new NextResponse(JSON.stringify(newItem), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    return new NextResponse('Error creating item', { status: 500 });
  }
}
