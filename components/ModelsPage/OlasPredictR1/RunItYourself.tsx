import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import { TEXT_SMALL_CLASS } from 'common-util/classes';
import { VALORY_GIT_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Link } from 'components/ui/typography';

const MECH_CLIENT_URL = `${VALORY_GIT_URL}/mech-client`;
/** The launch post — same site, so it stays an in-app navigation. */
const TRAINING_POST_PATH = '/blog/meet-olas-predict-r1-14b';

export const RunItYourself = () => (
  <SectionWrapper
    id="run-it-yourself"
    backgroundType="NONE"
    // Tighter than SECTION_BOX_CLASS's 96px: the design sets the steps column close to
    // the section rules, so the standard page padding leaves it floating.
    customClasses="border-t border-slate-200 px-6 py-10 lg:px-0"
    customStyle={{
      background: 'linear-gradient(160deg, #ead5fb 0%, #f7eefc 30%, #ffffff 60%)',
    }}
  >
    {/* Copy left, steps right, pushed to opposite ends of the column. */}
    <div className="mx-auto flex max-w-[872px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-md">
        <h2 className="mb-4 text-[32px] font-semibold text-black">Run it yourself</h2>
        <p className={`${TEXT_SMALL_CLASS} mb-3`}>
          Use Olas-Predict-R1-14B through the Olas Marketplace. Follow the Mech Client documentation
          to get started.
        </p>
        <p className="mb-8 text-sm">
          <Link href={TRAINING_POST_PATH}>Read how the model was trained</Link>
        </p>
        <Button variant="default" size="lg" asChild>
          <a href={MECH_CLIENT_URL} target="_blank" rel="noopener noreferrer">
            Get Started
            <ArrowUpRight size={16} className="ml-1" />
          </a>
        </Button>
      </div>

      <Image
        src="/images/models-page/run-it-yourself.png"
        alt="Three steps: install the mech client, fund your wallet, request a prediction"
        width={652}
        height={812}
        className="mx-auto h-auto w-full max-w-[260px] shrink-0 lg:mx-0"
      />
    </div>
  </SectionWrapper>
);
