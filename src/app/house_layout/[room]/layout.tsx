// src/app/house_layout/[room]/layout.tsx

import { redirect } from "next/navigation";
import React, { type PropsWithChildren, Suspense } from "react";
import { getSession } from "@/auth";
import { fetchRoomForFamily } from "@/services/roomService";
import { Card, CardHeader, CardTitle } from "@/ui/components/Card";
import LoadingCard from "@/ui/components/LoadingCard";
import LocationsPanel from "./LocationsPanel";

export default async function RoomLayout(
  props: PropsWithChildren<{ params: Promise<{ room: string }> }>,
) {
  const params = await props.params;

  const { children } = props;

  const session = await getSession();

  if (!session) {
    return null;
  }

  const roomId = params.room;
  const roomInfo = await fetchRoomForFamily(roomId);

  if (!roomInfo) {
    redirect("/house_layout_404");
  }

  return (
    <div className="room-layout h-screen flex flex-col pointer-events-none backdrop-blur-lg">
      <div className="flex-shrink-0 px-2 pt-2">
        <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
          <CardHeader className="py-4 items-center text-center">
            <CardTitle>
              {roomInfo.name
                ? `${roomInfo.name} is now selected`
                : "No room selected"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-1/2 overflow-x-hidden overflow-y-auto">
          <Suspense fallback={<LoadingCard label="Loading locations…" />}>
            <LocationsPanel roomId={roomId} />
          </Suspense>
        </div>
        <div className="h-1/2 overflow-visible">{children}</div>
      </div>
    </div>
  );
}
