import { MapPin } from "lucide-react";
import AuthProtectedComponent from "@/AuthProtectedComponent";
import { getSession } from "@/auth";
import {
  fetchHouseForFamily,
  fetchRoomsForHouse,
} from "@/services/roomService";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/Card";
import { Icon } from "@/ui/components/Icon";
import AddLocationForm from "./AddLocationForm";
import { addLocation } from "./actions";

async function DataLoader({
  searchParams,
}: {
  searchParams?: Promise<{ roomId?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const house = await fetchHouseForFamily(session.dbUser.familyId!);
  if (!house) throw new Error("No house found for family");

  const rooms = await fetchRoomsForHouse(house.id);
  const defaultRoomId = searchParams ? (await searchParams)?.roomId : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4 text-center">
          <div className="flex justify-center mb-6">
            <Icon variant="orange" size="lg" iconKey="map-pin" />
          </div>
          <CardTitle className="text-3xl font-extrabold mb-2">
            Add Location
          </CardTitle>
          <p className="text-base text-text-main/80 font-medium">
            Create a location under a room.
          </p>
        </CardHeader>
        <CardContent>
          <AddLocationForm
            rooms={rooms.map((r) => ({ id: r.id, name: r.name }))}
            action={addLocation}
            defaultRoomId={defaultRoomId}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddLocationPage({
  searchParams,
}: {
  searchParams?: Promise<{ roomId?: string }>;
}) {
  return (
    <AuthProtectedComponent>
      <DataLoader searchParams={searchParams} />
    </AuthProtectedComponent>
  );
}
