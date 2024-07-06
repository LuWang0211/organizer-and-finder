"use client";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
    () => import('@/app/phaserui/game'),
    { ssr: false }
  );


export default function Page() {
    return <DynamicComponentWithNoSSR />;
}