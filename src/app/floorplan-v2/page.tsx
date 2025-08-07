"use client";

import dynamic from "next/dynamic";

const DynamicFloorplanV2Game = dynamic(
    () => import('./FloorplanV2Game'),
    { ssr: false }
);

export default function FloorplanV2Page() {
    return (
        <div className="w-screen h-screen">
            <DynamicFloorplanV2Game />
        </div>
    );
}