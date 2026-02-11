"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [done, setDone] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <AuthLayout
      title={done ? "Password updated" : "Set a new password"}
      subtitle={done ? "You can now sign in with your new password" : "Choose a strong password"}
    >
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40">
        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <span className="text-brand-500 text-lg">✓</span>
            </div>
            <p className="text-sm text-surface-400">
              Your password has been reset successfully.
            </p>
            <Link href="/login">
              <Button variant="primary" className="w-full mt-6">
                Sign In →
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="New password"
              type="password"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={update("password")}
              icon={<span className="text-xs">⬡</span>}
              required
              minLength={8}
            />
            <InputField
              label="Confirm password"
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={update("confirm")}
              icon={<span className="text-xs">⬡</span>}
              required
            />
            <Button variant="primary" className="w-full" type="submit">
              Reset Password →
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
