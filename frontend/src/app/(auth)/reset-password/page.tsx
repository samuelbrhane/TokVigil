"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { resetPassword } from "@/lib/auth";
import { AnimatePresence, motion } from "framer-motion";
import { authMotion } from "@/lib/motion/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (!error) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 520);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS
  if (success) {
    return (
      <AuthLayout
        title="Password reset!"
        subtitle="Your password has been updated"
      >
        <motion.div
          variants={authMotion.page}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40 text-center space-y-4"
            variants={authMotion.panel}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="text-4xl"
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              ✅
            </motion.div>
            <motion.p
              className="text-surface-400 text-sm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              Your password has been reset successfully. You can now sign in
              with your new password.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            >
              <Link
                href="/login"
                className="inline-block mt-2 text-brand-500 hover:text-brand-400 font-mono font-medium text-sm"
              >
                Go to Sign in →
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AuthLayout>
    );
  }

  // INVALID TOKEN
  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        subtitle="This reset link is invalid or expired"
      >
        <motion.div
          variants={authMotion.page}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40 text-center space-y-4"
            variants={authMotion.panel}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="text-4xl"
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              ❌
            </motion.div>
            <motion.p
              className="text-surface-400 text-sm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              This password reset link is invalid or has expired.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            >
              <Link
                href="/forgot-password"
                className="inline-block mt-2 text-brand-500 hover:text-brand-400 font-mono font-medium text-sm"
              >
                Request a new link →
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AuthLayout>
    );
  }

  // FORM
  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter your new password below"
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
            <InputField
              label="New password"
              type="password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<span className="text-xs">⬡</span>}
              required
              minLength={8}
            />
            <InputField
              label="Confirm new password"
              type="password"
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              icon={<span className="text-xs">⬡</span>}
              required
            />

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}>
              <Button
                variant="primary"
                className="w-full"
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
                    {loading ? "Resetting..." : "Reset Password →"}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
