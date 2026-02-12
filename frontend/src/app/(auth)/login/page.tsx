"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { login, resendVerification } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorCode("");
    setResent(false);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setErrorCode(err.data?.detail?.error_code || "");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(email);
      setResent(true);
    } catch {
      // silent fail
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your UsageSentinel account"
    >
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
            <p className="text-red-400">{error}</p>
            {errorCode === "EMAIL_NOT_VERIFIED" && !resent && (
              <button
                onClick={handleResend}
                disabled={resending}
                className="mt-2 text-brand-500 hover:text-brand-400 font-mono text-xs"
              >
                {resending ? "Sending..." : "Resend verification email →"}
              </button>
            )}
            {resent && (
              <p className="mt-2 text-brand-500 text-xs">
                Verification email sent! Check your inbox.
              </p>
            )}
          </div>
        )}

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

          <Button
            variant="primary"
            className="w-full mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-surface-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-brand-500 hover:text-brand-400 font-mono font-medium"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
