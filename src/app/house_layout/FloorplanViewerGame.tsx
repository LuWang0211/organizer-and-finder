"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useMemo, useState } from "react";
import { Game } from "phaser";
import { useMeasure, useLatest } from "react-use";
import { usePathname, useRouter } from "next/navigation";
import { HouseDef, RoomDef, ViewerMode } from "./common";
import { FloorplanViewerScene } from "./FloorplanViewerScene";

interface FloorPlanViewerGameProps {
    houseDef: HouseDef;
    isPanelOpen: boolean;
    roomDefs: RoomDef[];
    className?: string;
}

function createGame(containerWidth: number, containerHeight: number, parentElement: HTMLElement) {
    return new Game({
        type: Phaser.AUTO,
        width: containerWidth,
        height: containerHeight,
        transparent: true,
        parent: parentElement,
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

}

export default function FloorplanViewerGame({
    houseDef,
    isPanelOpen,
    roomDefs,
    
}: FloorPlanViewerGameProps) {
    
    const floorplanGame = useRef<Game>(undefined);
    const floorplanContainer = useRef<HTMLDivElement>(undefined);
    const [containerMeasure, { width: containerWidth, height: containerHeight }] = useMeasure<HTMLDivElement>();
    const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);

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
        setSelectedRoomId(roomId);
        // Emit pin with folded mode and selected room
        floorplanGame.current?.events.emit('pin', 'folded', roomId);
    }, [router, pathname]);

    const handleRoomInteractionLatest = useLatest(handleRoomClick);

    // Handle cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (floorplanGame.current) {
                floorplanGame.current.destroy(true);
                floorplanGame.current = undefined;
                gameCreated.current = false;
            }
        };
    }, []);

    // Track if game has been created to prevent recreation
    const gameCreated = useRef(false);
    const gameReady = useRef(false);
    // Initialize Phaser game: ensure-on-render guard
    // Rationale: Next.js Fast Refresh may run effect cleanup (destroying the game)
    // without remounting this component or changing deps. Running this effect after
    // every render allows us to recreate the game when it's missing.
    useLayoutEffect(() => {
        if (
            !floorplanGame.current &&
            floorplanContainer.current &&
            containerWidth > 0 &&
            containerHeight > 0 &&
            !gameCreated.current
        ) {
            floorplanGame.current = createGame(
                containerWidth,
                containerHeight,
                floorplanContainer.current!
            );

            gameCreated.current = true;

            // Wait for the scene to be ready, then start it with initial data and mode
            floorplanGame.current.events.once('ready', () => {
                const sceneManager = floorplanGame.current?.scene;
                const mode: ViewerMode = isPanelOpen ? ViewerMode.Folded : ViewerMode.Fullscreen;
                sceneManager?.start('FloorplanViewerScene', { houseDef, roomDefs, mode, selectedRoomId });
                gameReady.current = true
            });

            // Listen for room click events from the Phaser scene and navigate
            floorplanGame.current.events.on('roomClicked', (roomId: string) => {
                handleRoomInteractionLatest.current?.(roomId);
            });
        }

        return () => {
            // Cleanup handled in component unmount effect
        };
    });

    // Handle container size changes separately - just resize, don't recreate
    useLayoutEffect(() => {
        if (floorplanGame.current && gameReady.current && containerWidth > 0 && containerHeight > 0) {
            floorplanGame.current.scale.resize(containerWidth, containerHeight);
        }
    }, [containerWidth, containerHeight]);

    // Notify scene to pin/center on selection changes.
    // Derive mode from whether a room is selected to avoid waiting for panel visibility.
    useEffect(() => {
        if (!floorplanGame.current) return;
        const mode: ViewerMode = selectedRoomId ? ViewerMode.Folded : ViewerMode.Fullscreen;
        floorplanGame.current?.events.emit('pin', mode, selectedRoomId);
    }, [selectedRoomId]);

    // Sync selection from the URL path whenever it changes
    useEffect(() => {
        const parts = pathname.split("/");
        if (parts.length > 2 && parts[2]) {
            const rid = decodeURI(parts[2]);
            if (rid !== selectedRoomId) {
                setSelectedRoomId(rid);
            }
        } else if (selectedRoomId !== undefined) {
            setSelectedRoomId(undefined);
        }
    }, [pathname]);

    return (
        <div className="relative w-full h-full overflow-hidden" ref={assignRef} />
    );
}
