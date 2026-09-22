import Link from 'next/link';

import { MODEL_NAME } from 'components/ModelsPage/OlasPredictR1/constants';
import { ModelIllustration } from 'components/ModelsPage/OlasPredictR1/ModelIllustration';
import { Button } from 'components/ui/button';

export const Hero = () => (
  <section
    className="border-b border-slate-200 px-6 py-16 lg:px-12 lg:py-24"
    style={{
      // Purple wash top-left; a soft pink glow bottom-right behind the forecast card.
      background: [
        'radial-gradient(ellipse at 100% 100%, #faedff 0%, rgba(255, 255, 255, 0) 45%)',
        'linear-gradient(135deg, #ead5fb 0%, #f5eafc 28%, #ffffff 55%, #ffffff 100%)',
      ].join(', '),
    }}
  >
    <div className="mx-auto grid max-w-screen-xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
      <div className="max-w-xl">
        <p className="text-slate-500 mb-2 text-base font-semibold">{MODEL_NAME}</p>
        <h1 className="mb-5 text-4xl font-semibold leading-[1.15] tracking-tight text-black sm:text-5xl">
          A model for forecasting real-world events
        </h1>
        <p className="mb-6 text-base leading-7 text-slate-600">
          Olas-Predict-R1-14B is a specialized, open-weight AI model designed to estimate the
          probability of future events. Explore its past forecasts alongside their outcomes.
        </p>
        <Button variant="default" size="lg" asChild>
          <Link href="#run-it-yourself">Try Model Yourself</Link>
        </Button>
      </div>
      <ModelIllustration />
    </div>
  </section>
);
