import {
  SECTION_BOX_CLASS,
  SUB_HEADER_MEDIUM_CLASS,
} from 'common-util/classes';
import { DISCORD_INVITE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { Tag } from 'components/ui/tag';
import { ExternalLink } from 'components/ui/typography';
import Link from 'next/link';

const list = [
  {
    title: 'Chains and Protocols',
    description: 'Scalable growth and utility for your token.',
    cardTitle: 'Daily Active Users, on Demand',
    cardContent: (
      <>
        <p>
          Staking can provide a rich set of opportunities to boost your chain,
          protocol or app activity.
        </p>
        <ul className="list-disc ml-6">
          <li>
            Incentivize AI agent activity to boost your chain, protocol or app
            activity.
          </li>
          <li>Attract builders and agent operators.</li>
          <li>Bring utility to your own token.</li>
        </ul>
        <p>Launch an agent economy on top of your protocol.</p>
      </>
    ),
    buttonUrl: DISCORD_INVITE_URL,
    isExternal: true,
    buttonText: 'Get Community Support',
  },
  {
    title: 'AI Agent Users',
    description: 'Lots of staking and incentive opportunities.',
    cardTitle: 'AI-Enhanced Productivity',
    cardContent:
      'For AI agent users, staking can provide a rich set of opportunities to earn yield in OLAS and other tokens. As members of the Olas ecosystem and other protocols create new staking programs, each one provides agent operators with yield opportunities.',
    buttonUrl: '/operate#get-started',
    buttonText: 'Run AI Agents',
  },
  {
    title: 'Builders',
    description:
      'Understand what code to work on and earn rewards more sustainably.',
    cardTitle: 'High-Impact Problems, Clear Incentives',
    cardContent: (
      <>
        <p>
          Staking makes it easier to know what to build — and get rewarded for
          it:
        </p>
        <ul className="list-disc ml-6">
          <li>Signals which problems need solving.</li>
          <li>Shows which areas are likely to be sustainably funded.</li>
          <li>Increases earning opportunities through active agent rewards.</li>
        </ul>
      </>
    ),
    buttonUrl: '/build',
    buttonText: 'Start Building Your Agent',
  },
];

export const ForProtocols = () => (
  <SectionWrapper
    id="for-protocols-builders-and-operators"
    backgroundType="NONE"
    customClasses={`${SECTION_BOX_CLASS} bg-slate-100`}
  >
    <div className="max-w-4xl mx-auto">
      <div className="w-fit mx-auto">
        <Tag variant="primary" className="mb-14">
          What This Means for Protocols, Builders and AI Agent Operators
        </Tag>
      </div>
      <div className="flex flex-col gap-14 lg:gap-[120px]">
        {list.map((item, index) => {
          const order = index % 2 === 0 ? 'flex-row' : 'flex-row-reverse';

          return (
            <div
              key={item.title}
              className={`flex max-md:flex-col ${order} justify-between max-lg:gap-14`}
            >
              <div className="lg:w-[380px]">
                <h4 className={`${SUB_HEADER_MEDIUM_CLASS} mb-3`}>
                  {item.title}
                </h4>
                <p className="text-slate-600">{item.description}</p>
              </div>
              <Card className="activity-card-opaque p-8 md:w-[436px]">
                <h5 className="text-lg font-semibold mb-4">{item.cardTitle}</h5>
                <div className="mb-6">{item.cardContent}</div>
                <Button variant="ghostPrimary" size="lg" asChild>
                  {item.isExternal ? (
                    <ExternalLink href={item.buttonUrl} hideArrow>
                      {item.buttonText}
                    </ExternalLink>
                  ) : (
                    <Link href={item.buttonUrl} className="text-purple-600">
                      {item.buttonText}
                    </Link>
                  )}
                </Button>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  </SectionWrapper>
);
