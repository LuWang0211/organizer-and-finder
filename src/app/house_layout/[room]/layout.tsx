// src/app/house_layout/[room]/layout.tsx
import React from "react";
import { PropsWithChildren } from "react";
import { fetchContainersByRoom } from "@/services/containerService";
import ContainerList from "./Containers";
import ContainerSelectionContextProvider from "./ContainerSelectionContext";
import SelectedContainer from "./SelectedContainer";

export default async function RoomLayout({ params, children }: PropsWithChildren<{ params: { room: string } }>) {

  // console.log("params in [room] layout - get from parent:", params);
  
  const roomId = params.room;
  const containersData = await fetchContainersByRoom(roomId);

  return (
    <div className="room-layout">
      <div className="text-center text-2xl py-2 font-bold bg-gray-500 flex justify-center">
             {roomId ? `${roomId} is now selected` : "No room selected"}
        </div>
      <ContainerSelectionContextProvider>
        <ContainerList containers={containersData} roomId={roomId} loading={false}/>
        <SelectedContainer />
      </ContainerSelectionContextProvider>
      {children}
    </div>
  );
}
