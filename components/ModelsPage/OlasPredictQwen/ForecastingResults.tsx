import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import type { BarChartSpec } from 'components/ModelsPage/OlasPredictR1/ForecastingResults';
import { BarChartCard } from 'components/ModelsPage/OlasPredictR1/ForecastingResults';
import results from 'data/olasPredictQwen27bResults.json';

/**
 * Evaluation of Olas-Predict-Qwen3.8-27B against its base model and GPT-5.6 on the same
 * production requests: balanced accuracy and Brier error per model, from
 * `data/olasPredictQwen27bResults.json`. The three values sit about a point apart, so both
 * axes start above zero.
 */

/** Room for the model's name, which is longer than the default column. */
const LABEL_COLUMN = 208;

const ACCURACY: BarChartSpec = {
  title: 'Balanced accuracy',
  hint: 'Higher is better',
  domain: [60, 70],
  ticks: [60, 62, 64, 66, 68, 70],
  narrowTicks: [60, 65, 70],
  format: (v) => `${v.toFixed(1)}%`,
  formatTick: (v) => `${v}%`,
  labelColumn: LABEL_COLUMN,
  models: results.models.map((model) => ({ ...model, value: model.accuracy })),
};

const BRIER: BarChartSpec = {
  title: 'Brier forecast error',
  hint: 'Lower is better',
  domain: [0.15, 0.25],
  ticks: [0.15, 0.17, 0.19, 0.21, 0.23, 0.25],
  narrowTicks: [0.15, 0.2, 0.25],
  format: (v) => v.toFixed(4),
  formatTick: (v) => v.toFixed(2),
  labelColumn: LABEL_COLUMN,
  models: results.models.map((model) => ({ ...model, value: model.brier })),
};

export const ForecastingResults = () => {
  const olas = results.models.find((model) => model.id === 'olas');
  return (
    <SectionWrapper backgroundType="NONE" customClasses={`${SECTION_BOX_CLASS} bg-white`}>
      <div className="mx-auto max-w-[1096px]">
        <div className="mb-7 text-center">
          <h2 className="mb-3 text-[28px] font-semibold leading-9 tracking-[-0.56px] text-[#101114] md:text-4xl md:leading-[44px] md:tracking-[-0.72px]">
            Forecasting results
          </h2>
          <p className="mx-auto max-w-[872px] text-base leading-6 text-[#4d596a]">
            {olas.name} reached {olas.accuracy}% balanced accuracy on{' '}
            {results.requests.toLocaleString('en-US')} production requests covering{' '}
            {results.markets} markets, delivered after GPT-5.6&apos;s training cutoff. All three
            systems were given the same market evidence.
          </p>
        </div>
        {/* The charts are drawn on the client as images, so their numbers are also given as
            text for screen readers and for the server-rendered page. */}
        <ul className="sr-only">
          {[ACCURACY, BRIER].map((spec) => (
            <li key={spec.title}>
              {spec.title}:{' '}
              {spec.models.map((model) => `${model.name} ${spec.format(model.value)}`).join(', ')}.
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <BarChartCard spec={ACCURACY} />
          <BarChartCard spec={BRIER} />
        </div>
      </div>
    </SectionWrapper>
  );
};
