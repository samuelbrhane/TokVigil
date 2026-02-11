"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    confirm: "",
  });

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await signup({
        email: form.email,
        password: form.password,
        first_name: form.first,
        last_name: form.last,
      });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start controlling AI usage in minutes"
    >
      <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="First name"
              placeholder="Ada"
              value={form.first}
              onChange={update("first")}
              required
            />
            <InputField
              label="Last name"
              placeholder="Lovelace"
              value={form.last}
              onChange={update("last")}
              required
            />
          </div>

          <InputField
            label="Work email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={update("email")}
            icon={<span className="text-xs">@</span>}
            required
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={update("password")}
            icon={<span className="text-xs">⬡</span>}
            required
            minLength={8}
          />
          <InputField
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={update("confirm")}
            icon={<span className="text-xs">⬡</span>}
            required
          />

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 mt-0.5 rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500/20"
              required
            />
            <span className="text-xs text-surface-500 leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-brand-500/70 hover:text-brand-400">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-brand-500/70 hover:text-brand-400">
                Privacy Policy
              </a>
            </span>
          </label>

          <Button
            variant="primary"
            className="w-full mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-surface-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-brand-500 hover:text-brand-400 font-mono font-medium"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
