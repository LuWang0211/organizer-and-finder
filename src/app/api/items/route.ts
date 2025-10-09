// src/app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchItems, createItem, fetchItemsByLocation } from '@services/itemService'; // Import the service functions

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    const roomName = searchParams.get('roomName');

    try {
      // If `locationId` is provided, fetch items by that location ID
      if (locationId) {
        const items = await fetchItemsByLocation(locationId, roomName || undefined);
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
    const body = await request.json();
    const { name, locationId, icon, quantity } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Name is required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!locationId || typeof locationId !== 'string' || locationId.trim().length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Location ID is required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create item with required locationId - this will validate permissions
    const newItem = await createItem(name.trim(), {
      locationId: locationId.trim(),
      icon: icon || undefined,
      quantity: typeof quantity === 'number' && quantity > 0 ? quantity : undefined,
    });

    return new NextResponse(JSON.stringify(newItem), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    // Return specific error messages from the service layer
    const errorMessage = error instanceof Error ? error.message : 'Error creating item';
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
