export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CEO Lab</h1>
          <div className="flex gap-4">
            <a href="/auth" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">
          You Need a Mirror
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          In times of extreme change, founders don't know if they're actually getting better as leaders.
          Without measurement, anxiety drives decisions instead of strategy.
        </p>
        <a
          href="/assessment/hook"
          className="inline-block px-8 py-4 bg-black text-white text-lg rounded-md hover:bg-gray-800"
        >
          Take Free Assessment
        </a>
        <p className="text-sm text-gray-500 mt-4">
          12 questions · 5 minutes · Get your CEO score instantly
        </p>
      </section>

      {/* Problem Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Is This You?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold mb-3 text-gray-900">You Don't Know Where You Stand</h4>
            <p className="text-gray-600">
              You're shipping, you're busy, but have no objective measurement of your growth as a leader.
              Success doesn't equal competence validation.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold mb-3 text-gray-900">Everything Feels Urgent</h4>
            <p className="text-gray-600">
              No clear priorities for self-development. Analysis paralysis.
              You see AI tools and wonder "Am I falling behind?"
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold mb-3 text-gray-900">Anxiety Drives Decisions</h4>
            <p className="text-gray-600">
              Without frameworks to structure reality, you're left comparing yourself to other founders.
              Feeling like everyone's moving faster.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            The Only Reliable Edge is Continuous Adaptation
          </h3>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Not your product. Not your network. Not what you know today.
            Your ability to adapt. But you can't adapt if you don't have measurement.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-gray-900">100</div>
              <div className="text-gray-600">Question Assessment</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-gray-900">18</div>
              <div className="text-gray-600">Leadership Dimensions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-gray-900">Weekly</div>
              <div className="text-gray-600">Progress Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold mb-3 text-gray-900">1. Take the Assessment</h4>
            <p className="text-gray-600">
              Complete our comprehensive baseline assessment covering Leading Yourself,
              Leading Teams, and Leading Organizations. Staged delivery makes it manageable.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold mb-3 text-gray-900">2. See Your Profile</h4>
            <p className="text-gray-600">
              Get a visual heatmap of your 18 leadership dimensions.
              Identify strengths and blind spots across all three territories.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold mb-3 text-gray-900">3. Track Progress</h4>
            <p className="text-gray-600">
              Choose 3 focus areas per quarter. Complete weekly check-ins.
              Watch your scores improve over time. Get frameworks prescribed based on gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">Premium Accountability</h3>
          <div className="text-5xl font-bold mb-4 text-gray-900">€100/month</div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive assessment, weekly tracking, progress dashboard,
            and prescribed frameworks from the Konstantin Method.
          </p>
          <a
            href="/assessment/hook"
            className="inline-block px-8 py-4 bg-black text-white text-lg rounded-md hover:bg-gray-800"
          >
            Start With Free Assessment
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2026 CEO Lab · Built on the Konstantin Method</p>
        </div>
      </footer>
    </div>
  );
}
