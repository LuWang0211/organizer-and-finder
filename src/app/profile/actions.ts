"use server";

import { getSession, signOut } from "@/auth";
import { fetchProfileData } from "@/services/profileService";

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function getProfile() {
  const session = await getSession();

  if (!session?.dbUser) {
    throw new Error("Unauthorized");
  }

  return fetchProfileData(session.dbUser.id);
}
