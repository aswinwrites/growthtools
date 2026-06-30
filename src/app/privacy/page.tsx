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
        <p className="mt-3 text-sm text-gray-400">Last updated: 1 July 2026</p>

        <div className="mt-10 space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Who we are</h2>
            <p className="mt-3">
              MarketerTools operates the website at{" "}
              <a href="https://www.marketertools.fyi" className="text-blue-600 hover:underline">
                marketertools.fyi
              </a>{" "}
              and all tools on it. Questions about this policy can be sent to{" "}
              <a href="mailto:aswin.growth@gmail.com" className="text-blue-600 hover:underline">
                aswin.growth@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. What we collect</h2>
            <p className="mt-3">
              Most tools run entirely in your browser — we never see what you type into them. We only collect data in these cases:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-2">
              <li>
                <strong>Sign-in:</strong> If you sign in with Google, we store your email address to identify your account and link saved presets or short links.
              </li>
              <li>
                <strong>URL shortener:</strong> We store the destination URL and anonymised click data (country, device, referrer). Raw IPs are never stored.
              </li>
              <li>
                <strong>Newsletter / contact:</strong> If you subscribe or send a message, we store your email address. We will not share it or spam you.
              </li>
              <li>
                <strong>Analytics:</strong> We use Google Analytics 4 for aggregate usage data (page views, device type, country). No personally identifiable data is collected via GA4.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. How we use it</h2>
            <p className="mt-3">
              We use the data above only to run the service — linking your account to saved data, responding to messages, sending updates you opted into, and understanding how the site is used in aggregate. We do not sell your data or use it for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Third-party services</h2>
            <p className="mt-3">
              We rely on a small number of external services to operate the site: Google (sign-in and analytics), a cloud hosting provider, and a database provider. AI-powered tools send your input to an AI API for processing — we do not store those inputs ourselves.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Cookies</h2>
            <p className="mt-3">
              We use cookies for authentication sessions and Google Analytics. We do not use advertising cookies. Blocking cookies will disable account features like saved presets and link analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Your rights</h2>
            <p className="mt-3">
              You can request a copy of your data, ask us to delete your account, or unsubscribe from emails at any time. Email{" "}
              <a href="mailto:aswin.growth@gmail.com" className="text-blue-600 hover:underline">
                aswin.growth@gmail.com
              </a>{" "}
              and we will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Changes</h2>
            <p className="mt-3">
              We may update this policy occasionally. Changes will be posted here with a revised date. Continued use of the site after an update constitutes acceptance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
