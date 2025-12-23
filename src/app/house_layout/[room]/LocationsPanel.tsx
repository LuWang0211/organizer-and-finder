import { fetchLocationsByRoom } from "@/services/locationService";
import LocationsList from "./LocationsList";

export default async function LocationsPanel({ roomId }: { roomId: string }) {
  const locationsData = await fetchLocationsByRoom(roomId);
  return (
    <LocationsList locations={locationsData} roomId={roomId} loading={false} />
  );
}
