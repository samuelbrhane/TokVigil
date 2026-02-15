"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { forgotPassword } from "@/lib/auth";
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeInOut" },
  },
} as const;

const panelVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.985,
    transition: { duration: 0.22, ease: "easeInOut" },
  },
} as const;

const errorVariants = {
  initial: { opacity: 0, y: -6, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.2 },
  },
  exit: { opacity: 0, y: -6, height: 0, transition: { duration: 0.16 } },
};

const shakeKeyframes = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.45, ease: "easeInOut" as const },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={
        sent
          ? "We sent you a password reset link"
          : "Enter your email to receive a reset link"
      }
    >
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40"
          variants={panelVariants}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center py-4"
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <motion.span
                    className="text-brand-500 text-lg"
                    initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 16,
                      delay: 0.05,
                    }}
                  >
                    ✓
                  </motion.span>
                </motion.div>

                <motion.p
                  className="text-sm text-surface-400 leading-relaxed"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  We&apos;ve sent a password reset link to{" "}
                  <span className="text-surface-200 font-mono">{email}</span>.
                  Check your inbox.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.12 }}
                >
                  <Link href="/login">
                    <Button variant="secondary" className="w-full mt-6">
                      ← Back to Login
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                {...(shake ? shakeKeyframes : {})}
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="error"
                      variants={errorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm overflow-hidden"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.p
                  className="text-sm text-surface-500 leading-relaxed"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.03 }}
                >
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<span className="text-xs">@</span>}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.06 }}
                >
                  <motion.div
                    whileTap={{ scale: 0.985 }}
                    whileHover={{ y: -1 }}
                  >
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
                          transition={{ duration: 0.18 }}
                        >
                          {loading ? "Sending..." : "Send Reset Link →"}
                        </motion.span>
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {!sent && (
            <motion.p
              key="backlink"
              className="mt-6 text-center text-sm text-surface-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <Link
                href="/login"
                className="text-brand-500/70 hover:text-brand-400 font-mono"
              >
                ← Back to login
              </Link>
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </AuthLayout>
  );
}
