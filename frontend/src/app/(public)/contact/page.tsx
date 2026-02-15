"use client";

import { useEffect, useState } from "react";
import { Button, InputField, GridBackground } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { submitContact } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { authMotion } from "@/lib/motion/auth";

const formStagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
} as const;

const fieldIn = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
} as const;

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!error) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 520);
    return () => clearTimeout(t);
  }, [error]);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await submitContact(form);
      setSent(true);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 pb-24">
      <div className="relative">
        <GridBackground opacity={0.02} />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={authMotion.page}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <PageHeader
                tag="Contact"
                title="Get in touch"
                highlight=""
                description="Have a question or need help? We'd love to hear from you."
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact form */}
              <motion.div
                className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40"
                variants={authMotion.panel}
                initial="initial"
                animate="animate"
                {...authMotion.shakeIf(shake)}
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="sent"
                      variants={authMotion.panel}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-center py-12"
                    >
                      <motion.div
                        className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                        }}
                      >
                        <motion.span
                          className="text-brand-500 text-lg"
                          initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
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

                      <motion.h3
                        className="text-lg font-bold font-mono text-surface-100 mb-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      >
                        Message sent
                      </motion.h3>

                      <motion.p
                        className="text-sm text-surface-500"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: "easeOut",
                          delay: 0.03,
                        }}
                      >
                        We&apos;ll get back to you as soon as possible.
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: "easeOut",
                          delay: 0.06,
                        }}
                        whileTap={{ scale: 0.985 }}
                        whileHover={{ y: -1 }}
                      >
                        <Button
                          variant="secondary"
                          className="mt-6"
                          onClick={() => {
                            setSent(false);
                            setForm({
                              name: "",
                              email: "",
                              subject: "",
                              message: "",
                            });
                          }}
                        >
                          Send another message
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                      variants={formStagger}
                      initial="initial"
                      animate="animate"
                    >
                      <motion.div variants={fieldIn}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Name"
                            placeholder="Your name"
                            value={form.name}
                            onChange={update("name")}
                            required
                          />
                          <InputField
                            label="Email"
                            type="email"
                            placeholder="you@company.com"
                            value={form.email}
                            onChange={update("email")}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fieldIn} className="space-y-1.5">
                        <label className="block text-xs font-mono font-medium tracking-wider uppercase text-surface-400">
                          Subject
                        </label>
                        <select
                          className="w-full bg-surface-900/80 border border-surface-700/60 rounded-lg px-4 py-3 text-sm text-surface-200 font-mono focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20"
                          value={form.subject}
                          onChange={(e) =>
                            setForm({ ...form, subject: e.target.value })
                          }
                          required
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General inquiry</option>
                          <option value="support">Technical support</option>
                          <option value="feedback">Feedback</option>
                          <option value="bug">Bug report</option>
                        </select>
                      </motion.div>

                      <motion.div variants={fieldIn} className="space-y-1.5">
                        <label className="block text-xs font-mono font-medium tracking-wider uppercase text-surface-400">
                          Message
                        </label>
                        <textarea
                          placeholder="Tell us how we can help..."
                          rows={5}
                          value={form.message}
                          onChange={update("message")}
                          required
                          className="w-full bg-surface-900/80 border border-surface-700/60 rounded-lg px-4 py-3 text-sm text-surface-200 placeholder-surface-600 font-mono focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200 resize-none"
                        />
                      </motion.div>

                      <AnimatePresence>
                        {error && (
                          <motion.p
                            key="error"
                            variants={authMotion.errorBox}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-xs font-mono text-red-400 overflow-hidden"
                          >
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.div
                        variants={fieldIn}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.985 }}
                      >
                        <Button
                          variant="primary"
                          className="w-full"
                          type="submit"
                          disabled={sending}
                        >
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={sending ? "sending" : "idle"}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                              {sending ? "Sending..." : "Send Message →"}
                            </motion.span>
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Contact info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
              >
                <div>
                  <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
                    Other ways to reach us
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-mono text-surface-500 uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:support@tokvigil.com"
                        className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        support@tokvigil.com
                      </a>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="p-5 rounded-xl border border-surface-800/40 bg-surface-900/30"
                  variants={authMotion.panel}
                  initial="initial"
                  animate="animate"
                >
                  <h4 className="text-sm font-mono font-bold text-surface-200 mb-2">
                    Open source & free
                  </h4>
                  <p className="text-sm text-surface-500 leading-relaxed">
                    TokVigil is free for all developers. If you need help
                    getting started, have a feature request, or found a bug,
                    don&apos;t hesitate to reach out.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
