import Location from "./location";
import { getSession } from "@/auth";
import { redirect } from "next/navigation";

export default async function LocationPage({ params }: { params: { room: string; location: string } }) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    try {
        const locationId = `${params.room}_${params.location}`;
        return (
            <div>
                <Location locationId={locationId} />
            </div>
        );
    } catch (error) {
        return <div>Error loading location</div>;
    }
}
