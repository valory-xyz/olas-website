import {
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => (
  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS} border-b place-items-center`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="text-center max-sm:my-8">
      <Image
        src="/images/bottle/pearl-icon.png"
        alt="Pearl Icon"
        width={133}
        height={133}
        className="mx-auto mb-8 md:mb-12"
      />
      <div className={`font-semibold ${SUB_HEADER_CLASS} mb-4`}>
        Try running your first AI Agent today
      </div>
      <div className={TEXT_SMALL_CLASS}>
        Run an AI Agent on Pearl: The Agent App Store!
      </div>
      <Button
        variant="default"
        size="xl"
        asChild
        className="my-6 w-full md:w-auto"
      >
        <Link href="/operate">Explore</Link>
      </Button>
    </div>
  </SectionWrapper>
);
