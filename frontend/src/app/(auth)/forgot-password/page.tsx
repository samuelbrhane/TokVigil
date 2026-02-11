"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={
        sent
          ? "We sent you a password reset link"
          : "Enter your email to receive a reset link"
      }
    >
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <span className="text-brand-500 text-lg">✓</span>
            </div>
            <p className="text-sm text-surface-400 leading-relaxed">
              We&apos;ve sent a password reset link to{" "}
              <span className="text-surface-200 font-mono">{email}</span>. Check
              your inbox.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full mt-6">
                ← Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            <p className="text-sm text-surface-500 leading-relaxed">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
            <InputField
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<span className="text-xs">@</span>}
              required
            />
            <Button
              variant="primary"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link →"}
            </Button>
          </form>
        )}
      </div>

      {!sent && (
        <p className="mt-6 text-center text-sm text-surface-500">
          <Link
            href="/login"
            className="text-brand-500/70 hover:text-brand-400 font-mono"
          >
            ← Back to login
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
