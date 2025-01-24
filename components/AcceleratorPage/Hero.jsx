import {
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';

export const Hero = () => (
  <>
    <SectionWrapper
      customClasses={`bg-gradient-to-t from-[#E7EAF4] to-gray-50 ${SECTION_BOX_CLASS}`}
    >
      <div className="flex flex-col mx-auto text-center gap-8 max-w-[620px]">
        <div className={`${TEXT_MEDIUM_LIGHT_CLASS}`}>OLAS ACCELERATOR</div>
        <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-4 text-center`}>
          Programme for Builders that want to bring the best Agents to Pearl
        </h1>
        <Card className="max-w-md bg-white mx-auto flex flex-col overflow-hidden rounded-2xl">
          <div className="p-8">
            <div className="text-6xl font-extrabold mb-4">
              $1&apos;000&apos;000
            </div>
            Grant pool + OLAS Dev Rewards
          </div>
          <div className="bg-black text-white p-3">
            sponsored by
            <Image
              src="/images/accelerator/valory-logo.png"
              alt="Valory"
              width={112}
              height={36}
              className="ml-2 inline"
            />
          </div>
        </Card>
      </div>
    </SectionWrapper>
    <div className="py-16 border-b-1.5">
      <p className="max-w-[720px] mx-auto">
        This program aims to incentivize and support up to 10 top-tier
        development teams to build innovative agents for Pearl. Pearl enables
        users to set up and run agents directly from their computers and earn
        OLAS.
      </p>
    </div>
  </>
);
