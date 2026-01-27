// src/app/house_layout/[room]/layout.tsx

import { redirect } from "next/navigation";
import { type PropsWithChildren, Suspense } from "react";
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
    <div className="room-layout h-screen flex flex-col backdrop-blur-lg">
      <div className="flex-1 flex flex-col h-full">
        <div className="h-1/2 overflow-visible flex flex-col @container-[size]">
          <div className="p-0 @h-24:px-2 @h-24:pt-2">
            <Card>
              <CardHeader className="p-2 @h-24:p-6 @h-24:py-4 items-center text-center">
                <CardTitle className="text-xl @h-24:text-2xl">
                  {roomInfo.name
                    ? `${roomInfo.name} is now selected`
                    : "No room selected"}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div className="flex-1 w-full overflow-auto">
            <Suspense fallback={<LoadingCard label="Loading locations…" />}>
              <LocationsPanel roomId={roomId} />
            </Suspense>
          </div>
        </div>
        <div className="h-1/2 overflow-visible">{children}</div>
      </div>
    </div>
  );
}
