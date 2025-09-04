import { fetchLocationsByRoom } from "@/services/locationService";
import LocationList from "./Locations";

export default async function LocationsPanel({ roomId }: { roomId: string }) {
  const locationsData = await fetchLocationsByRoom(roomId);
  return (
    <LocationList locations={locationsData} roomId={roomId} loading={false} />
  );
}

