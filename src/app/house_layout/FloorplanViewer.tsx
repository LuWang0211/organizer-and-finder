"use client";

import { cn } from "@/utils/tailwind";
import { Icon } from '@iconify-icon/react';
import menuFoldLeft from '@iconify-icons/line-md/menu-fold-left';
import menuUnFoldRight from '@iconify-icons/line-md/menu-unfold-right';
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useLatest, useMount } from "react-use";
import { TransformComponent, TransformWrapper, ReactZoomPanPinchRef, useTransformInit, ReactZoomPanPinchState } from "react-zoom-pan-pinch";
import Image from "next/image";
import { HouseDef, RoomDef } from "./common";
import { getColorByNumber } from "@/ui/colors";

interface RoomProps {
    roomId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    className?: string;
    onClick: (roomId: string) => void;  // Change to pass room name and id
}

function Room({ roomId, x, y, w, h, className, onClick}: RoomProps) {
    return <div className={cn("absolute cursor-pointer", className)} style={{
        top: `${y}px`,
        left: `${x}px`,
        width: `${w}px`,
        height: `${h}px`
    }} onClick={() => onClick(roomId)} />;
}

interface FloorPlanViewerProps {
    houseDef: HouseDef;
    isFolded: boolean;
    roomDefs: RoomDef[];
    onFold: (isFolded: boolean) => void;
    className?: string;
}

export default function FloorplanViewer({
    houseDef,
    isFolded,
    roomDefs,
    onFold
}: FloorPlanViewerProps) {
    const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
    const initialTransformStateRef = useRef<ReactZoomPanPinchState>(undefined);

    const shrink = useCallback(() => {
        const transformState = transformComponentRef.current?.instance.transformState;
        if (transformState) {
            const { positionX, positionY, scale } = transformState;

            transformComponentRef.current?.setTransform(
                positionX / 2, positionY, scale
            )
        }
        onFold(true)
    }, [onFold]);

    const expand = useCallback(() => {
        if (initialTransformStateRef.current) {
            // If the initialTransformStateRef.current is defined, use it to set the transform
            transformComponentRef.current?.setTransform(
                initialTransformStateRef.current.positionX,
                initialTransformStateRef.current.positionY,
                1
            );
        } else {
            // 0 means the animation will be instant, otherwise the centerView() will cut off the
            // animation and cause the resetTransform() to be ignored
            transformComponentRef.current?.resetTransform(0)

            setTimeout(() => {
                transformComponentRef.current?.centerView(1, 0);

                // Acquire the initial transform state after the centerView() animation is done for the first time
                initialTransformStateRef.current = transformComponentRef.current?.instance.transformState;
            }, 10)
        }
       
        onFold(false)
    }, [onFold]);

    const router = useRouter();
    const pathname = usePathname();

    const zoomToElement = useCallback((roomId: string) => {
        if (!isFolded) {
            shrink();
        }

        setTimeout(() => {
            transformComponentRef.current?.zoomToElement(roomId);
        }, 1);
    }, [isFolded, shrink]);

    const handleRoomClick = useCallback((roomId: string) => {
        const parts = pathname.split("/");
        const currentRoom = parts[2];
        // If clicking a different room, always go to room root
        if (currentRoom !== roomId) {
            router.push(`/house_layout/${roomId}`);
        }
    }, [router, pathname]);

    const handleRoomInteraction = useCallback((roomId: string) => {
        zoomToElement(roomId);
        handleRoomClick(roomId);
    }, [zoomToElement , handleRoomClick]);

    const handleRoomInteractionLatest = useLatest(handleRoomInteraction);

    useMount(() => {

        if (isFolded) {
            return
        } else {
            // Acquire the initial transform state when the component is mounted.
            // this is only done when the component is in the expanded state
            initialTransformStateRef.current = {
                positionX:  transformComponentRef.current?.instance.transformState.positionX!,
                positionY: transformComponentRef.current?.instance.transformState.positionY!,
                scale: 1,
                previousScale: 1,
            };
        }

        const parts = pathname.split("/");

        if (parts.length > 2) {
            const elementId = parts[2];

            setTimeout(() => {
                return handleRoomInteractionLatest.current?.(decodeURI(elementId));
            }, 1);
        }
    },);

    const { floorplanPicture, width, height } = houseDef;

    return <div className={"relative flex justify-center items-center overflow-hidden row-span-2"} >
        <TransformWrapper initialScale={1} limitToBounds={false} centerOnInit={true} minScale={0.5} maxScale={3}
            ref={transformComponentRef}
        >
            <TransformComponent wrapperClass="h-full w-full" wrapperStyle={{
                    width: "100%", height: "100%"
                }}> {
                    <div className="w-full relative">
                        <Image src={floorplanPicture} width={width} height={height} alt="floorplan" className={"h-[750px] w-auto max-w-[max-content] transform-gpu"} />
                        {roomDefs.map(({x, y, h, w, id}, index) => <Room key={id} roomId={id} x={x} y={y} w={w} h={h} 
                            className={cn("opacity-50", `hover:bg-${getColorByNumber(index)}`)} onClick={handleRoomInteraction} />)}
                    </div>
                }
            </TransformComponent>
        </TransformWrapper>    

        {!isFolded && <Icon icon={menuFoldLeft} width="2rem" height="2rem" className=" text-red-100 absolute top-2 right-5 cursor-pointer shadow-lg"
                    onClick={shrink} />}

        {isFolded && <Icon icon={menuUnFoldRight} width="2rem" height="2rem" className=" text-red-100 absolute top-2 right-5 cursor-pointer shadow-lg" 
            onClick={expand} /> }

    
    </div>;

}
