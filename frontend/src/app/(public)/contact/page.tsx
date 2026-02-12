"use client";

import { useState } from "react";
import { Button, InputField, GridBackground } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { submitContact } from "@/lib/api";

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
          <PageHeader
            tag="Contact"
            title="Get in touch"
            highlight=""
            description="Have a question or need help? We'd love to hear from you."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact form */}
            <div className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/40">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <span className="text-brand-500 text-lg">✓</span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-surface-100 mb-2">
                    Message sent
                  </h3>
                  <p className="text-sm text-surface-500">
                    We&apos;ll get back to you as soon as possible.
                  </p>
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
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="space-y-1.5">
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
                  </div>
                  <div className="space-y-1.5">
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
                  </div>
                  {error && (
                    <p className="text-xs font-mono text-red-400">{error}</p>
                  )}
                  <Button
                    variant="primary"
                    className="w-full"
                    type="submit"
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Message →"}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-8">
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
                      href="mailto:support@tokenfence.io"
                      className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      support@tokenfence.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-surface-800/40 bg-surface-900/30">
                <h4 className="text-sm font-mono font-bold text-surface-200 mb-2">
                  Open source & free
                </h4>
                <p className="text-sm text-surface-500 leading-relaxed">
                  UsageSentinel is free for all developers. If you need help
                  getting started, have a feature request, or found a bug,
                  don&apos;t hesitate to reach out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
