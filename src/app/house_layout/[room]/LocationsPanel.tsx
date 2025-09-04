import { fetchLocationsByRoom } from "@/services/locationService";
import LocationList from "./LocationsList";

export default async function LocationsPanel({ roomId }: { roomId: string }) {
  const locationsData = await fetchLocationsByRoom(roomId);
  return (
    <LocationList locations={locationsData} roomId={roomId} loading={false} />
  );
}

