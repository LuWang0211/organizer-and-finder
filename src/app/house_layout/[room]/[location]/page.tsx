import Location from "./location";
import { getSession } from "@/auth";
import { redirect } from "next/navigation";

export default async function LocationPage(props: { params: Promise<{ room: string; location: string }> }) {
    const params = await props.params;
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    try {
        const locationId = `${params.room}_${params.location}`;
        return (
            <div>
                <Location locationId={locationId} locationName={params.location}/>
            </div>
        );
    } catch (error) {
        return <div>Error loading location</div>;
    }
}
