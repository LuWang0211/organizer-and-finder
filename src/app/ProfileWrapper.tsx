"use client";

import { usePathname } from "next/navigation";
import { ProfileButton } from "@/app/profile/ProfileButton";

export function ProfileWrapper() {
  const pathname = usePathname();

  // Hide ProfileButton on login page
  if (pathname === "/login") {
    return null;
  }

  return <ProfileButton />;
}
