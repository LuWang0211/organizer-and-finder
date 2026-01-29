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
    <div className="room-layout h-screen flex flex-col">
      <div className="flex-1 flex flex-col h-full gap-2 p-2">
        <div
          className="h-1/2 overflow-visible flex flex-col @container-[size] rounded-xl
          bg-linear-to-b from-white/20 via-white/10 to-white/5
          backdrop-blur-xl backdrop-saturate-150
          border border-white/30
          shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)]
          p-2
        "
        >
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
          <div className="flex-1 w-full overflow-auto custom-scrollbar">
            <Suspense fallback={<LoadingCard label="Loading locations…" />}>
              <LocationsPanel roomId={roomId} />
            </Suspense>
          </div>
        </div>
        <div
          className="h-1/2 overflow-visible rounded-xl
          bg-linear-to-b from-white/20 via-white/10 to-white/5
          backdrop-blur-xl backdrop-saturate-150
          border border-white/30
          shadow-[0_-8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)]
          custom-scrollbar
        "
        >
          {children}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
