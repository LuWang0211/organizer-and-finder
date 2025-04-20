"use client";

import Link from "next/link";
import { useContext } from "react";
import { LocationSelectionContext } from "./LocationSelectionContext";

interface LinkWithReportProps {
    roomId: string;
    locationId: string;
    locationName: string;
}

export default function LinkWithReport({ roomId, locationId, locationName} : LinkWithReportProps) {
    const { setSelectedLocation} = useContext(LocationSelectionContext);

    return (
        <Link className="py-2 px-4 border-b border-pink-300 text-gray-900" href={`/house_layout/${roomId}/${locationId.replace(`${roomId}_`, '')}`}
            onClick={() => setSelectedLocation(locationName)}>
            {locationId}
        </Link>
    );
}