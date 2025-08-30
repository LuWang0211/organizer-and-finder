"use client";
import FloorplanViewer from "./FloorplanViewer";
import { Suspense, useState, useEffect } from "react";
import { cn } from "@/utils/tailwind";
import { HouseDef, RoomDef } from "./common";
import { Icon } from '@iconify-icon/react';
import menuFoldLeft from '@iconify-icons/line-md/menu-fold-left';
import menuUnFoldRight from '@iconify-icons/line-md/menu-unfold-right';
import { usePathname } from "next/navigation";

interface LayoutClientProps {
    houseDef: HouseDef;
    roomDefs: RoomDef[];
    children: React.ReactNode;
}

export default function Layout( { houseDef, roomDefs, children }: LayoutClientProps) {
    const pathname = usePathname();
    
    // Automatically open panel when navigating to child routes
    const shouldShowPanel = pathname !== '/house_layout';
    const [isPanelOpen, setIsPanelOpen] = useState(shouldShowPanel);

    // Update panel state when route changes
    useEffect(() => {
        setIsPanelOpen(shouldShowPanel);
    }, [shouldShowPanel]);

    return <div className="w-full h-lvh relative overflow-hidden">
        <Suspense>
            <FloorplanViewer
                houseDef={houseDef}
                roomDefs={roomDefs}
                isPanelOpen={isPanelOpen}
                onPanelVisibilityChange={setIsPanelOpen}
            />
        </Suspense>
        
        <div className={cn("absolute top-0 right-0 bottom-0 pointer-events-none transition-[width] duration-300", {
            "w-1/2": isPanelOpen,
            "w-0": !isPanelOpen
        })}>
            {isPanelOpen && (
                <div className="pointer-events-none">
                    {children}
                </div>
            )}
            
            <Icon 
                icon={isPanelOpen ? menuUnFoldRight : menuFoldLeft} 
                width="2rem" 
                height="2rem" 
                className={cn("text-red-100 absolute top-2 cursor-pointer shadow-lg z-10 pointer-events-auto", {
                    "left-[-3em]": isPanelOpen,
                    "right-5": !isPanelOpen
                })}
                onClick={() => setIsPanelOpen(!isPanelOpen)} 
            />
        </div>
    </div>;
}
