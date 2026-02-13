"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PolicyForm from "@/components/dashboard/PolicyForm";
import { createPolicy } from "@/lib/policies";
import { PolicyFormData } from "@/types/policy";

function AnimateIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

function NewPolicyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = Number(searchParams.get("workspace"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!workspaceId) {
    return (
      <div className="text-center py-16">
        <p className="text-surface-400 text-sm font-mono">
          No workspace selected. Go back to policies and select a workspace.
        </p>
      </div>
    );
  }

  const handleSubmit = async (data: PolicyFormData) => {
    setError("");
    setLoading(true);
    try {
      await createPolicy(workspaceId, data);
      router.push("/dashboard/policies");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimateIn delay={50}>
      <div className="w-full max-w-2xl">
        <PolicyForm
          onSubmit={handleSubmit}
          submitLabel="Create Policy"
          loading={loading}
          error={error}
        />
      </div>
    </AnimateIn>
  );
}

export default function NewPolicyPage() {
  return (
    <Suspense>
      <NewPolicyContent />
    </Suspense>
  );
}
