import { Card } from 'components/ui/card';
import { Link } from 'components/ui/typography';
import Image from 'next/image';

const AI_AGENT_ECONOMIES = 4;

export const Activity = () => (
  <div className="text-7xl lg:text-9xl py-12 md:py-32 max-w-[850px] mx-auto w-full">
    {/* @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message */}
    <Card className="flex flex-col gap-6 p-8 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
      <div className="flex items-center">
        <Image
          alt="economies"
          src="/images/launch-page/activity.png"
          width="35"
          height="35"
          className="mr-4"
        />
        Olas AI Agent Economies
      </div>
      <Link
        className="font-extrabold text-6xl"
        href="/agent-economies#agent-economies"
        // @ts-expect-error TS(2322) FIXME: Type '{ children: number; className: string; href:... Remove this comment to see the full error message
        hideArrow
      >
        {AI_AGENT_ECONOMIES}
      </Link>
    </Card>
  </div>
);
