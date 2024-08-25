// src/app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchItems, createItem } from '@services/itemService'; // Import the service functions

export async function GET() {
  try {
    const items = await fetchItems();
    return new NextResponse(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse('Error fetching items', { status: 500 });
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
