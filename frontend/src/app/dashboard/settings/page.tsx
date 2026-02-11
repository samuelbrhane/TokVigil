"use client";

import { useState } from "react";
import { Button, InputField } from "@/components/ui";
import Card from "@/components/ui/Card";

export default function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "security">("profile");

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
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-6">
            Profile
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-mono font-bold text-xl">
                L
              </div>
              <Button variant="secondary" size="sm">
                Change Avatar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" defaultValue="Luka" />
              <InputField label="Last Name" defaultValue="" />
            </div>
            <InputField
              label="Email"
              type="email"
              defaultValue="luka@tokenfence.io"
              disabled
            />
            <Button variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </Card>
      )}

      {/* Security */}
      {tab === "security" && (
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-6">
            Change Password
          </h3>
          <div className="space-y-4">
            <InputField
              label="Current Password"
              type="password"
              placeholder="••••••••"
            />
            <InputField
              label="New Password"
              type="password"
              placeholder="Min 8 characters"
            />
            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Repeat new password"
            />
            <Button variant="primary" size="sm">
              Update Password
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
