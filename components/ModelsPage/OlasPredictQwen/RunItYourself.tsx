import { ArrowUpRight } from 'lucide-react';

import { TEXT_SMALL_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Link } from 'components/ui/typography';

const HUGGING_FACE_URL = 'https://huggingface.co/valory/olas-predict-qwen3.8-27b';
/** The launch post — same site, so it stays an in-app navigation. */
const TRAINING_POST_PATH = '/blog/meet-olas-predict-qwen3.8-27B';

/** The last step shows the model's own shape, the same image as its card on /models. */
const STEPS = [
  { label: 'Install vLLM', icon: '/images/models-page/step-install.svg' },
  { label: 'Load the adapter', icon: '/images/models-page/step-load.svg' },
  { label: 'Request a forecast', icon: '/images/models-page/model-logo-qwen3.8-27b.png' },
];

/** Layered drop shadow under each step (Figma's four visible stops). */
const STEP_SHADOW =
  '0 59px 11.5px rgba(117,136,169,0.03), 0 33px 10px rgba(117,136,169,0.1), 0 15px 7.5px rgba(117,136,169,0.17), 0 4px 4px rgba(117,136,169,0.2)';

const Steps = () => (
  <ol className="mx-auto flex w-full max-w-[280px] shrink-0 flex-col items-center gap-3 lg:mx-0">
    {STEPS.map((step, index) => (
      <li key={step.label} className="flex w-full flex-col items-center gap-3">
        {index > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/models-page/step-arrow.svg"
            alt=""
            width={28}
            height={28}
            className="rotate-90"
          />
        )}
        <div
          className="flex w-full items-center gap-4 rounded-2xl border border-[#eaeef6] bg-gradient-to-b from-white to-[#f2f4f9] p-5"
          style={{ boxShadow: STEP_SHADOW }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={step.icon} alt="" className="size-8 shrink-0 object-contain" />
          <span className="text-base font-medium leading-6 text-black">{step.label}</span>
        </div>
      </li>
    ))}
  </ol>
);

export const RunItYourself = () => (
  <SectionWrapper
    id="run-it-yourself"
    backgroundType="NONE"
    // Tighter than SECTION_BOX_CLASS's 96px: the design sets the steps column close to
    // the section rules, so the standard page padding leaves it floating.
    customClasses="border-y border-slate-200 px-6 py-10 lg:px-0"
    customStyle={{
      background: 'linear-gradient(160deg, #ead5fb 0%, #f7eefc 30%, #ffffff 60%)',
    }}
  >
    {/* Copy left, steps right, pushed to opposite ends of the column. */}
    <div className="mx-auto flex max-w-[872px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-md">
        <h2 className="mb-4 text-[32px] font-semibold text-black">Run it yourself</h2>
        <p className={`${TEXT_SMALL_CLASS} mb-3`}>
          The model is published on Hugging Face as a 319 MB adapter for the open-weight Qwen3.8-27B
          base model, both under the Apache License 2.0. The base model with the adapter takes about
          54 GB of GPU memory, which fits a single 80 GB GPU such as an H100 or A100.
        </p>
        <p className={`${TEXT_SMALL_CLASS} mb-3`}>
          The prompt must include the evidence for the question. The model does not retrieve
          evidence itself.
        </p>
        <p className="mb-8 text-sm">
          <Link href={TRAINING_POST_PATH}>Read how the model was trained</Link>
        </p>
        {/* Centred while the columns are stacked, left-aligned once they sit side by side. */}
        <div className="flex justify-center lg:justify-start">
          <Button variant="default" size="lg" asChild>
            <a href={HUGGING_FACE_URL} target="_blank" rel="noopener noreferrer">
              Open on Hugging Face
              <ArrowUpRight size={16} className="ml-1" />
            </a>
          </Button>
        </div>
      </div>

      <Steps />
    </div>
  </SectionWrapper>
);
