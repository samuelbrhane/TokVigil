import { GridBackground } from "@/components/ui";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "Account information: When you create an account, we collect your name, email address, and password (hashed).",
      "Usage data: We collect metadata about API calls made through our platform — including token counts, model used, cost estimates, timestamps, and status (allowed/blocked). We do not collect or store your LLM prompts, responses, or any content passed to AI models.",
      "API keys: We store hashed versions of your API keys. The full key is shown once at creation and never stored in plaintext.",
      "Payment information: If you subscribe to a paid plan, payment processing is handled by our payment provider. We do not store credit card numbers.",
      "Technical data: IP addresses, browser type, and device information collected automatically through server logs.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To provide and operate the TokVigil platform, including policy evaluation, usage tracking, and analytics.",
      "To enforce rate limits and usage policies as configured by your workspace.",
      "To send transactional emails related to your account (password resets, billing receipts, usage alerts).",
      "To improve the platform and fix bugs.",
      "To comply with legal obligations.",
    ],
  },
  {
    title: "3. What We Do Not Collect",
    content: [
      "LLM prompts or inputs — TokVigil never sees the content you send to AI providers.",
      "LLM responses or outputs — your AI responses go directly between your application and the AI provider.",
      "End-user personal data — we only receive the user_id identifier you choose to pass. We recommend using opaque identifiers, not personal information.",
    ],
  },
  {
    title: "4. Data Sharing",
    content: [
      "We do not sell your data to third parties.",
      "We do not share your data with third parties for marketing purposes.",
      "We may share data with service providers who help us operate the platform (hosting, payment processing) under strict data processing agreements.",
      "We may disclose data if required by law or to protect our rights.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "API keys are hashed using industry-standard algorithms before storage.",
      "All data in transit is encrypted using TLS.",
      "Database access is restricted and monitored.",
      "We follow the principle of least privilege for all system access.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "Account data is retained as long as your account is active.",
      "Usage records are retained for 90 days by default.",
      "Audit logs follow the same retention schedule.",
      "You can request deletion of your account and associated data at any time by contacting support@tokvigil.com.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "Access: You can request a copy of your data at any time.",
      "Correction: You can update your account information through the dashboard.",
      "Deletion: You can request account deletion by contacting us.",
      "Export: Usage data can be exported via the API or dashboard.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time. We will notify you of material changes via email or a notice on our website.",
    ],
  },
  {
    title: "9. Contact",
    content: [
      "For privacy-related questions, contact us at support@tokvigil.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="relative">
        <GridBackground opacity={0.02} />
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-100 font-mono">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-surface-500 font-mono">
              Last updated: February 2026
            </p>
          </div>

          <div className="space-y-10">
            <p className="text-surface-400 leading-relaxed">
              TokVigil (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
              committed to protecting your privacy. This policy explains what
              data we collect, how we use it, and your rights regarding your
              information.
            </p>

            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold font-mono text-surface-200 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-surface-400 leading-relaxed"
                    >
                      <span className="text-brand-500/60 mt-0.5 text-xs">
                        ▸
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
