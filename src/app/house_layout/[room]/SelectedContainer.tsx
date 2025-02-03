"use client";

import { useContext } from "react";
import { ContainerSelectionContext } from "./ContainerSelectionContext";

export default function SelectedContainer() {
    const { selectedContainer } = useContext(ContainerSelectionContext);
    
    return  <div className="text-center text-2xl py-2 font-bold bg-gray-500 flex justify-center">
        {selectedContainer ? `${selectedContainer} is now selected` : "No container is selected"}
    </div>;
}