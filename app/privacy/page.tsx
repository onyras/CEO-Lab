export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--nk-off-white)' }}>
      <header className="border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center">
            <h1 className="font-serif text-3xl font-semibold">
              <a href="/" style={{ color: 'var(--nk-black)' }}>CEO Lab</a>
            </h1>
            <a href="/dashboard" className="px-6 py-3 rounded-lg font-medium" style={{ background: 'var(--nk-black)', color: 'white' }}>
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="container py-16 max-w-4xl">
        <h1 className="font-serif text-5xl font-semibold mb-4" style={{ color: 'var(--nk-black)' }}>Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: 'var(--nk-text-muted)' }}>Last updated: February 3, 2026</p>

        <div className="prose prose-lg" style={{ color: 'var(--nk-black)' }}>
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              CEO Lab ("we," "our," or "us") operates ceo-lab.vercel.app. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Information We Collect</h2>

            <h3 className="font-serif text-2xl font-semibold mb-3 mt-6">Personal Information</h3>
            <p className="mb-4">When you create an account, we collect:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Email address</li>
              <li>Name (via Google OAuth)</li>
              <li>Profile information from authentication provider</li>
            </ul>

            <h3 className="font-serif text-2xl font-semibold mb-3 mt-6">Assessment Data</h3>
            <p className="mb-4">We collect and store your responses to:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Hook assessment (12 questions)</li>
              <li>Baseline assessment (100 questions)</li>
              <li>Weekly check-in questions</li>
              <li>Quarterly focus selections</li>
            </ul>

            <h3 className="font-serif text-2xl font-semibold mb-3 mt-6">Payment Information</h3>
            <p className="mb-4">
              Payment processing is handled by Stripe. We do not store your credit card information.
              We receive and store: subscription status, customer ID, and subscription ID from Stripe.
            </p>

            <h3 className="font-serif text-2xl font-semibold mb-3 mt-6">Usage Data</h3>
            <p className="mb-4">We may collect information about how you access and use the service, including:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information</li>
              <li>Usage patterns and engagement metrics</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the collected data for:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Providing and maintaining the service</li>
              <li>Calculating your leadership scores and progress</li>
              <li>Sending weekly check-in reminders</li>
              <li>Processing payments and managing subscriptions</li>
              <li>Improving and personalizing your experience</li>
              <li>Communicating with you about updates and features</li>
              <li>Detecting and preventing fraud or abuse</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Data Storage and Security</h2>
            <p className="mb-4">
              Your data is stored securely using Supabase, a SOC 2 Type 2 certified infrastructure provider.
              We implement appropriate technical and organizational measures to protect your personal data.
            </p>
            <p className="mb-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data,
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Data Sharing</h2>
            <p className="mb-4">We do not sell your personal data. We may share your information with:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li><strong>Service Providers:</strong> Supabase (database), Stripe (payments), Vercel (hosting), Resend (email)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Your Rights (GDPR)</h2>
            <p className="mb-4">If you are in the European Economic Area, you have the right to:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain data processing</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, contact us at privacy@ceo-lab.com
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Data Retention</h2>
            <p className="mb-4">
              We retain your personal data for as long as your account is active or as needed to provide services.
              If you cancel your subscription, we will retain your data for 90 days before permanent deletion,
              unless you request immediate deletion.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Cookies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to maintain your session and improve the service.
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Children's Privacy</h2>
            <p className="mb-4">
              Our service is not directed to individuals under 18. We do not knowingly collect personal information
              from children. If you become aware that a child has provided us with personal data, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting
              the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Email: privacy@ceo-lab.com</li>
              <li>Website: ceo-lab.vercel.app</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t py-12" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="container text-center" style={{ color: 'var(--nk-text-muted)' }}>
          <p className="mb-4">© 2026 CEO Lab · Built on the Konstantin Method</p>
          <div className="flex justify-center gap-8 text-sm">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="/refund" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
