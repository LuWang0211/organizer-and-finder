"use server";

import { getSession, signOut } from "@/auth";
import {
  fetchItemCountForFamily,
  fetchRoomCountForFamily,
  fetchUser,
} from "@/services/profileService";
import { fetchHouseForFamily } from "@/services/roomService";

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function getProfile() {
  const session = await getSession();

  if (!session?.dbUser) {
    throw new Error("Unauthorized");
  }

  const user = await fetchUser(session.dbUser.id);

  if (!user.family) {
    return {
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
      },
      family: null,
      house: null,
      stats: {
        totalItems: 0,
        totalRooms: 0,
      },
    };
  }

  const [house, totalRooms, totalItems] = await Promise.all([
    fetchHouseForFamily(user.family.id),
    fetchRoomCountForFamily(user.family.id),
    fetchItemCountForFamily(user.family.id),
  ]);

  return {
    user: {
      name: user.name,
      email: user.email,
      username: user.username,
    },
    family: user.family,
    house: house
      ? {
          id: house.id,
          name: house.name,
        }
      : null,
    stats: {
      totalRooms,
      totalItems,
    },
  };
}

export type ProfileData = Awaited<ReturnType<typeof getProfile>>;
