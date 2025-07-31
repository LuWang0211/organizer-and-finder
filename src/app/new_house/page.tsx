import AuthProtectedComponent from "@/AuthProtectedComponent";
import { getSession } from "@/auth";
import { fetchHouseForFamily } from "@/services/roomService";
import { redirect } from "next/navigation";
import NewHouseClient from "./NewHouseClient";
import { getLayoutOptions } from "./layout-service";

async function DataLoader() {
    const session = await getSession();

    if (!session) {
        return null;
    }

    const house = await fetchHouseForFamily(session.dbUser.familyId!);

    if (house) {
        // If the family already has a house, redirect to the house layout page
        redirect('/house_layout');
    }

    // Load available layout options server-side
    const layoutOptions = getLayoutOptions();

    return <NewHouseClient layoutOptions={layoutOptions} />;
}

export default function Page() {
    return <AuthProtectedComponent>
        <DataLoader />
    </AuthProtectedComponent>
}