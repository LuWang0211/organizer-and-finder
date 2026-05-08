"use client";

import dynamic from "next/dynamic";
import type { SearchItem } from "@/services/itemService";

const DynamicGame = dynamic(() => import("./Game"), {
  ssr: false,
});

type SearchGameProps = {
  initialItems: SearchItem[];
};

export default function SearchGame({ initialItems }: SearchGameProps) {
  return <DynamicGame initialItems={initialItems} />;
}
