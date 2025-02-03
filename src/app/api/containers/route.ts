import { NextResponse } from 'next/server';
import { fetchContainersByRoom } from '@/services/containerService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    try {
        const containers = await fetchContainersByRoom(roomId);
        // console.log("Containers:", containers);
        return NextResponse.json(containers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch containers" }, { status: 500 });
    }
}
