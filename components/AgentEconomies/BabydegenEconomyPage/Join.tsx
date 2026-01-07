import { PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';

export const Join = () => (
  <SectionWrapper
    customClasses="max-sm:mt-24 max-sm:mx-6 mb-8"
    id="get-started"
  >
    {/* @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message */}
    <Card className="max-w-[720px] mx-auto p-8 border-fuchsia-200 ring-8 ring-purple-50">
      <Image
        src="/images/babydegen-econ-page/join-optimus.png"
        alt="Join the Agent Economy"
        width={76}
        height={76}
        className="mx-auto mb-6"
      />
      <h2 className="tracking-tight text-3xl lg:text-4xl mb-8 font-bold text-center lg:mb-10">
        Join the Babydegen Agent Economy
      </h2>
      <div className="flex flex-wrap justify-center gap-6 mx-auto">
        {/* @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message */}{' '}
        <Button variant="default" size="lg" asChild>
          <SubsiteLink href={PEARL_YOU_URL} isInButton>
            Run BabyDegen Agent via Pearl
          </SubsiteLink>
        </Button>
        {/* <Button variant="outline" size="lg" asChild>
          <ExternalLink hideArrow href={QUICKSTART_URL} className="text-black">
            Run Optimus via Quickstart
          </ExternalLink>
        </Button> */}
      </div>
    </Card>
  </SectionWrapper>
);
