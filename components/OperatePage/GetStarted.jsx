import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { StarterCards } from 'components/StarterCards';
import { Button } from 'components/ui/button';
import { ExternalLink } from 'components/ui/typography';
import Link from 'next/link';

const list = [
  {
    title: 'Pearl',
    subtitle: 'User-friendly desktop app.',
    imgUrl: '/images/pearl-icon.png',
    content: (
      <ol className="list-decimal ml-6">
        <strong>
          <li className="mb-2">Download the Pearl app.</li>
        </strong>

        <strong>
          <li>Run an Agent.</li>
        </strong>
        <p className="mb-4">
          Choose an agent, get it running, and keep it online.
        </p>

        <strong>
          <li>Earn OLAS.</li>
        </strong>
        <p>
          Receive OLAS rewards when your agents complete tasks, contribute
          value, or stay active.
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
        <Link href="/operate#download">Get Started with Pearl</Link>
      </Button>
    ),
  },
  {
    title: 'Quickstart',
    subtitle: 'Technical & customizable CLI experience.',
    imgUrl: '/images/prediction-agents-page/quickstart.png',
    content: (
      <ol className="list-decimal ml-6 mb-6">
        <strong>
          <li className="mb-2">Read the Quickstart script.</li>
        </strong>

        <strong>
          <li>Run an Agent.</li>
        </strong>
        <p className="mb-4">
          Choose an agent, follow the{' '}
          <ExternalLink href="https://github.com/valory-xyz/quickstart?tab=readme-ov-file#supported-agents">
            README guide
          </ExternalLink>{' '}
          to get it running, and keep it online.
        </p>

        <strong>
          <li>Earn OLAS.</li>
        </strong>
        <p>
          Receive OLAS rewards when your agents complete tasks, contribute
          value, or stay active.
        </p>
      </ol>
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
          Get Started with Quickstart
        </ExternalLink>
      </Button>
    ),
  },
];

export const GetStarted = () => (
  <SectionWrapper
    id="get-started"
    customClasses="max-md:p-4 max-lg:px-4 lg:my-32"
  >
    <div className="text-center max-w-[870px] mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} max-lg:mt-12 mb-8 md:mb-16`}>
        Get Started with the Prediction Agent
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((item) => (
          <div key={item.title} className="flex">
            <StarterCards
              imgUrl={item.imgUrl}
              title={item.title}
              subtitle={item.subtitle}
              content={item.content}
              button={item.button}
            />
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
