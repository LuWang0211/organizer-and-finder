"use client";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("@phaser/Game"), {
  ssr: false,
});

export default function Page() {
  return <DynamicComponentWithNoSSR />;
}
