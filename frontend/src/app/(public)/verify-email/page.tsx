"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <AuthLayout title="Check your email" subtitle="We sent a verification link">
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40 text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <p className="text-surface-400 text-sm">
          We sent a verification link to{" "}
          <span className="text-white font-medium">{email}</span>. Please check
          your inbox and click the link to verify your account.
        </p>
        <p className="text-surface-500 text-xs">
          Didn't receive it? Check your spam folder or try again in a few
          minutes.
        </p>
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
