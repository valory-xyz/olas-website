import {
  MAIN_TITLE_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import { ACCELERATOR_APPLY_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => (
  <>
    <SectionWrapper backgroundType="SUBTLE_GRADIENT">
      <div className="flex flex-col mx-auto text-center max-w-[620px]">
        <h1 className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2`}>OLAS ACCELERATOR</h1>
        <h2 className={`${MAIN_TITLE_CLASS} text-center`}>
          $1 million grant <br />
          to build AI agents
        </h2>

        <div className={TEXT_SMALL_CLASS}>
          Build AI agents for Pearl: The AI Agent App Store & get paid.
        </div>
      </div>

      <div className="mx-auto w-fit mt-12">
        <Button variant="default" size="xl" asChild>
          <Link
            href={ACCELERATOR_APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply now
          </Link>
        </Button>
      </div>
    </SectionWrapper>
    <div className="w-full text-center bg-black text-white py-3">
      Sponsored by
      <Image
        src="/images/accelerator/valory-logo.png"
        alt="Valory"
        width={93}
        height={30}
        className="ml-3 inline"
      />
    </div>
  </>
);
