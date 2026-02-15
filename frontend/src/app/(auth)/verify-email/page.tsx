"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth";
import { Button } from "@/components/ui";
import { resendVerification } from "@/lib/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await resendVerification(email);
      setSent(true);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Check your email" subtitle="We sent a verification link">
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40 text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <p className="text-surface-400 text-sm">
          We sent a verification link to{" "}
          <span className="text-white font-medium">
            {email || "your email"}
          </span>
          . Please check your inbox and click the link to verify your account.
        </p>
        <p className="text-surface-500 text-xs">
          Didn't receive it? Check your spam folder or click below to resend.
        </p>
        {sent ? (
          <p className="text-brand-500 text-sm">Verification link resent!</p>
        ) : (
          <Button
            variant="secondary"
            className="mt-2"
            onClick={handleResend}
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Resend verification email"}
          </Button>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
