
import AuthProtectedComponent from "@/AuthProtectedComponent";
import LayoutClient from "@/app/house_layout/LayoutClient";
import { getSession } from "@/auth";
import { fetchHouseForFamily, fetchRoomsForHouse } from "@/services/roomService";
import { redirect } from "next/navigation";
import { HouseDef } from "./common";
import { JsonObject } from "@prisma/client/runtime/library";

async function DataLoader({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        return null;
    }

    const house = await fetchHouseForFamily(session.dbUser.familyId!);

    if (!house) {
        // If the family doesn't have a house, redirect to the new house page
        redirect('/new_house');
    }

    const houseDef: HouseDef = house.metadata! as unknown as HouseDef;

    const rooms = await fetchRoomsForHouse(house.id);

    const roomDefs = rooms.map(room => {
        const {x, y, h, w} = room.metadata as {x: number, y: number, h: number, w: number};
        return {
            id: room.id,
            name: room.name,
            x, y, h, w
        }
    });

    return <LayoutClient houseDef={houseDef} roomDefs={roomDefs} >
        {children}
    </LayoutClient>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthProtectedComponent>
        {<DataLoader >{ children }</DataLoader>}
    </AuthProtectedComponent>
}
