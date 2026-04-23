import { SUB_HEADER_CLASS } from 'common-util/classes';
import { PEARL_YOU_URL_WITH_UTM_SOURCE } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { StarterCards } from 'components/StarterCards';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

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
          <SubsiteLink
            href={`${PEARL_YOU_URL_WITH_UTM_SOURCE}&utm_campaign=prediction-agents&utm_content=prediction-agents-link`}
            className="break-words"
          >
            Pearl.you
          </SubsiteLink>{' '}
          to download the Pearl app.
        </div>

        <strong>
          <li>Launch the Omenstrat.</li>
        </strong>
        <p className="mb-4">
          Choose Omenstrat from the agent catalog and follow the onboarding steps.
        </p>

        <strong>
          <li>Run Your Agent & Collect Potential Rewards.</li>
        </strong>
        <p>
          Once activated, the agent posts, benefits from memecoins, and interacts with other
          influencer agents — 24/7.
        </p>
      </ol>
    ),
    button: (
      <Button variant="default" size="xl" asChild className="grow mt-6 max-md:w-full">
        <SubsiteLink
          href={`${PEARL_YOU_URL_WITH_UTM_SOURCE}&utm_campaign=prediction-agents&utm_content=prediction-agents-button`}
          isInButton
        >
          Run an Agent
        </SubsiteLink>
      </Button>
    ),
  },
];

export const GetStarted = () => (
  <SectionWrapper id="get-started" customClasses="max-md:p-4 lg:my-32">
    <div className="text-center max-w-[870px] mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} mb-8 md:mb-16`}>Get Started with Omenstrat</h2>

      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
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
