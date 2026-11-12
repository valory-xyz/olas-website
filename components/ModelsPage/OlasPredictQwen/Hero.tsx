import Link from 'next/link';

import { MODEL_NAME } from 'components/ModelsPage/OlasPredictQwen/constants';
import { ModelIllustration } from 'components/ModelsPage/OlasPredictQwen/ModelIllustration';
import { Button } from 'components/ui/button';

export const Hero = () => (
  <section
    className="border-b border-slate-200 px-6 py-10 lg:px-12"
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
          An open-weight forecasting model that approaches GPT-5.6
        </h1>
        <p className="mb-6 text-base leading-7 text-slate-600">
          {MODEL_NAME} is a specialized, open-weight AI model designed to estimate the probability
          of real-world events. In evaluation, the model reached 67.3% balanced accuracy, compared
          with 68.5% for GPT-5.6.
        </p>
        {/* Centred while the columns are stacked, left-aligned once they sit side by side. */}
        <div className="flex justify-center lg:justify-start">
          <Button variant="default" size="lg" asChild>
            <Link href="#run-it-yourself">Try Model Yourself</Link>
          </Button>
        </div>
      </div>
      <ModelIllustration />
    </div>
  </section>
);
