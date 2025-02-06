// src/app/house_layout/[room]/layout.tsx
import React from "react";
import { PropsWithChildren } from "react";
import { fetchLocationsByRoom } from "@/services/locationService";
import LocationList from "./Locations";
import LocationSelectionContextProvider from "./LocationSelectionContext";
import SelectedLocation from "./SelectedLocation";

export default async function RoomLayout({ params, children }: PropsWithChildren<{ params: { room: string } }>) {
  const roomId = params.room;
  const locationsData = await fetchLocationsByRoom(roomId);

  return (
    <div className="room-layout">
      <div className="text-center text-2xl py-2 font-bold bg-gray-500 flex justify-center">
             {roomId ? `${roomId} is now selected` : "No room selected"}
        </div>
      <LocationSelectionContextProvider>
        <LocationList locations={locationsData} roomId={roomId} loading={false}/>
        <SelectedLocation />
      </LocationSelectionContextProvider>
      {children}
    </div>
  );
}
