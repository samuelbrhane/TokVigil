"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PolicyForm from "@/components/dashboard/PolicyForm";
import { createPolicy } from "@/lib/policies";
import { PolicyFormData } from "@/types/policy";

function NewPolicyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = Number(searchParams.get("workspace"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!workspaceId) {
    return (
      <div className="text-center py-16">
        <p className="text-surface-400">
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
    <div className="max-w-2xl">
      <PolicyForm
        onSubmit={handleSubmit}
        submitLabel="Create Policy"
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default function NewPolicyPage() {
  return (
    <Suspense>
      <NewPolicyContent />
    </Suspense>
  );
}
