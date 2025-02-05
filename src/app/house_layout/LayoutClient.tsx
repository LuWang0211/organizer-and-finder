"use client";
import LoftFloorplan from "./LoftFloorplan";
import { Suspense, useState } from "react";
import { cn } from "@/utils/tailwind";

export default function Layout( { children }: { children: React.ReactNode }) {

    const [fullScreenView, setFullScreenView] = useState(true);

    return <div className={cn("w-full h-lvh grid", {
        "grid-cols-2": !fullScreenView,
        "grid-cols-1 grid-rows-1": fullScreenView,
    })}>
        <Suspense>
            <LoftFloorplan className="row-span-2" isFolded={!fullScreenView} onFold={(isFolded => setFullScreenView(!isFolded))} />
        </Suspense>
        
        {!fullScreenView && children}
    </div>;
}