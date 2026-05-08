import { NextResponse } from "next/server";
import { fetchItems as fetchItemsService } from "@/services/itemService";

interface Item {
  id: number;
  name: string;
  iconKey?: string | null;
  locationName?: string | null;
}

export async function GET() {
  try {
    const items = await fetchItemsService();

    return NextResponse.json(items as Item[]);
  } catch (error) {
    console.error("API route error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}
