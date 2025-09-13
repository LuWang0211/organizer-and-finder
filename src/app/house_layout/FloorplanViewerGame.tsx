"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Game } from "phaser";
import { useMeasure, useLatest } from "react-use";
import { usePathname, useRouter } from "next/navigation";
import { HouseDef, RoomDef } from "./common";
import { FloorplanViewerScene } from "./FloorplanViewerScene";

interface FloorPlanViewerGameProps {
    houseDef: HouseDef;
    isPanelOpen: boolean;
    roomDefs: RoomDef[];
    onPanelVisibilityChange: (open: boolean) => void;
    className?: string;
}

export default function FloorplanViewerGame({
    houseDef,
    isPanelOpen,
    roomDefs,
    onPanelVisibilityChange
}: FloorPlanViewerGameProps) {
    
    const floorplanGame = useRef<Game>(undefined);
    const floorplanContainer = useRef<HTMLDivElement>(undefined);
    const [containerMeasure, { width: containerWidth, height: containerHeight }] = useMeasure<HTMLDivElement>();

    const assignRef = useCallback((element: HTMLDivElement) => {
        containerMeasure(element);
        floorplanContainer.current = element;
    }, [containerMeasure]);

    const router = useRouter();
    const pathname = usePathname();

    const handleRoomClick = useCallback((roomId: string) => {
        const parts = pathname.split("/");
        const currentRoom = parts[2];
        // If clicking a different room, always go to room root
        if (currentRoom !== roomId) {
            router.push(`/house_layout/${roomId}`);
        }
        // Ensure details panel is visible (non-fullscreen)
        if (!isPanelOpen) {
            onPanelVisibilityChange(true);
        }
    }, [router, pathname, isPanelOpen, onPanelVisibilityChange]);

    const handleRoomInteractionLatest = useLatest(handleRoomClick);

    // Handle cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (floorplanGame.current) {
                floorplanGame.current.destroy(true);
                floorplanGame.current = undefined;
                gameCreated.current = false;
                initialSize.current = null;
            }
        };
    }, []);

    // Track if game has been created to prevent recreation
    const gameCreated = useRef(false);
    
    // Store initial container size to avoid recreation on minor changes
    const initialSize = useRef<{width: number, height: number} | null>(null);

    // Initialize Phaser game - only once when container is ready
    useLayoutEffect(() => {
        if (containerWidth > 0 && containerHeight > 0 && floorplanContainer.current && !gameCreated.current) {
            
            initialSize.current = { width: containerWidth, height: containerHeight };
            
            floorplanGame.current = new Game({
                type: Phaser.AUTO,
                width: containerWidth,
                height: containerHeight,
                transparent: true,
                parent: floorplanContainer.current,
                scene: [FloorplanViewerScene],
                scale: {
                    mode: Phaser.Scale.RESIZE,
                },
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { x: 0, y: 0 },
                        debug: false
                    }
                },
                plugins: {
                    global: [],
                    scene: []
                }
            });

            gameCreated.current = true;

            // Wait for the scene to be ready, then start it with initial data
            floorplanGame.current.events.once('ready', () => {
                const sceneManager = floorplanGame.current!.scene;
                sceneManager.start('FloorplanViewerScene', { houseDef, roomDefs });
            });

            // Listen for room click events from the Phaser scene and navigate
            floorplanGame.current.events.on('roomClicked', (roomId: string) => {
                handleRoomInteractionLatest.current?.(roomId);
            });
        }

        return () => {
            // Cleanup handled in component unmount effect
        };
    }, [containerWidth, containerHeight]); // Need dimensions to create properly

    // Handle container size changes separately - just resize, don't recreate
    useLayoutEffect(() => {
        if (floorplanGame.current && containerWidth > 0 && containerHeight > 0) {
            floorplanGame.current.scale.resize(containerWidth, containerHeight);
        }
    }, [containerWidth, containerHeight]);

    // Handle route-based room navigation
    useEffect(() => {
        const parts = pathname.split("/");
        if (parts.length > 2) {
            const elementId = parts[2];
            setTimeout(() => {
                handleRoomInteractionLatest.current?.(decodeURI(elementId));
            }, 100);
        }
    }, [pathname, handleRoomInteractionLatest]);

    return (
        <div className="relative w-full h-full overflow-hidden" ref={assignRef} />
    );
}
