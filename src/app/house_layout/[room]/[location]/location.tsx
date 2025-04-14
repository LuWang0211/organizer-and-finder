import React from "react";
import { fetchItemsByLocation } from "@/services/itemService";
import ItemsList from "./Items";

type LocationProps = {
  locationId: string;
};

export default async function Location({ locationId }: LocationProps) {
    const itemsData = await fetchItemsByLocation(locationId);

    return (
        <ItemsList items={itemsData} />
    );
}


