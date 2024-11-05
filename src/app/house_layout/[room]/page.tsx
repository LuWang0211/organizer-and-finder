"use client";

import Containers from "./Containers";
import Items from "./Items";
import { useEffect, useState } from 'react';

export default function Page( { params: { room } }: { params: { room: string } }) {
    // const [containers, setContainers] = useState<{ id: number; name: string; items: [] }[]>([]);
    const [containers, setContainers] = useState([]);
    const [selectedContainerId, setSelectedContainerId] = useState<number | null>(null);
    const [selectedContainerName, setSelectedContainerName] = useState<string | null>(null);
    // const [items, setItems] = useState<{ id: number; name: string; quantity: number; inotherobject: Boolean, otherobjectid: number }[]>([]);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // roomId is passed as part of the URL (e.g., /house_layout/[room]?roomId=1)
    const roomName = room; // Use room directly
    const roomId = Number(new URLSearchParams(window.location.search).get("roomId"));
    // console.log("Room Name:", roomName); // Log the room name
    // console.log("Room ID:", roomId); // Log the room ID

    useEffect(() => {
    const fetchContainers = async () => {
        try {
            const response = await fetch(`/api/containers?roomId=${roomId}`);
            if (!response.ok) throw new Error("Failed to fetch containers");
            const data = await response.json();
            setContainers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
        };
    
        if (!isNaN(roomId)) fetchContainers();
    }, [roomId]);

    const handleContainerSelect = async (containerId: number, containerName:string) => {
        setSelectedContainerId(containerId);
        setSelectedContainerName(containerName);
        // console.log("Selected Container ID:", containerId);
        // console.log("Selected Container Name:", containerName);
        setLoadingItems(true);

        try {
            const response = await fetch(`/api/items?containerId=${containerId}`);
            if (!response.ok) throw new Error("Failed to fetch items");
            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoadingItems(false);
        }
    };

    if (error) return <div>{error}</div>;

    return <>
        <Containers roomName={room} containers={containers} onSelectContainer={handleContainerSelect}/>
        <Items containerName={selectedContainerName ?? ''} items={items} loading={loadingItems}/>
    </>;
}