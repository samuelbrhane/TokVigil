import { GridBackground } from "@/components/ui";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using UsageSentinel, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. These terms apply to all users, including developers integrating our SDKs and dashboard users.",
  },
  {
    title: "2. Description of Service",
    content:
      "UsageSentinel is an application-layer AI usage control platform. We provide APIs, SDKs (Python and TypeScript), a VS Code extension, and a web dashboard that allow developers to enforce usage policies, rate limits, and budgets on AI calls within their applications. UsageSentinel does not provide AI models, does not process or store LLM prompts or responses, and does not act as a proxy between your application and AI providers.",
  },
  {
    title: "3. Account Registration",
    content:
      "You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and API keys. You are responsible for all activity that occurs under your account. You must notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "4. API Keys and Security",
    content:
      "API keys are shown once at creation and cannot be retrieved afterward. You are responsible for keeping your API keys secure. Do not share API keys in public repositories, client-side code, or unsecured locations. If you suspect a key has been compromised, revoke it immediately through the dashboard.",
  },
  {
    title: "5. Acceptable Use",
    content:
      "You may use UsageSentinel for any lawful purpose consistent with these terms. You may not: use the platform to circumvent or disable security controls of third-party services; attempt to gain unauthorized access to our systems; use the platform for any activity that violates applicable laws; resell or redistribute the service without our written consent; submit false or misleading usage data.",
  },
  {
    title: "6. Plans and Billing",
    content:
      "UsageSentinel offers Free, Pro, Premium, and Enterprise plans with varying limits. Plan limits (evaluate calls, API keys, workspaces, team members, rate limits) are enforced automatically. Exceeding plan limits will result in blocked requests, not overage charges. Paid plans are billed monthly. You may upgrade, downgrade, or cancel at any time. Changes take effect immediately with pro-rated billing. Refunds are handled on a case-by-case basis.",
  },
  {
    title: "7. Data and Privacy",
    content:
      "Our handling of your data is governed by our Privacy Policy. In summary: we collect account information and API usage metadata. We do not collect, store, or process your LLM prompts, responses, or end-user personal data beyond the identifiers you choose to send.",
  },
  {
    title: "8. Availability and SLA",
    content:
      "We aim for high availability but do not guarantee uninterrupted service on Free, Pro, or Premium plans. Enterprise plans include SLA terms defined in separate agreements. Our SDKs include graceful degradation — if the UsageSentinel API is unreachable, you can configure your application to allow or block requests by default.",
  },
  {
    title: "9. Intellectual Property",
    content:
      "UsageSentinel and its associated SDKs, documentation, and branding are our intellectual property. You retain full ownership of your application code, policies, and usage data. Our SDKs are provided under open-source licenses as specified in their respective repositories.",
  },
  {
    title: "10. Limitation of Liability",
    content:
      'UsageSentinel is provided "as is" without warranties of any kind, express or implied. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability is limited to the amount you paid us in the 12 months preceding the claim. We are not responsible for costs incurred from AI provider usage, even if our policy evaluation incorrectly allows a request.',
  },
  {
    title: "11. Termination",
    content:
      "You may terminate your account at any time through the dashboard or by contacting support. We may suspend or terminate accounts that violate these terms, with notice when possible. Upon termination, your data will be retained for 30 days and then permanently deleted unless required by law.",
  },
  {
    title: "12. Changes to Terms",
    content:
      "We may update these terms from time to time. Material changes will be communicated via email or a notice on our website at least 14 days before taking effect. Continued use of the platform after changes constitutes acceptance.",
  },
  {
    title: "13. Contact",
    content:
      "For questions about these terms, contact us at support@usagesentinel.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="relative">
        <GridBackground opacity={0.02} />
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-100 font-mono">
              Terms of Service
            </h1>
            <p className="mt-4 text-sm text-surface-500 font-mono">
              Last updated: February 2026
            </p>
          </div>

          <div className="space-y-10">
            <p className="text-surface-400 leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your use of
              UsageSentinel, operated by UsageSentinel (&quot;we&quot;,
              &quot;our&quot;, &quot;us&quot;). Please read them carefully.
            </p>

            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold font-mono text-surface-200 mb-3">
                  {section.title}
                </h2>
                <p className="text-sm text-surface-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
