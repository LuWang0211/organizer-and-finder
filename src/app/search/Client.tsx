"use client";

import dynamic from "next/dynamic";
import type { ItemType } from "@/services/itemService";

const DynamicGame = dynamic(() => import("@/app/search/Game"), {
  ssr: false,
});

type SearchGameProps = {
  initialItems: ItemType[];
};

export default function SearchGame({ initialItems }: SearchGameProps) {
  return <DynamicGame initialItems={initialItems} />;
}
