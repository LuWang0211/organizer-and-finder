"use client";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
    () => import('@/app/floorplan/FloorplanPage'),
    { ssr: false }
  );


export default function PageClient() {
    
    return <DynamicComponentWithNoSSR />;
}