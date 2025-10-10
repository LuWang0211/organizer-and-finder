import type { room as RoomType } from "@prisma/client";
import { redirect } from "next/navigation";
import AuthProtectedComponent from "@/AuthProtectedComponent";
import LayoutClient from "@/app/house_layout/LayoutClient";
import { getSession } from "@/auth";
import {
  fetchHouseForFamily,
  fetchRoomsForHouse,
  type RoomMetadataType,
} from "@/services/roomService";
import type { HouseDef } from "./common";

async function DataLoader({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const house = await fetchHouseForFamily(session.dbUser.familyId!);

  if (!house) {
    // If the family doesn't have a house, redirect to the new house page
    redirect("/new_house");
  }

  const houseDef: HouseDef = house.metadata! as unknown as HouseDef;

  const rooms = await fetchRoomsForHouse(house.id);

  const roomDefs = rooms.map((room: RoomType) => {
    const { vertices, color } = room.metadata as unknown as RoomMetadataType;
    return {
      id: room.id,
      name: room.name,
      vertices,
      color,
    };
  });

  return (
    <LayoutClient houseDef={houseDef} roomDefs={roomDefs}>
      {children}
    </LayoutClient>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProtectedComponent>
      {<DataLoader>{children}</DataLoader>}
    </AuthProtectedComponent>
  );
}
