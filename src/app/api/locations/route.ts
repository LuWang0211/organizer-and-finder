import { NextResponse } from 'next/server';
import { fetchLocationsByRoom } from '@/services/locationService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    try {
        const locations = await fetchLocationsByRoom(roomId);
        return NextResponse.json(locations);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
