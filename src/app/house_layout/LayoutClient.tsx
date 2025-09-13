"use client";
import FloorplanViewer from "./FloorplanViewer";
import { Suspense, useState, useEffect, useCallback } from "react";
import { cn } from "@/utils/tailwind";
import { HouseDef, RoomDef } from "./common";
import { Icon } from '@iconify-icon/react';
import menuFoldLeft from '@iconify-icons/line-md/menu-fold-left';
import menuUnFoldRight from '@iconify-icons/line-md/menu-unfold-right';
import { usePathname, useRouter } from "next/navigation";


const stopAll = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Best-effort: stop native propagation so canvas listeners don't receive it
    // @ts-ignore
    if (e.nativeEvent?.stopImmediatePropagation) {
        // @ts-ignore
        e.nativeEvent.stopImmediatePropagation();
    }
};
interface LayoutClientProps {
    houseDef: HouseDef;
    roomDefs: RoomDef[];
    children: React.ReactNode;
}

export default function Layout( { houseDef, roomDefs, children }: LayoutClientProps) {
    const pathname = usePathname();
    const router = useRouter();
    
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
            
            <div
                className={cn("text-red-100 absolute top-2 z-10 pointer-events-auto p-4", {
                "left-[-3em]": isPanelOpen,
                "right-5": !isPanelOpen
            })}
                onPointerDownCapture={stopAll}
                onPointerUpCapture={stopAll}
            >
                <Icon 
                    icon={isPanelOpen ? menuUnFoldRight : menuFoldLeft} 
                    className={"cursor-pointer shadow-lg w-8 h-8"}
                    width={'2em'}
                    height={'2em'}
                    onClick={(e) => {
                        stopAll(e);
                        // Folded state should only be entered via room click (route change).
                        // When closing the panel, navigate back to /house_layout without full refresh.
                        if (isPanelOpen) {
                            router.replace('/house_layout');
                        }
                        // If panel is closed, do nothing here; opening occurs when a room is clicked.
                    }}
                   
                />
            </div>
        </div>
    </div>;
}
