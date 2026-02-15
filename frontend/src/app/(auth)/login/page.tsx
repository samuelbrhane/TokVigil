"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth";
import { Button, InputField } from "@/components/ui";
import { login, resendVerification } from "@/lib/auth";
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

const errorBoxVariants = {
  initial: { opacity: 0, y: -8, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    transition: { duration: 0.16, ease: "easeInOut" },
  },
} as const;

const shakeKeyframes = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.45, ease: "easeInOut" as const },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

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
    setErrorCode("");
    setResent(false);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setErrorCode(err?.data?.detail?.error_code || "");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(email);
      setResent(true);
    } catch {
      // silent fail
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your TokVigil account"
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
          <AnimatePresence>
            {error && (
              <motion.div
                key="errorbox"
                variants={errorBoxVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-4 overflow-hidden"
              >
                <motion.div
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm"
                  {...(shake ? shakeKeyframes : {})}
                >
                  <p className="text-red-400">{error}</p>

                  <AnimatePresence mode="popLayout" initial={false}>
                    {errorCode === "EMAIL_NOT_VERIFIED" && !resent && (
                      <motion.button
                        key="resendbtn"
                        onClick={handleResend}
                        disabled={resending}
                        className="mt-2 text-brand-500 hover:text-brand-400 font-mono text-xs"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {resending
                          ? "Sending..."
                          : "Resend verification email →"}
                      </motion.button>
                    )}

                    {resent && (
                      <motion.p
                        key="resent"
                        className="mt-2 text-brand-500 text-xs"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        Verification email sent! Check your inbox.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={panelVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
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
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.03 }}
            >
              <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<span className="text-xs">⬡</span>}
                required
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.06 }}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500/20"
                />
                <span className="text-xs text-surface-500">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-xs text-brand-500/70 hover:text-brand-400 transition-colors font-mono"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.09 }}
            >
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}>
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
                      {loading ? "Signing in..." : "Sign In →"}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </motion.div>

        <motion.p
          className="mt-6 text-center text-sm text-surface-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-brand-500 hover:text-brand-400 font-mono font-medium"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}
