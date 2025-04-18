"use client";

import { useContext, useEffect } from "react";
import { LocationSelectionContext } from "./LocationSelectionContext";
import { usePathname } from "next/navigation";

export default function SelectedLocation() {
    const { SelectedLocation, setSelectedLocation } = useContext(LocationSelectionContext);
    const pathname = usePathname();

    useEffect(() => {
        const parts = pathname.split("/");
        if (parts.length > 3) {
            setSelectedLocation(parts[3]);
        }
    }, [pathname, setSelectedLocation]);
    
    return (
        <div className="text-center text-2xl py-2 font-bold bg-gray-500 flex justify-center">
            {SelectedLocation ? `${SelectedLocation} is now selected` : "No location is selected"}
        </div>
    );
}