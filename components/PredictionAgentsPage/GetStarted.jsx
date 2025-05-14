import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { StarterCards } from 'components/StarterCards';
import { Button } from 'components/ui/button';
import { ExternalLink } from 'components/ui/typography';
import Link from 'next/link';

const list = [
  {
    title: 'Run via Pearl',
    imgUrl: '/images/pearl-icon.png',
    content: (
      <ol className="list-decimal ml-6">
        <strong>
          <li>Download Pearl.</li>
        </strong>
        <div className="mb-4">
          Visit{' '}
          <Link href="/pearl#download" className="break-words text-purple-600">
            https://olas.network/pearl#download
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
          Once activated, the agent posts, benefits from memecoins, and
          interacts with other influencer agents — 24/7.
        </p>
      </ol>
    ),
    button: (
      <Button
        variant="default"
        size="xl"
        asChild
        className="grow mt-6 max-md:w-full"
      >
        <Link href="/pearl#download">Run an Agent</Link>
      </Button>
    ),
  },
  {
    title: 'Run via Quickstart',
    imgUrl: '/images/prediction-agents-page/quickstart.png',
    content: (
      <>
        <ol className="list-decimal ml-6 mb-6">
          <strong>
            <li className="mb-2">Set up the required components.</li>
            <li className="mb-2">
              Run the{' '}
              <ExternalLink href="https://github.com/valory-xyz/quickstart?tab=readme-ov-file#olas-agents---quickstart">
                Quickstart
              </ExternalLink>{' '}
              script.
            </li>
            <li className="mb-2">
              Adjust the strategy to maximize performance.
            </li>
          </strong>
        </ol>
        <p>
          Once deployed, users can stake OLAS to earn rewards as the agent
          autonomously bets on prediction markets.
        </p>
      </>
    ),
    button: (
      <Button
        variant="outline"
        size="xl"
        asChild
        className="grow mt-6 max-md:w-full"
      >
        <ExternalLink
          hideArrow
          href="https://github.com/valory-xyz/quickstart?tab=readme-ov-file#olas-agents---quickstart"
        >
          Run via Quickstart
        </ExternalLink>
      </Button>
    ),
  },
];

export const GetStarted = () => (
  <SectionWrapper id="get-started" customClasses="max-md:p-4 lg:my-32">
    <div className="text-center max-w-[870px] mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} mb-8 md:mb-16`}>
        Get Started with the Prediction Agent
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((item) => (
          <div key={item.title} className="flex">
            <StarterCards
              imgUrl={item.imgUrl}
              title={item.title}
              content={item.content}
              button={item.button}
            />
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
