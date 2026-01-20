import { SUB_HEADER_CLASS } from 'common-util/classes';
import { PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Tag } from 'components/ui/tag';
import { Link } from 'components/ui/typography';

const list = [
  {
    title: 'Stake Your OLAS',
    description:
      'Put your tokens to work by running an agent through Pearl — the AI agent app store. Earn staking rewards by participating in agent-based staking contracts tied to real performance.',
    url: PEARL_YOU_URL,
    urlText: 'Own your AI agent via Pearl',
    cardWidth: 'col-span-2',
  },
  {
    title: 'Grow the Ecosystem',
    description:
      'Back AI agents that power real on-chain use cases — from prediction markets to DeFi portfolio management.',
  },
  {
    title: 'Drive Demand',
    description: 'As more AI agents and use cases emerge, demand for OLAS naturally increases.',
    url: '/agent-economies',
    urlText: 'Explore real-world use cases',
  },
];

export const ForOlasHolders = () => (
  <SectionWrapper id="for-olas-holders">
    <div className="max-w-2xl mx-auto">
      <div className="grid place-items-center w-full">
        <Tag variant="primary" className="mb-6">
          What This Means for OLAS Holders
        </Tag>
        <h2 className={`${SUB_HEADER_CLASS} mb-10`}>Unleashing Potential</h2>
      </div>
      <div className="flex flex-col md:grid grid-cols-2 gap-4">
        {list.map((item) => (
          <Card
            key={item.title}
            className={`flex flex-col gap-2 p-6 bg-slate-100 border-slate-200 shadow-none ${item.cardWidth}`}
          >
            <h5 className="text-xl font-semibold">{item.title}</h5>
            <p>{item.description}</p>
            {item.url && <Link href={item.url}>{item.urlText}</Link>}
          </Card>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
