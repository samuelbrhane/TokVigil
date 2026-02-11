"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout, SocialAuth } from "@/components/auth";
import { Button, InputField } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your TokenFence account">
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<span className="text-xs">@</span>}
            required
          />
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<span className="text-xs">⬡</span>}
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500/20"
              />
              <span className="text-xs text-surface-500">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand-500/70 hover:text-brand-400 transition-colors font-mono"
            >
              Forgot password?
            </Link>
          </div>

          <Button variant="primary" className="w-full mt-2" type="submit">
            Sign In →
          </Button>
        </form>

        <SocialAuth mode="login" />
      </div>

      <p className="mt-6 text-center text-sm text-surface-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-500 hover:text-brand-400 font-mono font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
