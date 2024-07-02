// src/app/api/items/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET() {
  try {
    const items = await prisma.item.findMany();
    
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error fetching items', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const newItem = await prisma.item.create({
      data: { name },
    });
    return new Response(JSON.stringify(newItem), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    return new Response('Error creating item', { status: 500 });
  }
}
