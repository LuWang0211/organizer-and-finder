import Location from "./location";
export default async function LocationPage({ params }: { params: { location: number } }) {

    return (
        <Location locationId={params.location}/>
    );
}
