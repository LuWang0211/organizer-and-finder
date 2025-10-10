"use client";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("@/app/phaserui/Game"), {
  ssr: false,
});

export default function Page() {
  return <DynamicComponentWithNoSSR />;
}
