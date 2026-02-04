import NovaNav from '@/components/NovaNav'
import NovaHero from '@/components/NovaHero'

export default function NovaPage() {
  return (
    <>
      <NovaNav />
      <NovaHero />

      {/* Rest of landing page sections */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Your content sections continue here
          </h2>
          <p className="text-lg text-black/60 leading-relaxed">
            The rest of your landing page sections follow below...
          </p>
        </div>
      </section>
    </>
  )
}
