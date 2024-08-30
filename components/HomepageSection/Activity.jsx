import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';

import SectionWrapper from 'components/Layout/SectionWrapper';
// import { Button } from 'components/ui/button';
import { ExternalLink } from 'components/ui/typography';
import { FLIPSIDE_URL } from 'common-util/constants';
import SectionHeading from '../SectionHeading';

const BLOCKCHAIN_COUNT = 8;

export const Activity = ({
  activityMetrics: { agents, agentsTypes, transactions },
}) => {
  const data = useMemo(
    () => [
      {
        id: 'transactions',
        topText: 'Olas agents have made',
        subText: 'transactions',
        value: transactions?.toLocaleString(),
        source: FLIPSIDE_URL,
        isExternal: true,
      },
      {
        id: 'agents',
        topText: 'Operators have deployed',
        subText: 'agents',
        value: agents,
        source: `${FLIPSIDE_URL}?tabIndex=5`,
        isExternal: true,
      },
      {
        id: 'blockchains',
        topText: 'Olas is deployed across',
        subText: 'blockchains',
        value: BLOCKCHAIN_COUNT,
        source: null,
        isExternal: false,
      },
      {
        id: 'agentsTypes',
        topText: 'Devs have registered',
        subText: 'types of agents',
        value: agentsTypes,
        source: `${FLIPSIDE_URL}?tabIndex=5`,
        isExternal: true,
      },
    ],
    [agents, agentsTypes, transactions],
  );

  return (
    <SectionWrapper
      customClasses="text-center py-16 px-4 border-b"
      id="activity"
    >
      <div className="text-7xl lg:text-9xl mb-12 max-w-[750px] mx-auto mb-16">
        <Image
          alt="Placeholder"
          src="/images/generating-agents.png"
          width="270"
          height="300"
          className="mx-auto mb-16"
        />
        <SectionHeading color="text-gray-900" weight="font-bold">
          Generating an Ocean of Autonomous AI Agents
        </SectionHeading>
        <p className="text-xl md:text-2xl text-slate-700 mb-8 mx-auto">
          Olas incentivizes and coordinates different parties to launch
          autonomous agents that form entire AI economies.
        </p>
        <p className="py-2 px-5 bg-purple-100 border-fuchsia-200 border-1.5 rounded-full text-xl w-fit mx-auto">
          🤖 &nbsp; The first autonomous agents and economies are
          {' '}
          <ExternalLink href={FLIPSIDE_URL}>active</ExternalLink>
          .
        </p>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-0 w-max items-end mb-8">
        {data.map((item, index) => {
          let borderClassName = '';
          if (index !== 0) borderClassName += 'xl:border-l-1.5';
          if (index % 2 !== 0) borderClassName += ' md:border-l-1.5';
          const getValue = () => {
            if (!item.value) return '--';
            if (!item.source) return item.value;
            if (item.isExternal) {
              return (
                <ExternalLink href={item.source} hideArrow>
                  {item.value}
                  <span className="text-2xl">↗</span>
                </ExternalLink>
              );
            }
            return <Link href={item.source}>{item.value}</Link>;
          };

          return (
            <div
              key={item.id}
              className={`text-start w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full ${borderClassName}`}
            >
              <span className="block text-xl text-slate-700 mb-4">
                {item.topText}
              </span>
              <span
                className={`block text-5xl font-extrabold mb-4 ${
                  item.source ? 'text-purple-600 ' : ''
                }`}
              >
                {getValue()}
              </span>

              <span className="block text-xl text-slate-700">
                {item.subText}
              </span>
            </div>
          );
        })}
      </div>
      {/* <Button variant="outline" size="xl" asChild className="mb-12">
        <Link href="/explore">Explore the ecosystem</Link>
      </Button> */}
    </SectionWrapper>
  );
};

Activity.propTypes = {
  activityMetrics: PropTypes.shape({
    transactions: PropTypes.number,
    agents: PropTypes.number,
    agentsTypes: PropTypes.number,
  }).isRequired,
};
