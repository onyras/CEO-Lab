export default function TermsOfService() {
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
        <h1 className="font-serif text-5xl font-semibold mb-4" style={{ color: 'var(--nk-black)' }}>Terms of Service</h1>
        <p className="text-sm mb-12" style={{ color: 'var(--nk-text-muted)' }}>Last updated: February 3, 2026</p>

        <div className="prose prose-lg" style={{ color: 'var(--nk-black)' }}>
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              By accessing CEO Lab ("Service"), you agree to be bound by these Terms of Service ("Terms").
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Description of Service</h2>
            <p className="mb-4">
              CEO Lab is a premium accountability platform for leadership development. The service includes:
            </p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Leadership assessments (hook and baseline)</li>
              <li>Weekly check-in tracking</li>
              <li>Progress dashboard and scoring</li>
              <li>Quarterly focus area selection</li>
              <li>Access to prescribed frameworks from the Konstantin Method</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Account Registration</h2>
            <p className="mb-4">To use the Service, you must:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="mb-4">
              You may not share your account or transfer your subscription to another person.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Subscription and Payment</h2>

            <h3 className="font-serif text-2xl font-semibold mb-3 mt-6">Pricing</h3>
            <p className="mb-4">
              CEO Lab is offered as a monthly subscription at €100/month.
              Prices are subject to change with 30 days notice to existing subscribers.
            </p>

            <h3 className="font-serif text-2xl font-semibold mb-3 mt-6">Billing</h3>
            <p className="mb-4">
              Your subscription will automatically renew each month on the anniversary of your signup date.
              You authorize us to charge your payment method on a recurring basis.
            </p>

            <h3 className="font-serif text-2xl font-semibold mb-3 mt-6">Payment Processing</h3>
            <p className="mb-4">
              All payments are processed securely through Stripe. We do not store your payment information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Cancellation and Refunds</h2>
            <p className="mb-4">
              You may cancel your subscription at any time from your account dashboard or by contacting support.
              Cancellation takes effect at the end of your current billing period.
            </p>
            <p className="mb-4">
              See our <a href="/refund" className="underline">Refund Policy</a> for details on refunds and guarantees.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Share your account credentials with others</li>
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use automated systems to access the service (bots, scrapers)</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Intellectual Property</h2>
            <p className="mb-4">
              The Service, including all content, features, and functionality, is owned by CEO Lab
              and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mb-4">
              The Konstantin Method and all associated frameworks are proprietary content.
              You receive a limited, non-exclusive license to access this content for personal use only.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Your Data</h2>
            <p className="mb-4">
              You retain ownership of your assessment responses and data. By using the Service, you grant us
              permission to use your anonymized data to improve the service and create aggregated insights.
            </p>
            <p className="mb-4">
              We will never share your individual assessment data without your explicit consent,
              except as required by law.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Disclaimers</h2>
            <p className="mb-4">
              <strong>Not Professional Advice:</strong> CEO Lab provides educational content and self-assessment tools.
              It is not a substitute for professional coaching, therapy, or business consulting.
            </p>
            <p className="mb-4">
              <strong>No Guarantees:</strong> While we strive to provide valuable insights, we make no guarantees
              about specific outcomes or results from using the service.
            </p>
            <p className="mb-4">
              <strong>Service Availability:</strong> The Service is provided "as is" without warranties of any kind.
              We do not guarantee uninterrupted or error-free operation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, CEO Lab shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
            <p className="mb-4">
              Our total liability for any claims related to the service is limited to the amount you paid
              in the 12 months prior to the claim.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate your account if you violate these Terms or engage
              in conduct we deem harmful to the service or other users.
            </p>
            <p className="mb-4">
              Upon termination, your right to access the service ceases immediately. We may retain your data
              for backup or legal purposes as described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Changes to Terms</h2>
            <p className="mb-4">
              We may modify these Terms at any time. We will notify you of material changes via email
              or through the service. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by the laws of the European Union. Any disputes will be resolved
              in accordance with EU jurisdiction.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Contact</h2>
            <p className="mb-4">
              For questions about these Terms, contact us at:
            </p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Email: support@ceo-lab.com</li>
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
