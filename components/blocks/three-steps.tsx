import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ClipboardCheck, TrendingUp, LineChart } from 'lucide-react'
import { ReactNode } from 'react'

export function ThreeSteps() {
  return (
    <section className="py-16 md:py-32 bg-[#F7F3ED]">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-bold lg:text-5xl">
            Three Steps to Measurable Growth
          </h2>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-8 md:mt-16">
          {/* Step 1 - Assess */}
          <Card className="group border-0 bg-white shadow-none">
            <CardHeader className="pb-3">
              <StepDecorator number={1}>
                <ClipboardCheck className="size-6" aria-hidden />
              </StepDecorator>

              <h3 className="mt-6 text-2xl font-bold">Assess</h3>
              <p className="text-base font-semibold text-black/70">
                Complete your baseline assessment
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-base text-black/70 leading-relaxed">
                96 questions across 15 dimensions in three 20-minute sessions.
                Honest, objective, comprehensive.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 - Track */}
          <Card className="group border-0 bg-white shadow-none">
            <CardHeader className="pb-3">
              <StepDecorator number={2}>
                <LineChart className="size-6" aria-hidden />
              </StepDecorator>

              <h3 className="mt-6 text-2xl font-bold">Track</h3>
              <p className="text-base font-semibold text-black/70">
                Weekly check-ins via WhatsApp
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-base text-black/70 leading-relaxed">
                Choose 3 dimensions to focus on per quarter. Answer 3 questions weekly.
                Track your progress over time.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 - Improve */}
          <Card className="group border-0 bg-white shadow-none">
            <CardHeader className="pb-3">
              <StepDecorator number={3}>
                <TrendingUp className="size-6" aria-hidden />
              </StepDecorator>

              <h3 className="mt-6 text-2xl font-bold">Improve</h3>
              <p className="text-base font-semibold text-black/70">
                Get tailored insights and frameworks
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-base text-black/70 leading-relaxed">
                Your dashboard shows exactly where to focus. We prescribe specific
                frameworks from the Konstantin Method based on your scores. No guessing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

const StepDecorator = ({ number, children }: { number: number; children: ReactNode }) => (
  <div className="relative mx-auto">
    {/* Step Number Circle */}
    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-black text-white">
      <span className="text-3xl font-bold">{number}</span>
    </div>

    {/* Icon with grid background */}
    <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
      <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-white">
        {children}
      </div>
    </div>
  </div>
)
