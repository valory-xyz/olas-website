import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';

import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import forecasts from 'data/olasPredictR1Forecasts.json';
import { cn } from 'lib/utils';

type Forecast = {
  question: string;
  /** Model's probability of Yes, 0–1. */
  prediction: number;
  outcome: 'Yes' | 'No';
  /** Full transcript; the toggle only renders when both are present. */
  prompt?: string;
  response?: string;
};

const formatProbability = (p: number) => `${Math.round(p * 100)}%`;

/**
 * Whether the forecast pointed the right way: above 50% on a Yes, below 50% on a No.
 * An exact 50% commits to neither, so it is scored as neither.
 */
const scoreForecast = (forecast: Forecast) => {
  if (forecast.prediction === 0.5) return null;
  return forecast.prediction > 0.5 === (forecast.outcome === 'Yes') ? 'correct' : 'wrong';
};

const VERDICT = {
  correct: { label: 'Correct', className: 'border-[#b7eb8f] bg-[#f6ffed] text-[#135200]' },
  wrong: { label: 'Wrong', className: 'border-[#ffa39e] bg-[#fff1f0] text-[#a8071a]' },
} as const;

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy to clipboard: ', error);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : `Copy ${label}`}
      className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

const TranscriptPane = ({ label, text }: { label: string; text: string }) => (
  <div className="flex min-w-0 flex-1 flex-col gap-1">
    <span className="text-xs text-slate-500">{label}</span>
    <div className="relative rounded-lg border border-slate-200 bg-white">
      <div className="absolute right-1 top-1">
        <CopyButton text={text} label={label.toLowerCase()} />
      </div>
      <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words p-3 pr-8 font-mono text-[11px] leading-4 text-slate-700 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {text}
      </pre>
    </div>
  </div>
);

const ForecastCard = ({ forecast, index }: { forecast: Forecast; index: number }) => {
  const [open, setOpen] = useState(false);
  const hasTranscript = Boolean(forecast.prompt && forecast.response);
  const verdict = scoreForecast(forecast);
  const transcriptId = `forecast-${index}-transcript`;

  return (
    <li className="relative rounded-xl border border-slate-100 bg-[#f7f8fb] p-6">
      {/* Index badge hugs the card's top-left corner: its 12px outer radius matches the
          card's, and the opposite corner is rounded so it reads as a tab, not a square. */}
      <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-br-xl rounded-tl-xl bg-[#dfe5ee] text-sm font-medium leading-none text-slate-600">
        {index + 1}
      </span>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-8">
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-base leading-6 text-slate-800">{forecast.question}</p>
          {hasTranscript && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={transcriptId}
              onClick={() => setOpen((v) => !v)}
              className="flex w-fit items-center gap-1 text-sm text-purple-700 hover:underline"
            >
              {open ? 'Hide' : 'Show'} model prompt and response
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        <dl className="flex shrink-0 gap-8 sm:ml-4">
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-normal leading-5 text-slate-500">Probability of Yes</dt>
            <dd className="flex flex-col items-start gap-1">
              <span className="text-2xl font-semibold leading-8 tracking-[-0.24px] text-purple-700">
                {formatProbability(forecast.prediction)}
              </span>
              {verdict && (
                <span
                  className={cn(
                    'rounded border px-1.5 py-0.5 text-sm font-normal leading-5',
                    VERDICT[verdict].className
                  )}
                >
                  {VERDICT[verdict].label}
                </span>
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-normal leading-5 text-slate-500">Outcome</dt>
            <dd className="text-2xl font-semibold leading-8 tracking-[-0.24px] text-black">
              {forecast.outcome}
            </dd>
          </div>
        </dl>
      </div>

      {hasTranscript && (
        <div
          id={transcriptId}
          className={cn('flex flex-col gap-3 pt-4 md:flex-row', !open && 'hidden')}
        >
          <TranscriptPane label="Prompt" text={forecast.prompt} />
          <TranscriptPane label="Response" text={forecast.response} />
        </div>
      )}
    </li>
  );
};

export const ExampleForecasts = () => (
  <SectionWrapper backgroundType="NONE" customClasses={`${SECTION_BOX_CLASS} bg-white`}>
    <div className="mx-auto flex max-w-[872px] flex-col">
      <h2 className="mb-4 text-center text-[40px] font-semibold text-black">Example forecasts</h2>
      <p className="mb-10 text-center text-lg leading-6 text-slate-600">
        These questions weren&apos;t seen during training.
        <br />
        Compare the model&apos;s probability of Yes with the final outcome.
      </p>
      <ol className="flex flex-col gap-3">
        {(forecasts as Forecast[]).map((forecast, index) => (
          <ForecastCard key={forecast.question} forecast={forecast} index={index} />
        ))}
      </ol>
    </div>
  </SectionWrapper>
);
