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
        <div className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2`}>
          OLAS ACCELERATOR
        </div>
        <h1 className={`${MAIN_TITLE_CLASS} text-center`}>
          $1 million prize pool <br />
          to build AI agents
        </h1>

        <div className={TEXT_SMALL_CLASS}>
          Build AI agents for Pearl: the agent app store & get paid.
        </div>
      </div>

      <div className="mx-auto w-fit mt-12">
        <Button variant="default" size="xl" asChild>
          <Link href={ACCELERATOR_APPLY_URL}>Apply now</Link>
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
