"use client";

import Link from "next/link";
import { useContext } from "react";
import { ContainerSelectionContext } from "./ContainerSelectionContext";

interface LinkWithReportProps {
    roomId: string;
    containerId: number;
    containerName: string;
}

export default function LinkWithReport({ roomId, containerId, containerName} : LinkWithReportProps) {
    const { setSelectedContainer} = useContext(ContainerSelectionContext);

    return (
        <Link className="py-2 px-4 border-b border-pink-300 text-gray-900" href={`/house_layout/${roomId}/${containerId}`}
            onClick={() => setSelectedContainer(containerName)}>
            {containerId}
        </Link>
    );
}