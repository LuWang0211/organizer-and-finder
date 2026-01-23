"use client";

import { usePathname } from "next/navigation";
import { ProfileContainer } from "@/app/profile/ProfileContainer";

export function ProfileWrapper() {
  const pathname = usePathname();

  // Hide ProfileButton on login page
  if (pathname === "/login") {
    return null;
  }

  return <ProfileContainer />;
}
