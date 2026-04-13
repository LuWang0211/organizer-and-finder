import {
  fetchItemCountForFamily,
  fetchLocationCountForFamily,
  fetchRoomCountForFamily,
} from "@/services/profileService";
import { fetchHouseForFamily } from "@/services/roomService";

export interface HomeSummary {
  houseName: string | null;
  totalRooms: number;
  totalLocations: number;
  totalItems: number;
}

export async function getHomeSummaryForFamily(
  familyId: number,
): Promise<HomeSummary> {
  const [house, totalRooms, totalLocations, totalItems] = await Promise.all([
    fetchHouseForFamily(familyId),
    fetchRoomCountForFamily(familyId),
    fetchLocationCountForFamily(familyId),
    fetchItemCountForFamily(familyId),
  ]);

  return {
    houseName: house?.name ?? null,
    totalRooms,
    totalLocations,
    totalItems,
  };
}
