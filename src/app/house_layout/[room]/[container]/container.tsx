import React from "react";
import { fetchItemsByContainer } from "@/services/itemService";
import ItemsList from "./Items";

type ContainerProps = {
  containerId: number;
};

export default async function Container({ containerId}: ContainerProps) {
    // console.log("containerId in container.tsx:", containerId );
    const itemsData = await fetchItemsByContainer(Number(containerId));
    // console.log("Items Data in the selected container:", itemsData? itemsData[0] : "No items found");

  return (
      <ItemsList items={itemsData} />
  );
}


