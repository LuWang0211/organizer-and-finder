"use client";

import type { ProfileData } from "@/app/profile/actions";

import { Button } from "@/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/Card";
import { Icon } from "@/ui/components/Icon";
import { cn } from "@/utils/tailwind";

// ==================== Sub-components ====================

interface LogoutConfirmProps {
  isLoggingOut: boolean;
  onConfirmLogout: () => void;
  onCancelLogout: () => void;
}

function LogoutConfirm({
  isLoggingOut,
  onConfirmLogout,
  onCancelLogout,
}: LogoutConfirmProps) {
  return (
    <div className="space-y-3">
      <p className="text-text-secondary text-base">
        Are you sure you want to log out?
      </p>
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirmLogout}
          disabled={isLoggingOut}
          className="flex-1"
        >
          {isLoggingOut ? "Logging out..." : "Confirm"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onCancelLogout}
          disabled={isLoggingOut}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

interface ProfileInfoProps {
  iconKey: "user" | "home" | "smile";
  variant?: "default" | "secondary" | "orange";
  label: string;
  value: string;
  fontWeight?: "bold" | "medium";
}

function ProfileInfo({
  iconKey,
  variant = "default",
  label,
  value,
  fontWeight = "medium",
}: ProfileInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon
          iconKey={iconKey}
          variant={variant}
          size="sm"
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className={`font-${fontWeight} text-text-main truncate`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProfileStatsProps {
  totalRooms: number;
  totalItems: number;
}

function ProfileStats({ totalRooms, totalItems }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-border/50">
      <div className="text-center p-2 bg-primary-accent/10 rounded-2xl">
        <p className="text-2xl font-extrabold text-primary-accent">
          {totalRooms}
        </p>
        <p className="text-xs text-text-secondary font-medium">Rooms</p>
      </div>
      <div className="text-center p-2 bg-cyan-300/20 rounded-2xl">
        <p className="text-2xl font-extrabold text-cyan-600">{totalItems}</p>
        <p className="text-xs text-text-secondary font-medium">Items</p>
      </div>
    </div>
  );
}

interface ProfileContentProps {
  profileData: ProfileData;
  onLogout: () => void;
}

function ProfileContent({ profileData, onLogout }: ProfileContentProps) {
  return (
    <div className="space-y-4">
      <ProfileInfo
        iconKey="user"
        variant="secondary"
        label="Name"
        value={profileData.user.name}
        fontWeight="bold"
      />

      {profileData.family && (
        <ProfileInfo
          iconKey="home"
          label="Family"
          value={profileData.family.name}
        />
      )}

      {profileData.house && (
        <ProfileInfo
          iconKey="smile"
          variant="orange"
          label="House"
          value={profileData.house.name}
        />
      )}

      <ProfileStats
        totalRooms={profileData.stats.totalRooms}
        totalItems={profileData.stats.totalItems}
      />

      <Button
        variant="secondary"
        size="sm"
        onClick={onLogout}
        className="w-full mt-2"
      >
        Log Out
      </Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full" />
    </div>
  );
}

// ==================== Content Router ====================

interface ProfileCardContentProps {
  showLogoutConfirm: boolean;
  isLoggingOut: boolean;
  profileData: ProfileData | null;
  onLogout: () => void;
  onCancelLogout: () => void;
  onConfirmLogout: () => void;
}

function ProfileCardContent({
  showLogoutConfirm,
  isLoggingOut,
  profileData,
  onLogout,
  onCancelLogout,
  onConfirmLogout,
}: ProfileCardContentProps) {
  if (showLogoutConfirm) {
    return (
      <LogoutConfirm
        isLoggingOut={isLoggingOut}
        onConfirmLogout={onConfirmLogout}
        onCancelLogout={onCancelLogout}
      />
    );
  }

  if (profileData) {
    return <ProfileContent profileData={profileData} onLogout={onLogout} />;
  }

  return <LoadingState />;
}

interface ProfileCardProps {
  profileData: ProfileData | null;
  showLogoutConfirm: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
  onCancelLogout: () => void;
  onConfirmLogout: () => void;
  onToggle: () => void;
}

export function ProfileCard({
  profileData,
  showLogoutConfirm,
  isLoggingOut,
  onLogout,
  onCancelLogout,
  onConfirmLogout,
  onToggle,
}: ProfileCardProps) {
  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggle();
          }
        }}
      />

      {/* Animated Profile Card */}
      <div
        className={cn(
          "absolute bottom-20 left-0 w-80",
          "animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out",
        )}
      >
        <Card variant="default" className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-cyan-700">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileCardContent
              showLogoutConfirm={showLogoutConfirm}
              isLoggingOut={isLoggingOut}
              profileData={profileData}
              onLogout={onLogout}
              onCancelLogout={onCancelLogout}
              onConfirmLogout={onConfirmLogout}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
