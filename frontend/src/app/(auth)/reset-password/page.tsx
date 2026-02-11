"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { resetPassword } from "@/lib/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password reset!"
        subtitle="Your password has been updated"
      >
        <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40 text-center space-y-4">
          <div className="text-4xl">✅</div>
          <p className="text-surface-400 text-sm">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
          <Link
            href="/login"
            className="inline-block mt-2 text-brand-500 hover:text-brand-400 font-mono font-medium text-sm"
          >
            Go to Sign in →
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        subtitle="This reset link is invalid or expired"
      >
        <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40 text-center space-y-4">
          <div className="text-4xl">❌</div>
          <p className="text-surface-400 text-sm">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block mt-2 text-brand-500 hover:text-brand-400 font-mono font-medium text-sm"
          >
            Request a new link →
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter your new password below"
    >
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="New password"
            type="password"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<span className="text-xs">⬡</span>}
            required
            minLength={8}
          />
          <InputField
            label="Confirm new password"
            type="password"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            icon={<span className="text-xs">⬡</span>}
            required
          />
          <Button
            variant="primary"
            className="w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password →"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
