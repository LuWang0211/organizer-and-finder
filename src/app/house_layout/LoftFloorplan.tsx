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
import loftPic from '../../../public/assets/texture/loft.png';

interface RoomProps {
    roomName: string;
    roomId: number;
    x: number;
    y: number;
    w: number;
    h: number;
    className?: string;
    onClick: (roomName: string, id: number) => void;  // Change to pass room name and id
}

function Room({ roomName, roomId, x, y, w, h, className, onClick}: RoomProps) {
    return <div id={roomName} className={cn("absolute cursor-pointer", className)} style={{
        top: `${y}px`,
        left: `${x}px`,
        width: `${w}px`,
        height: `${h}px`
    }} onClick={() => onClick(roomName, roomId)} />; // Pass roomName and roomId on click
}

interface LoftFloorplanProps {
    className?: string;
    isFolded: boolean;
    onFold: (isFolded: boolean) => void;
}

export default function LoftFloorplan({
    className,
    isFolded,
    onFold
}: LoftFloorplanProps) {
    const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
    const initialTransformStateRef = useRef<ReactZoomPanPinchState>();

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

    const zoomToElement = useCallback((roomName: string, roomId: number) => {
        if (!isFolded) {
            shrink();
        }

        setTimeout(() => {
            transformComponentRef.current?.zoomToElement(roomName);

            router.push(`/house_layout/${roomName}?roomId=${roomId}`);
        }, 1);
    }, [isFolded, shrink, router]);

    const zoomToElementLatest = useLatest(zoomToElement);

    const pathname = usePathname();

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
                const roomId = parseInt(new URLSearchParams(window.location.search).get('roomId') || '0', 10);
                zoomToElementLatest.current?.(decodeURI(elementId), roomId);
            }, 1);
        }
    },);

    return <div className={cn(" relative flex justify-center items-center overflow-hidden", className)} >
        <TransformWrapper initialScale={1} limitToBounds={false} centerOnInit={true} minScale={0.5} maxScale={3}
            ref={transformComponentRef}
        >
            <TransformComponent wrapperClass="h-full w-full" wrapperStyle={{
                    width: "100%", height: "100%"
                }}> {
                    <div className="w-full relative">
                        <Image src={loftPic} alt="floorplan" className={"h-[750px] w-auto max-w-[max-content] transform-gpu"} />
                        <Room roomName="kitchen" roomId={1} x={13} y={13} w={305} h={380} className="hover:bg-red-500 opacity-50"
                            onClick={() => zoomToElement("kitchen", 1)} />
                        <Room roomName="living room" roomId={2} x={13} y={393} w={305} h={247} className="hover:bg-yellow-500 opacity-50"
                            onClick={() => zoomToElement("living room", 2)} />
                        <Room roomName="bedroom level 1" roomId={3} x={328} y={338} w={243} h={300} className="hover:bg-green-700 opacity-50"
                            onClick={() => zoomToElement("bedroom level 1", 3)} />
                        <Room roomName="restroom level 1" roomId={4} x={328} y={175} w={245} h={155} className="hover:bg-blue-700 opacity-50"
                            onClick={() => zoomToElement("restroom level 1", 4)} />
                        <Room roomName="restroom level 2" roomId={5} x={630} y={10} w={155} h={375} className="hover:bg-blue-700 opacity-50"
                            onClick={() => zoomToElement("restroom level 2", 5)} />
                        <Room roomName="bedroom level 2" roomId={6} x={793} y={422} w={225} h={218} className="hover:bg-green-700 opacity-50"
                            onClick={() => zoomToElement("bedroom level 2", 6)} />
                        <Room roomName="closet" roomId={7} x={862} y={260} w={157} h={155} className="hover:bg-purple-800 opacity-50"
                            onClick={() => zoomToElement("closet", 7)} />
                    </div>
                }
            </TransformComponent>
        </TransformWrapper>            
        

        {!isFolded && <Icon icon={menuFoldLeft} width="2rem" height="2rem" className=" text-red-100 absolute top-2 right-5 cursor-pointer shadow-lg"
            onClick={shrink}  />}
        {isFolded && <Icon icon={menuUnFoldRight} width="2rem" height="2rem" className=" text-red-100 absolute top-2 right-5 cursor-pointer shadow-lg" 
            onClick={expand} />}
    </div>;
}