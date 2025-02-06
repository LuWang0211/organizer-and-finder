"use client";

import { useContext } from "react";
import { LocationSelectionContext } from "./LocationSelectionContext";

export default function SelectedLocation() {
    const { SelectedLocation } = useContext(LocationSelectionContext);
    
    return  <div className="text-center text-2xl py-2 font-bold bg-gray-500 flex justify-center">
        {SelectedLocation ? `${SelectedLocation} is now selected` : "No location is selected"}
    </div>;
}