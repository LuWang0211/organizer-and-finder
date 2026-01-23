"use client";

import * as React from "react";
import { ProfileButton } from "@/ui/components/ProfileButton";
import { ProfileCard } from "@/ui/components/ProfileCard";
import type { ProfileData } from "./actions";
import { getProfile, logout } from "./actions";

export function ProfileContainer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [profileData, setProfileData] = React.useState<ProfileData | null>(
    null,
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const fetchProfile = React.useCallback(async () => {
    try {
      const data = await getProfile();
      setProfileData(data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  }, []);

  const handleToggle = React.useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState && !profileData) {
        fetchProfile();
      }
      return newState;
    });
    setShowLogoutConfirm(false);
  }, [profileData, fetchProfile]);

  const handleLogout = React.useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <ProfileButton isOpen={isOpen} onToggle={handleToggle} />
      {isOpen && (
        <ProfileCard
          profileData={profileData}
          showLogoutConfirm={showLogoutConfirm}
          isLoggingOut={isLoggingOut}
          onLogout={() => setShowLogoutConfirm(true)}
          onCancelLogout={() => setShowLogoutConfirm(false)}
          onConfirmLogout={handleLogout}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}
