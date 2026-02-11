"use client";

import { useState } from "react";
import { Button, InputField } from "@/components/ui";
import Card from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";
import { updateProfile, changePassword } from "@/lib/auth";

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [tab, setTab] = useState<"profile" | "security">("profile");

  // Profile state
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName });
      await refresh();
      setProfileSuccess("Profile updated");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials =
    (user?.first_name?.[0] || "") + (user?.last_name?.[0] || "") ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Tabs */}
      <div className="flex gap-1">
        {(["profile", "security"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-mono capitalize transition-colors ${
              tab === t
                ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                : "text-surface-500 hover:text-surface-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <form onSubmit={handleProfileSubmit}>
          <Card className="p-6">
            <h3 className="text-sm font-mono font-bold text-surface-200 mb-6">
              Profile
            </h3>

            {profileError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {profileSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-mono font-bold text-xl">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-mono text-surface-200">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs font-mono text-surface-500">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <InputField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <InputField
                label="Email"
                type="email"
                value={user?.email || ""}
                disabled
              />
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* Security */}
      {tab === "security" && (
        <form onSubmit={handlePasswordSubmit}>
          <Card className="p-6">
            <h3 className="text-sm font-mono font-bold text-surface-200 mb-6">
              Change Password
            </h3>

            {passwordError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {passwordSuccess}
              </div>
            )}

            <div className="space-y-4">
              <InputField
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <InputField
                label="New Password"
                type="password"
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
