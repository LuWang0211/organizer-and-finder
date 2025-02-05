"use client";
import FloorplanViewer from "./FloorplanViewer";
import { Suspense, useState } from "react";
import { cn } from "@/utils/tailwind";
import { RoomDef } from "./common";

interface LayoutClientProps {
    floorPlanType: string;
    roomDefs: RoomDef[];
    children: React.ReactNode;
}

export default function Layout( { floorPlanType: roomType, roomDefs, children }: LayoutClientProps) {

    const [fullScreenView, setFullScreenView] = useState(true);

    return <div className={cn("w-full h-lvh grid", {
        "grid-cols-2": !fullScreenView,
        "grid-cols-1 grid-rows-1": fullScreenView,
    })}>
        <Suspense>
            <FloorplanViewer roomDefs={roomDefs} className="row-span-2" isFolded={!fullScreenView} 
                onFold={(isFolded => setFullScreenView(!isFolded))} />
        </Suspense>
        
        {!fullScreenView && children}
    </div>;
}