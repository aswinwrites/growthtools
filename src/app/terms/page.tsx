import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "MarketerTools Terms of Service — the rules for using our free marketing tools.",
};

export default function TermsPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          Last updated: 1 July 2026
        </p>

        <div className="mt-10 space-y-10 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Acceptance of terms
            </h2>
            <p className="mt-3">
              By accessing or using MarketerTools at{" "}
              <a
                href="https://www.marketertools.fyi"
                className="text-blue-600 hover:underline"
              >
                marketertools.fyi
              </a>{" "}
              (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Description of service
            </h2>
            <p className="mt-3">
              MarketerTools provides a suite of free, browser-based utilities for
              marketers — including a UTM builder, QR code generator, keyword
              match type tool, spreadsheet operations, short link creator, and
              more. Core tools are free to use without an account. Optional
              account features (presets, link analytics) require Google sign-in.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Acceptable use
            </h2>
            <p className="mt-3">You agree not to use the Service to:</p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Create short links pointing to malware, phishing sites, illegal content, or spam</li>
              <li>Automate requests in a way that places excessive load on our infrastructure</li>
              <li>Attempt to access other users&apos; data or accounts</li>
              <li>Reverse engineer, copy, or redistribute the Service&apos;s source code without permission</li>
              <li>Use the Service in any way that violates applicable laws</li>
            </ul>
            <p className="mt-4">
              We reserve the right to terminate access for accounts that violate
              these terms or that are used for abuse, spam, or illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Short links
            </h2>
            <p className="mt-3">
              Short links created on MarketerTools are public — anyone with the
              slug can access them. You are responsible for the content of links
              you create. We may disable links that violate these terms or
              applicable law at any time without notice.
            </p>
            <p className="mt-3">
              Click analytics (country, device, referrer) for short links are
              retained for 14 days and then automatically deleted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. AI-powered tools
            </h2>
            <p className="mt-3">
              Some tools use third-party AI APIs to process your inputs
              (e.g., Image to CSV, Screenshot to Text). By using these tools, you
              agree that your inputs may be sent to third-party AI providers.
              Please do not submit confidential, personal, or sensitive
              information through AI-powered tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Intellectual property
            </h2>
            <p className="mt-3">
              The MarketerTools name, logo, and original content are the property
              of MarketerTools. You may not use our branding without written
              permission. Tools you use and outputs you generate are yours — we
              make no claim over content created using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Disclaimer of warranties
            </h2>
            <p className="mt-3">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, express or implied. We do not guarantee
              that the Service will be uninterrupted, error-free, or that
              results obtained from use of the tools will be accurate or
              reliable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Limitation of liability
            </h2>
            <p className="mt-3">
              To the maximum extent permitted by law, MarketerTools and its
              operators shall not be liable for any indirect, incidental, special,
              or consequential damages arising from your use of the Service. Our
              total liability shall not exceed the amount you paid us in the past
              12 months (which, for free users, is zero).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Modifications to the service
            </h2>
            <p className="mt-3">
              We may modify, suspend, or discontinue any part of the Service at
              any time without notice. We may also update these Terms — continued
              use after changes are posted constitutes acceptance of the updated
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              10. Governing law
            </h2>
            <p className="mt-3">
              These Terms are governed by the laws of India. Any disputes shall
              be subject to the exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              11. Contact
            </h2>
            <p className="mt-3">
              Questions about these Terms? Email{" "}
              <a
                href="mailto:aswinwrites@gmail.com"
                className="text-blue-600 hover:underline"
              >
                aswinwrites@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
