"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Game } from "phaser";
import { useMeasure } from "react-use";
import { FloorplanV2Scene } from "./FloorplanV2Scene";
import { Button } from "@/ui/components/button";

export default function FloorplanV2Game() {
    const floorplanV2Game = useRef<Game>(undefined);
    const floorplanV2Container = useRef<HTMLDivElement>(undefined);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [selectedRectangle, setSelectedRectangle] = useState<any>(null);

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
            <div className="absolute top-4 right-4 z-10 flex gap-2">
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
    );
}