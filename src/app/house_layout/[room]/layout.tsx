// src/app/house_layout/[room]/layout.tsx
import React from "react";
import { PropsWithChildren } from "react";
import LocationSelectionContextProvider from "./LocationSelectionContext";
import { getSession } from "@/auth";
import { fetchRoomForFamily } from "@/services/roomService";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/ui/components/card";
import { Suspense } from "react";
import LocationsPanel from "./LocationsPanel";
import LoadingCard from "@/ui/components/loading-card";


export default async function RoomLayout(props: PropsWithChildren<{ params: Promise<{ room: string }> }>) {
  const params = await props.params;

  const {
    children
  } = props;

  const session = await getSession();

  if (!session) {
      return null;
  }

  const roomId = params.room;
  const roomInfo = await fetchRoomForFamily(roomId);

  if (!roomInfo) {
    redirect('/house_layout_404');
  }

  return (
    <div className="room-layout h-screen flex flex-col pointer-events-none">
      <div className="flex-shrink-0 px-2 pt-2">
        <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
          <CardHeader className="py-4 items-center text-center">
            <CardTitle>
              {roomInfo.name ? `${roomInfo.name} is now selected` : "No room selected"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex-1 flex flex-col">
        <LocationSelectionContextProvider>
          <div className="h-1/2 overflow-auto">
            <Suspense fallback={<LoadingCard label="Loading locations…" />}>
              <LocationsPanel roomId={roomId} />
            </Suspense>
          </div>
        </LocationSelectionContextProvider>
        <div className="h-1/2 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
