import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import { CARD_BG } from 'styles/globals';

export const OptimusAgentMetrics = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} lg:py-14`}>
    <div className="max-w-[750px] mx-auto text-center">
      <Card className={`${CARD_BG} max-h-[250px] p-16`}>
        <Image
          alt="Optimus metrics"
          src="/images/metrics.svg"
          height={48}
          width={48}
          className="mb-6 mx-auto"
        />
        <p className="text-slate-500">
          Olas Optimus agent economy metrics coming soon.
        </p>
      </Card>
    </div>
  </SectionWrapper>
);
