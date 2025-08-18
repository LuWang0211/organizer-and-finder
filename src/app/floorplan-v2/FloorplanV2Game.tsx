"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Game } from "phaser";
import { useMeasure } from "react-use";
import { FloorplanV2Scene } from "./FloorplanV2Scene";
import { Button } from "@/ui/components/button";
import { Icon } from "@/ui/components/icon";
import { Magnet } from "lucide-react";

export default function FloorplanV2Game() {
    const floorplanV2Game = useRef<Game>(undefined);
    const floorplanV2Container = useRef<HTMLDivElement>(undefined);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [selectedRectangle, setSelectedRectangle] = useState<any>(null);
    const [snappingEnabled, setSnappingEnabled] = useState(true);

    const [containerMeasure, { width: containerWidth, height: containerHeight }] = useMeasure<HTMLDivElement>();

    const assignRef = useCallback((element: HTMLDivElement) => {
        containerMeasure(element);
        floorplanV2Container.current = element;
    }, [containerMeasure]);

    const floorplanV2Config = {
        type: Phaser.AUTO,
        width: 1024,
        height: 768,
        transparent: true,
        scene: [FloorplanV2Scene],
        scale: {
            mode: Phaser.Scale.NONE,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { x: 0, y: 0 },
                debug: false
            }
        }
    };

    const handleResetScale = useCallback(() => {
        if (floorplanV2Game.current) {
            const scene = floorplanV2Game.current.scene.getScene('FloorplanV2Scene') as FloorplanV2Scene;
            if (scene) {
                scene.events.emit('resetScale');
            }
        }
    }, []);

    const handleToggleDrawingMode = useCallback(() => {
        const newDrawingMode = !isDrawingMode;
        setIsDrawingMode(newDrawingMode);
        
        if (floorplanV2Game.current) {
            const scene = floorplanV2Game.current.scene.getScene('FloorplanV2Scene') as FloorplanV2Scene;
            if (scene) {
                scene.events.emit('toggleDrawingMode', newDrawingMode);
            }
        }
    }, [isDrawingMode]);

    const handleDeleteRectangle = useCallback(() => {
        if (floorplanV2Game.current && selectedRectangle) {
            const scene = floorplanV2Game.current.scene.getScene('FloorplanV2Scene') as FloorplanV2Scene;
            if (scene) {
                scene.events.emit('deleteSelectedRectangle');
            }
        }
    }, [selectedRectangle]);

    const handleToggleSnapping = useCallback(() => {
        const newSnappingState = !snappingEnabled;
        setSnappingEnabled(newSnappingState);
        
        if (floorplanV2Game.current) {
            const scene = floorplanV2Game.current.scene.getScene('FloorplanV2Scene') as FloorplanV2Scene;
            if (scene) {
                scene.events.emit('toggleSnapping', newSnappingState);
            }
        }
    }, [snappingEnabled]);

    useLayoutEffect(() => {
        if (floorplanV2Game.current === undefined) {
            console.log("Creating floorplan v2 game");
            
            floorplanV2Game.current = new Game({
                ...floorplanV2Config,
                parent: floorplanV2Container.current,
                input: {
                    mouse: {
                        target: floorplanV2Container.current
                    },
                    touch: {
                        target: floorplanV2Container.current
                    },
                }
            });

            floorplanV2Game.current.events.on('sceneReady', (scene: FloorplanV2Scene) => {
                scene.events.on('rectangleSelected', (rectangle: any) => {
                    setSelectedRectangle(rectangle);
                });
                
                // Sync initial snapping state
                scene.events.emit('toggleSnapping', snappingEnabled);
            });
        }

        return () => {
            if (floorplanV2Game.current) {
                floorplanV2Game.current.destroy(true);
                floorplanV2Game.current = undefined;
            }
        }
    }, []);

    useEffect(() => {
        if (containerWidth > 0 && containerHeight > 0) {
            const containerAspectRatio = containerWidth / containerHeight;
            const fitWidth = 768 * containerAspectRatio;

            floorplanV2Game.current?.scale.resize(fitWidth, 768);
            floorplanV2Game.current?.scale.setZoom(containerHeight / 768);
        }
    }, [containerWidth, containerHeight]);

    return (
        <div className="w-full h-full relative">
            <div ref={assignRef} className="w-full h-full overflow-hidden" />
            
            {/* Top Controls Layout: Left, Center, Right */}
            <div className="absolute top-4 left-0 right-0 z-10 px-4">
                {/* Left Section */}
                <div className="absolute left-4 top-0 flex gap-2">
                    {/* Left controls can go here */}
                </div>

                {/* Center Section - Snapping Toggle (Absolutely Centered) */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 flex gap-2">
                    <div className="relative group">
                        <Icon
                            onClick={handleToggleSnapping}
                            variant={snappingEnabled ? "primary" : "default"}
                            size="sm"
                            className="cursor-pointer"
                        >
                            <Magnet />
                        </Icon>
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 delay-0 group-hover:delay-500 pointer-events-none z-50">
                            {snappingEnabled ? "Snapping: ON - Click to disable" : "Snapping: OFF - Click to enable"}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="absolute right-4 top-0 flex gap-2">
                    {selectedRectangle && (
                        <Button
                            onClick={handleDeleteRectangle}
                            variant="secondary"
                            size="sm"
                        >
                            Delete Rectangle
                        </Button>
                    )}
                    <Button
                        onClick={handleToggleDrawingMode}
                        variant={isDrawingMode ? "secondary" : "primary"}
                        size="sm"
                    >
                        {isDrawingMode ? "Exit Drawing" : "New Rectangle"}
                    </Button>
                    <Button
                        onClick={handleResetScale}
                        variant="outline"
                        size="sm"
                    >
                        Reset Scale
                    </Button>
                </div>
            </div>
        </div>
    );
}