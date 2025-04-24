import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { StarterCards } from 'components/StarterCards';
import { Button } from 'components/ui/button';
import Link from 'next/link';

const pearlContent = (
  <ol className="list-decimal ml-6">
    <strong>
      <li>Download Pearl.</li>
    </strong>
    <div className="mb-4">
      Visit{' '}
      <Link href="/operate#download" className="break-words text-purple-600">
        https://olas.network/operate#download
      </Link>{' '}
      to download the Pearl app.
    </div>

    <strong>
      <li>Launch the Agents.fun agent.</li>
    </strong>
    <p className="mb-4">
      Choose the Agents.fun agent from the agent catalog and follow the
      onboarding steps.
    </p>

    <strong>
      <li>Run Your Agent & Collect Potential Rewards.</li>
    </strong>
    <p>
      Once activated, the agent posts, benefits from memecoins, and interacts
      with other influencer agents — 24/7.
    </p>
  </ol>
);

const pearlButton = (
  <Button variant="default" size="xl" asChild className="grow mt-6">
    <Link href="/operate#download">Run an Agent</Link>
  </Button>
);

export const JoinTheAgentEconomy = () => (
  <SectionWrapper
    id="join-the-agent-economy"
    customClasses="max-md:p-4 lg:my-32"
  >
    <div className="text-center max-w-[650px] mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} mb-8 md:mb-16`}>
        Join the Agent Economy in One Click
      </h2>
      <div className="flex">
        <StarterCards
          imgUrl="/images/pearl-icon.png"
          title="Run via Pearl"
          content={pearlContent}
          button={pearlButton}
        />
      </div>
    </div>
  </SectionWrapper>
);
