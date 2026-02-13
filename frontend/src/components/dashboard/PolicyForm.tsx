"use client";

import { useEffect, useState } from "react";
import { Button, InputField } from "@/components/ui";
import Card from "@/components/ui/Card";
import { MODEL_LIST } from "@/lib/models";
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
      className={`transition-all duration-400 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {children}
    </div>
  );
}

interface PolicyFormProps {
  initialData?: Partial<PolicyFormData>;
  onSubmit: (data: PolicyFormData) => Promise<void>;
  submitLabel: string;
  loading: boolean;
  error: string;
}

export default function PolicyForm({
  initialData,
  onSubmit,
  submitLabel,
  loading,
  error,
}: PolicyFormProps) {
  const [form, setForm] = useState<PolicyFormData>({
    name: initialData?.name || "",
    plan: initialData?.plan || "",
    feature: initialData?.feature || "",
    user_id: initialData?.user_id || "",
    requests_per_day: initialData?.requests_per_day ?? null,
    requests_per_month: initialData?.requests_per_month ?? null,
    tokens_per_day: initialData?.tokens_per_day ?? null,
    tokens_per_month: initialData?.tokens_per_month ?? null,
    budget_per_day_usd: initialData?.budget_per_day_usd ?? null,
    budget_per_month_usd: initialData?.budget_per_month_usd ?? null,
    max_cost_per_request_usd: initialData?.max_cost_per_request_usd ?? null,
    allowed_models: initialData?.allowed_models || [],
    priority: initialData?.priority ?? 0,
  });

  const updateField = (field: keyof PolicyFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateNumber = (field: keyof PolicyFormData, value: string) => {
    updateField(field, value === "" ? null : value);
  };

  const toggleModel = (model: string) => {
    setForm((prev) => ({
      ...prev,
      allowed_models: prev.allowed_models.includes(model)
        ? prev.allowed_models.filter((m) => m !== model)
        : [...prev.allowed_models, model],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed: PolicyFormData = {
      ...form,
      requests_per_day: form.requests_per_day
        ? Number(form.requests_per_day)
        : null,
      requests_per_month: form.requests_per_month
        ? Number(form.requests_per_month)
        : null,
      tokens_per_day: form.tokens_per_day ? Number(form.tokens_per_day) : null,
      tokens_per_month: form.tokens_per_month
        ? Number(form.tokens_per_month)
        : null,
      budget_per_day_usd: form.budget_per_day_usd
        ? Number(form.budget_per_day_usd)
        : null,
      budget_per_month_usd: form.budget_per_month_usd
        ? Number(form.budget_per_month_usd)
        : null,
      max_cost_per_request_usd: form.max_cost_per_request_usd
        ? Number(form.max_cost_per_request_usd)
        : null,
    };
    await onSubmit(parsed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <AnimateIn delay={0}>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
            Basic Info
          </h3>
          <div className="space-y-4">
            <InputField
              label="Policy Name"
              placeholder="e.g., free-plan-chat"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Plan (scope)"
                placeholder="e.g., free, pro"
                value={form.plan}
                onChange={(e) => updateField("plan", e.target.value)}
              />
              <InputField
                label="Feature (scope)"
                placeholder="e.g., chat, summarize"
                value={form.feature}
                onChange={(e) => updateField("feature", e.target.value)}
              />
              <InputField
                label="User ID (scope)"
                placeholder="e.g., user_123"
                value={form.user_id}
                onChange={(e) => updateField("user_id", e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/3">
              <InputField
                label="Priority"
                type="number"
                placeholder="0"
                value={form.priority?.toString() || ""}
                onChange={(e) => updateNumber("priority", e.target.value)}
              />
              <p className="text-[10px] text-surface-500 mt-1">
                Higher priority wins when multiple policies match
              </p>
            </div>
          </div>
        </Card>
      </AnimateIn>

      {/* Request Limits */}
      <AnimateIn delay={80}>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
            Request Limits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Requests Per Day"
              type="number"
              placeholder="Leave empty for no limit"
              value={form.requests_per_day?.toString() || ""}
              onChange={(e) => updateNumber("requests_per_day", e.target.value)}
            />
            <InputField
              label="Requests Per Month"
              type="number"
              placeholder="Leave empty for no limit"
              value={form.requests_per_month?.toString() || ""}
              onChange={(e) =>
                updateNumber("requests_per_month", e.target.value)
              }
            />
          </div>
        </Card>
      </AnimateIn>

      {/* Token Limits */}
      <AnimateIn delay={160}>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
            Token Limits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Tokens Per Day"
              type="number"
              placeholder="Leave empty for no limit"
              value={form.tokens_per_day?.toString() || ""}
              onChange={(e) => updateNumber("tokens_per_day", e.target.value)}
            />
            <InputField
              label="Tokens Per Month"
              type="number"
              placeholder="Leave empty for no limit"
              value={form.tokens_per_month?.toString() || ""}
              onChange={(e) => updateNumber("tokens_per_month", e.target.value)}
            />
          </div>
        </Card>
      </AnimateIn>

      {/* Budget Limits */}
      <AnimateIn delay={240}>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
            Budget Limits (USD)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Per Day"
              type="number"
              step="0.001"
              placeholder="e.g., 1.00"
              value={form.budget_per_day_usd?.toString() || ""}
              onChange={(e) =>
                updateNumber("budget_per_day_usd", e.target.value)
              }
            />

            <InputField
              label="Per Month"
              type="number"
              step="0.001"
              placeholder="e.g., 10.00"
              value={form.budget_per_month_usd?.toString() || ""}
              onChange={(e) =>
                updateNumber("budget_per_month_usd", e.target.value)
              }
            />

            <InputField
              label="Per Request (max)"
              type="number"
              step="0.001"
              placeholder="e.g., 0.001"
              value={form.max_cost_per_request_usd?.toString() || ""}
              onChange={(e) =>
                updateNumber("max_cost_per_request_usd", e.target.value)
              }
            />
          </div>
        </Card>
      </AnimateIn>

      {/* Model Restrictions */}
      <AnimateIn delay={320}>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
            Allowed Models
          </h3>
          <p className="text-xs text-surface-500 mb-4">
            Leave unchecked to allow all models
          </p>
          <div className="space-y-6">
            {Object.entries(MODEL_LIST).map(([provider, models]) => (
              <div key={provider}>
                <p className="text-xs font-mono font-bold text-surface-400 uppercase tracking-wider mb-2">
                  {provider}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {models.map((model) => (
                    <label
                      key={model}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.allowed_models.includes(model)}
                        onChange={() => toggleModel(model)}
                        className="w-3.5 h-3.5 rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500/20"
                      />
                      <span className="text-sm font-mono text-surface-300 truncate">
                        {model}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </AnimateIn>

      {/* Actions */}
      <AnimateIn delay={400}>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>
      </AnimateIn>
    </form>
  );
}
