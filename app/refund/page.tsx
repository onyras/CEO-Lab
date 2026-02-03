export default function RefundPolicy() {
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
        <h1 className="font-serif text-5xl font-semibold mb-4" style={{ color: 'var(--nk-black)' }}>Refund Policy</h1>
        <p className="text-sm mb-12" style={{ color: 'var(--nk-text-muted)' }}>Last updated: February 3, 2026</p>

        <div className="prose prose-lg" style={{ color: 'var(--nk-black)' }}>
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">7-Day Money-Back Guarantee</h2>
            <p className="mb-4">
              We want you to be completely satisfied with CEO Lab. If you're not happy with the service for any reason,
              you can request a full refund within the first 7 days of your initial subscription.
            </p>
            <p className="mb-4">
              This guarantee applies only to your first month as a new subscriber.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">How to Request a Refund</h2>
            <p className="mb-4">To request a refund:</p>
            <ol className="mb-4 ml-6 list-decimal">
              <li className="mb-2">Email us at support@ceo-lab.com with the subject line "Refund Request"</li>
              <li className="mb-2">Include your account email address</li>
              <li className="mb-2">Briefly explain your reason for canceling (optional, but helps us improve)</li>
            </ol>
            <p className="mb-4">
              We will process your refund within 5-7 business days. The refund will be credited to your original
              payment method.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">After the First 7 Days</h2>
            <p className="mb-4">
              After the initial 7-day period, all payments are non-refundable.
            </p>
            <p className="mb-4">
              However, you can cancel your subscription at any time. Your access will continue until the end of your
              current billing period, and you will not be charged again.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Cancellation</h2>
            <p className="mb-4">
              You can cancel your subscription at any time through your account dashboard or by contacting support.
            </p>
            <p className="mb-4">
              When you cancel:
            </p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Your subscription remains active until the end of your current billing period</li>
              <li>You will not be charged for the following month</li>
              <li>Your data will be retained for 90 days in case you decide to return</li>
              <li>After 90 days, your data will be permanently deleted unless you reactivate</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Exceptions</h2>
            <p className="mb-4">
              Refunds will not be issued in cases of:
            </p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Account termination due to Terms of Service violations</li>
              <li>Chargebacks or payment disputes (contact us first to resolve)</li>
              <li>Requests made more than 7 days after initial purchase</li>
              <li>Pro-rated refunds for partial months</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Technical Issues</h2>
            <p className="mb-4">
              If you experience technical problems that prevent you from using the service, please contact us
              immediately. We will work to resolve the issue or, if unable to do so, may offer a refund or credit
              at our discretion.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Price Changes</h2>
            <p className="mb-4">
              If we increase the subscription price, existing subscribers will receive 30 days notice.
              The new price will apply starting with your next billing cycle after the notice period.
            </p>
            <p className="mb-4">
              You may cancel your subscription before the price change takes effect to avoid the increased rate.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Our Commitment</h2>
            <p className="mb-4">
              We built CEO Lab to provide genuine value to founders and CEOs who want to develop their leadership.
              We're confident in the service, and we want you to have a risk-free way to try it.
            </p>
            <p className="mb-4">
              If CEO Lab isn't the right fit for you within the first week, we'll refund your payment, no questions asked.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4">Questions?</h2>
            <p className="mb-4">
              If you have questions about our refund policy or need assistance with cancellation, please contact us:
            </p>
            <ul className="mb-4 ml-6 list-disc">
              <li>Email: support@ceo-lab.com</li>
              <li>Website: ceo-lab.vercel.app</li>
            </ul>
            <p className="mb-4">
              We typically respond within 24 hours on business days.
            </p>
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
