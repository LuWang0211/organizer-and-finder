// src/app/house_layout/[room]/layout.tsx
import React from "react";
import { PropsWithChildren } from "react";
import { fetchLocationsByRoom } from "@/services/locationService";
import LocationList from "./Locations";
import LocationSelectionContextProvider from "./LocationSelectionContext";
import { getSession } from "@/auth";
import { fetchRoomForFamily } from "@/services/roomService";


export default async function RoomLayout({ params, children }: PropsWithChildren<{ params: { room: string } }>) {
  const session = await getSession();

  if (!session) {
      return null;
  }

  const roomId = params.room;
  const locationsData = await fetchLocationsByRoom(roomId);
  const [roomInfo] = await fetchRoomForFamily(roomId);
  // console.log("roomInfo", roomInfo);

  return (
    <div className="room-layout">
      <div className="text-center text-2xl py-2 font-bold bg-gray-500 flex justify-center">
             {roomInfo.name ? `${roomInfo.name} is now selected` : "No room selected"}
        </div>
      <LocationSelectionContextProvider>
        <LocationList locations={locationsData} roomId={roomId} loading={false}/>
      </LocationSelectionContextProvider>
      {children}
    </div>
  );
}
