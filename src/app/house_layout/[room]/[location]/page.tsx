import Location from "./location";
import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import { fetchLocationsByRoom } from "@/services/locationService";

export const metadata = {
    title: "Location Details",
};

export default async function LocationPage({ params }: { params: { room: string, location: string } }) {
    const session = await getSession();
    if (!session) {
        redirect('/login?redirect=' + encodeURIComponent(`/house_layout/${params.room}/${params.location}`));
    }

    // The location ID is now the same as the location name in the URL
    const locationId = decodeURIComponent(params.location);

    return (
        <Location locationId={locationId}/>
    );
}
