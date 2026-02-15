"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { signup } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { authMotion } from "@/lib/motion/auth";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [shake, setShake] = useState(false);

  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    if (!error) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 520);
    return () => clearTimeout(t);
  }, [error]);

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
      setRegistered(true);
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={registered ? "Check your email" : "Create your account"}
      subtitle={
        registered
          ? "We sent a verification link to your email"
          : "Start controlling AI usage in minutes"
      }
    >
      <motion.div
        variants={authMotion.page}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40"
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
          {...authMotion.shakeIf(shake)}
        >
          <AnimatePresence mode="wait">
            {registered ? (
              <motion.div
                key="registered"
                variants={authMotion.panel}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-4"
              >
                <motion.div
                  className="text-4xl"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  ✉️
                </motion.div>

                <motion.p
                  className="text-surface-400 text-sm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  We sent a verification link to{" "}
                  <span className="text-white font-medium">{form.email}</span>.
                  Please check your inbox and click the link to verify your
                  account.
                </motion.p>

                <motion.p
                  className="text-surface-500 text-xs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut", delay: 0.03 }}
                >
                  Didn&apos;t receive it? Check your spam folder or try again in
                  a few minutes.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut", delay: 0.06 }}
                >
                  <Link
                    href="/login"
                    className="inline-block mt-2 text-brand-500 hover:text-brand-400 font-mono font-medium text-sm"
                  >
                    Go to Sign in →
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={authMotion.panel}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="error"
                      variants={authMotion.errorBox}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="mb-4 overflow-hidden"
                    >
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                      <a
                        href="/privacy"
                        className="text-brand-500/70 hover:text-brand-400"
                      >
                        Privacy Policy.
                      </a>
                    </span>
                  </label>

                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <Button
                      variant="primary"
                      className="w-full mt-2"
                      type="submit"
                      disabled={loading}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={loading ? "loading" : "idle"}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                          {loading ? "Creating account..." : "Create Account →"}
                        </motion.span>
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {!registered && (
          <motion.p
            className="mt-6 text-center text-sm text-surface-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-500 hover:text-brand-400 font-mono font-medium"
            >
              Sign in
            </Link>
          </motion.p>
        )}
      </motion.div>
    </AuthLayout>
  );
}
