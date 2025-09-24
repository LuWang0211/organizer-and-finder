"use client";

import Link from "next/link";
import { useContext } from "react";
import { LocationSelectionContext } from "./LocationSelectionContext";

interface LinkWithReportProps {
    roomId: string;
    locationId: string;
    locationName: string;
    children: React.ReactNode;
}

export default function LinkWithReport({ roomId, locationId, locationName, children }: LinkWithReportProps) {
    const { setSelectedLocation } = useContext(LocationSelectionContext);

    return (
        <Link
            className="py-2 px-4 text-gray-900 wrap-anywhere"
            href={`/house_layout/${roomId}/${locationId.replace(`${roomId}_`, '')}`}
            onClick={() => setSelectedLocation(locationName)}
        >
            {children}
        </Link>
    );
}