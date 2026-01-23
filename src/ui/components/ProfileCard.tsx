"use client";

import type { ProfileData } from "@/app/profile/actions";

import { Button } from "@/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/Card";
import { Icon } from "@/ui/components/Icon";
import { cn } from "@/utils/tailwind";

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
          <CardContent className="space-y-4">
            {showLogoutConfirm ? (
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
            ) : profileData ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      iconKey="user"
                      variant="secondary"
                      size="sm"
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-secondary">Name</p>
                      <p className="font-bold text-text-main truncate">
                        {profileData.user.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Family Info */}
                {profileData.family && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        iconKey="home"
                        variant="default"
                        size="sm"
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-secondary">Family</p>
                        <p className="font-medium text-text-main truncate">
                          {profileData.family.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* House Info */}
                {profileData.house && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        iconKey="smile"
                        variant="orange"
                        size="sm"
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-secondary">House</p>
                        <p className="font-medium text-text-main truncate">
                          {profileData.house.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-border/50">
                  <div className="text-center p-2 bg-primary-accent/10 rounded-2xl">
                    <p className="text-2xl font-extrabold text-primary-accent">
                      {profileData.stats.totalRooms}
                    </p>
                    <p className="text-xs text-text-secondary font-medium">
                      Rooms
                    </p>
                  </div>
                  <div className="text-center p-2 bg-cyan-300/20 rounded-2xl">
                    <p className="text-2xl font-extrabold text-cyan-600">
                      {profileData.stats.totalItems}
                    </p>
                    <p className="text-xs text-text-secondary font-medium">
                      Items
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onLogout}
                  className="w-full mt-2"
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
