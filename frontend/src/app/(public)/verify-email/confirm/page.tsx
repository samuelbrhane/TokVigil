"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { verifyEmail } from "@/lib/auth";

function VerifyEmailConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <AuthLayout
      title={
        status === "loading"
          ? "Verifying..."
          : status === "success"
            ? "Email verified!"
            : "Verification failed"
      }
      subtitle={
        status === "loading"
          ? "Please wait"
          : status === "success"
            ? "Your account is ready"
            : "The link may be invalid or expired"
      }
    >
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40 text-center space-y-4">
        {status === "loading" && (
          <div className="text-4xl animate-spin">⏳</div>
        )}

        {status === "success" && (
          <>
            <div className="text-4xl">✅</div>
            <p className="text-surface-400 text-sm">
              Your email has been verified. You can now sign in.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 text-brand-500 hover:text-brand-400 font-mono font-medium text-sm"
            >
              Go to Sign in →
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-4xl">❌</div>
            <p className="text-surface-400 text-sm">
              This verification link is invalid or has already been used.
            </p>
            <Link
              href="/verify-email"
              className="inline-block mt-2 text-brand-500 hover:text-brand-400 font-mono font-medium text-sm"
            >
              Request a new link →
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailConfirmPage() {
  return (
    <Suspense>
      <VerifyEmailConfirmContent />
    </Suspense>
  );
}
