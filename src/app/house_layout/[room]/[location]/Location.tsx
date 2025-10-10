import React from "react";
import { fetchItemsByLocation } from "@/services/itemService";
import ItemsList from "./ItemsList";

type LocationProps = {
  locationId: string;
  locationName: string;
};

export default async function Location({
  locationId,
  locationName,
}: LocationProps) {
  const itemsData = await fetchItemsByLocation(locationId);

  return (
    <ItemsList
      items={itemsData}
      locationName={locationName}
      locationId={locationId}
    />
  );
}
