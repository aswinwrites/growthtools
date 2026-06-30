import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MarketerTools Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          Last updated: 1 July 2026
        </p>

        <div className="mt-10 space-y-10 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Who we are
            </h2>
            <p className="mt-3">
              MarketerTools (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website at{" "}
              <a
                href="https://www.marketertools.fyi"
                className="text-blue-600 hover:underline"
              >
                marketertools.fyi
              </a>{" "}
              and all tools available on it. We are an independent project.
              Questions about this policy can be directed to{" "}
              <a
                href="mailto:aswinwrites@gmail.com"
                className="text-blue-600 hover:underline"
              >
                aswinwrites@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Information we collect
            </h2>
            <p className="mt-3">
              We collect the minimum information needed to provide the service:
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">
                  a) Account information (optional)
                </h3>
                <p className="mt-1">
                  If you sign in with Google, we receive your name, email
                  address, and profile picture from Google OAuth. We store your
                  email to identify your account and link your saved presets and
                  short links.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  b) Tool usage data
                </h3>
                <p className="mt-1">
                  Most tools run entirely in your browser — we never see the
                  data you enter. For tools that require server-side processing
                  (short links, AI tools), we receive the inputs you submit.
                  Short link destinations and click analytics (country, device,
                  browser, referrer, anonymised IP) are stored for up to 14
                  days.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  c) Email leads and contact messages
                </h3>
                <p className="mt-1">
                  If you subscribe to our newsletter or send a message via the
                  contact widget, we store your name and email address in our
                  database. We will not share this with third parties or send
                  unsolicited email.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  d) Analytics
                </h3>
                <p className="mt-1">
                  We use Google Analytics 4 to understand how visitors use the
                  site (page views, device type, country). Google Analytics uses
                  cookies. You can opt out via Google&apos;s opt-out browser
                  add-on.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. How we use your information
            </h2>
            <p className="mt-3">We use the information we collect to:</p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Provide and improve our tools and services</li>
              <li>Associate saved presets, QR styles, and short links with your account</li>
              <li>Respond to messages you send us</li>
              <li>Send product updates if you subscribe (you can unsubscribe at any time)</li>
              <li>Understand aggregate usage patterns to prioritise new tools</li>
            </ul>
            <p className="mt-4">
              We do not sell your data. We do not use your data for advertising
              targeting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Data storage and security
            </h2>
            <p className="mt-3">
              Your data is stored in a PostgreSQL database hosted on Supabase
              (EU region). We use HTTPS throughout the site. Short link click
              analytics store an anonymised IP (last octet zeroed) and are
              automatically deleted after 14 days.
            </p>
            <p className="mt-3">
              We implement reasonable technical and organisational measures to
              protect your data. No method of transmission over the internet is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Third-party services
            </h2>
            <p className="mt-3">
              We use the following third-party services:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>
                <strong>Google OAuth</strong> — for sign-in (Google&apos;s Privacy Policy applies)
              </li>
              <li>
                <strong>Google Analytics 4</strong> — for site analytics
              </li>
              <li>
                <strong>Vercel</strong> — for hosting and edge functions
              </li>
              <li>
                <strong>Supabase</strong> — for database hosting
              </li>
              <li>
                <strong>OpenAI / Anthropic APIs</strong> — for AI-powered tools (inputs are not stored by us; check respective providers&apos; policies)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Cookies
            </h2>
            <p className="mt-3">
              We use cookies for:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Authentication sessions (NextAuth session token)</li>
              <li>Google Analytics tracking</li>
            </ul>
            <p className="mt-3">
              We do not use advertising cookies or sell cookie data. You can
              block cookies in your browser settings; some functionality (saving
              presets, link analytics) requires cookies and will not work if
              blocked.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Your rights
            </h2>
            <p className="mt-3">
              You have the right to:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Request a copy of the data we hold about you</li>
              <li>Request deletion of your account and associated data</li>
              <li>Unsubscribe from any emails we send</li>
              <li>Correct inaccurate information</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{" "}
              <a
                href="mailto:aswinwrites@gmail.com"
                className="text-blue-600 hover:underline"
              >
                aswinwrites@gmail.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Children&apos;s privacy
            </h2>
            <p className="mt-3">
              MarketerTools is not directed at children under 13. We do not
              knowingly collect personal information from anyone under 13. If we
              discover we have done so, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Changes to this policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will post
              the updated policy on this page with a revised &quot;Last updated&quot; date.
              Your continued use of the site after changes are posted constitutes
              your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              10. Contact
            </h2>
            <p className="mt-3">
              Questions or concerns about this policy? Email us at{" "}
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
