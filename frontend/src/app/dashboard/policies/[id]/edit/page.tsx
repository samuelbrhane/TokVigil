"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import PolicyForm from "@/components/dashboard/PolicyForm";
import { getPolicy, updatePolicy } from "@/lib/policies";
import { Policy, PolicyFormData } from "@/types/policy";

function EditPolicyContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const policyId = Number(params.id);
  const workspaceId = Number(searchParams.get("workspace"));
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!workspaceId || !policyId) return;
    getPolicy(workspaceId, policyId)
      .then(setPolicy)
      .catch(() => setError("Policy not found"))
      .finally(() => setFetching(false));
  }, [workspaceId, policyId]);

  if (!workspaceId) {
    return (
      <div className="text-center py-16">
        <p className="text-surface-400">
          No workspace selected. Go back to policies and select a workspace.
        </p>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="max-w-2xl space-y-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-surface-800/20 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="text-center py-16">
        <p className="text-surface-400">Policy not found.</p>
      </div>
    );
  }

  const handleSubmit = async (data: PolicyFormData) => {
    setError("");
    setLoading(true);
    try {
      await updatePolicy(workspaceId, policyId, data);
      router.push("/dashboard/policies");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const initialData = {
    name: policy.name,
    plan: policy.plan || "",
    feature: policy.feature || "",
    user_id: policy.user_id || "",
    requests_per_day: policy.requests_per_day,
    requests_per_month: policy.requests_per_month,
    tokens_per_day: policy.tokens_per_day,
    tokens_per_month: policy.tokens_per_month,
    budget_per_day_usd: policy.budget_per_day_usd,
    budget_per_month_usd: policy.budget_per_month_usd,
    max_cost_per_request_usd: policy.max_cost_per_request_usd,
    allowed_models: policy.allowed_models || [],
    priority: policy.priority,
  };

  return (
    <div className="max-w-2xl">
      <PolicyForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Update Policy"
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default function EditPolicyPage() {
  return (
    <Suspense>
      <EditPolicyContent />
    </Suspense>
  );
}
