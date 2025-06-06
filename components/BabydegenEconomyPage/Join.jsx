import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

export const Join = () => (
  <SectionWrapper
    customClasses="max-sm:mt-24 max-sm:mx-6 mb-8"
    id="get-started"
  >
    <Card className="max-w-[720px] mx-auto p-8 border-fuchsia-200 ring-8 ring-purple-50">
      <Image
        src="/images/babydegen-econ-page/join.png"
        alt="Join the Agent Economy"
        width={208}
        height={85}
        className="mx-auto mb-6"
      />
      <h2 className="tracking-tight text-3xl lg:text-4xl mb-8 font-bold text-center lg:mb-10">
        Join the Agent Economy
      </h2>
      <div className="flex flex-wrap justify-center gap-6 mx-auto">
        <Button variant="default" size="lg" asChild>
          <Link href="/pearl#download">Run Modius on Pearl</Link>
        </Button>

        <Button variant="outline" size="lg" asChild>
          <ExternalLink
            hideArrow
            href="https://github.com/valory-xyz/quickstart/"
            className="text-black"
          >
            Run Optimus via Quickstart
          </ExternalLink>
        </Button>
      </div>
    </Card>
  </SectionWrapper>
);
