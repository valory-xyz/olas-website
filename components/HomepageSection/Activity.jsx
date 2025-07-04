import {
  getA2ATransactions,
  getFeeFlowMetrics,
  getTotalOlasStaked,
  getTotalUniqueStakers,
} from 'common-util/api/dune';
import {
  get7DaysAvgActivity,
  getTotalTransactionsCount,
} from 'common-util/api/flipside';
import {
  DUNE_A2A_TRANSACTIONS_QUERY_URL,
  DUNE_AGENTS_QUERY_URL,
  DUNE_MMV2_URL,
  DUNE_OLAS_STAKED_URL,
  FLIPSIDE_DAAS_QUERY_URL,
  FLIPSIDE_URL,
  VALORY_GIT_URL,
} from 'common-util/constants';
import SectionHeading from 'components/SectionHeading';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

const imgPath = '/images/homepage/activity/';

const fetchMetrics = async () => {
  const [
    transactions,
    agents,
    olasStaked,
    dailyActiveAgents,
    a2aTransactions,
    feeMetrics,
  ] = await Promise.allSettled([
    getTotalTransactionsCount(),
    getTotalUniqueStakers(),
    getTotalOlasStaked(),
    get7DaysAvgActivity(),
    getA2ATransactions(),
    getFeeFlowMetrics(),
  ]);

  return {
    transactions:
      transactions.status === 'fulfilled' ? transactions.value : null,
    agents: agents.status === 'fulfilled' ? agents.value : null,
    olasStaked: agents.status === 'fulfilled' ? olasStaked.value : null,
    dailyActiveAgents:
      dailyActiveAgents.status === 'fulfilled' ? dailyActiveAgents.value : null,
    a2aTransactions:
      a2aTransactions.status === 'fulfilled' ? a2aTransactions.value : null,
    feeMetrics: feeMetrics.status == 'fulfilled' ? feeMetrics.value : null,
  };
};

const agents = ['predict', 'babydegen', 'mech', 'agentsfun'];

const OlasIsBurnedArrow = ({ pointsDown = false, className }) => (
  <div className={`flex flex-row md:mt-4 gap-2 ${className}`}>
    <p className="w-[76px] md:ml-[58px] text-sm mt-9 md:mt-[46px] mb-auto max-sm:text-slate-500">
      OLAS is burned
    </p>
    <Image
      src={`${imgPath}${pointsDown ? 'mobile-arrow4.png' : 'arrow4.png'}`}
      alt="arrow"
      width={50}
      height={124}
      className="h-[124px]"
    />
    <div className="mb-auto mt-[47px] font-semibold text-sm md:mt-[58px] text-black z-20 content-center flex flex-row gap-2">
      <p>OFF</p>
      <Popover
        align="center"
        side="right"
        contentClassName="w-[382px] text-left font-normal translate-x-2"
      >
        Fees collected can be turned on or off by the Governors of the Olas
        Protocol. Currently, fees are turned off to encourage early adoption and
        growth of the marketplace.
        <ExternalLink
          href={`${VALORY_GIT_URL}/autonolas-aip/blob/aip-5/content/aips/automate_relayer_marketplace.md`}
          className="mt-2 cursor-pointer"
        >
          More about Mech Marketplace fees in AIP-5
        </ExternalLink>
      </Popover>
    </div>
  </div>
);

const ActivityCard = ({
  icon,
  iconWidth = 40,
  iconHeight = 40,
  text,
  primary: { text: primaryText, link: primaryLink, value: primaryValue },
  secondary = {},
  tertiary = {},
}) => {
  const {
    text: secondaryText,
    link: secondaryLink,
    value: secondaryValue,
  } = secondary;

  const {
    text: tertiaryText,
    link: tertiaryLink,
    value: tertiaryValue,
  } = tertiary;

  return (
    <Card className="flex flex-col py-4 px-6 gap-4 h-fit w-full md:w-[300px] activity-card-opaque">
      <div className="flex flex-row place-items-center gap-3">
        <Image
          src={`${imgPath}${icon}`}
          alt={text}
          width={iconWidth}
          height={iconHeight}
        />
        {text}
      </div>
      <div className="flex flex-row gap-2 place-items-center">
        <ExternalLink href={primaryLink}>
          <div className="text-purple-700 text-2xl font-semibold">
            {primaryValue}
          </div>
        </ExternalLink>
        {primaryText}
      </div>
      {secondaryValue && (
        <div className="flex flex-row gap-2 place-items-center">
          <ExternalLink href={secondaryLink}>
            <div className="text-purple-700 text-xl font-semibold">
              {secondaryValue}
            </div>
          </ExternalLink>
          {secondaryText}
        </div>
      )}
      {tertiaryValue && (
        <div className="flex flex-row gap-2 place-items-center">
          <ExternalLink href={tertiaryLink}>
            <div className="text-purple-700 text-xl font-semibold">
              {tertiaryValue}
            </div>
          </ExternalLink>
          {tertiaryText}
        </div>
      )}
    </Card>
  );
};

const UsersCard = ({ agents, olasStaked }) => (
  <ActivityCard
    icon="users.png"
    text="Users"
    primary={{
      value: agents,
      text: 'agents deployed',
      link: DUNE_AGENTS_QUERY_URL,
    }}
    secondary={{
      value: olasStaked,
      text: 'OLAS staked',
      link: DUNE_OLAS_STAKED_URL,
    }}
  />
);

const OlasBurnedCard = ({ olasBurned }) => (
  <ActivityCard
    icon="olas-burned.png"
    primary={{
      value: `$${Number(olasBurned).toLocaleString()}`,
      text: 'OLAS burned',
      link: DUNE_MMV2_URL,
    }}
  />
);

const DailyActiveAgentsCard = ({ dailyActiveAgents }) => (
  <ActivityCard
    icon="daas.png"
    iconWidth={252}
    iconHeight={56}
    primary={{
      value: dailyActiveAgents,
      text: (
        <>
          DAAs <Popover>7-day average Daily Active Agents</Popover>
        </>
      ),
      link: FLIPSIDE_DAAS_QUERY_URL,
    }}
  />
);

const AgentToAgentCard = ({ a2aTransactions, feesCollected, protocolFees }) => (
  <ActivityCard
    icon="agent-to-agent.png"
    iconWidth={104}
    iconHeight={36}
    primary={{
      value: a2aTransactions,
      text: 'A2A txns',
      link: DUNE_A2A_TRANSACTIONS_QUERY_URL,
    }}
    secondary={{
      value: `$${Number(feesCollected).toLocaleString()}`,
      text: 'turnover',
      link: DUNE_MMV2_URL,
    }}
    tertiary={{
      value: `${protocolFees}%`,
      text: 'fees collected',
      link: DUNE_MMV2_URL,
    }}
  />
);

const TransactionsCard = ({ transactions }) => (
  <ActivityCard
    icon="txns.png"
    primary={{
      value: transactions,
      text: 'txns',
      link: FLIPSIDE_URL,
    }}
  />
);

export const Activity = () => {
  const { data: metrics } = usePersistentSWR('tokenMetrics', fetchMetrics);

  const processedMetrics = useMemo(() => {
    if (!metrics) return null;

    return {
      transactions: metrics.transactions?.toLocaleString() || '--',
      agents: metrics.agents?.toLocaleString() || '--',
      olasStaked: metrics.olasStaked?.toLocaleString() || '--',
      dailyActiveAgents: metrics.dailyActiveAgents?.toLocaleString() || '--',
      a2aTransactions: metrics.a2aTransactions?.toLocaleString() || '--',
      feesCollected: metrics.feeMetrics?.totalFees?.toFixed(2) || '--',
      protocolFees: metrics.feeMetrics?.protocolFees?.toFixed(2) || '--',
      olasBurned: metrics.feeMetrics?.olasBurned?.toFixed(2) || '--',
    };
  }, [metrics]);

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading
        color="text-gray-900"
        weight="font-bold"
        other="mb-12 max-w-3xl text-center mx-auto max-lg:mx-4"
      >
        OLAS: Powers AI Agent Economies
      </SectionHeading>
      <p className="text-lg text-slate-600 mb-20 max-lg:mx-4">
        The OLAS token is bootstrapping a flywheel birthing larger and larger
        agent economies: Each Pearl user stakes OLAS to access their
        agents&apos; benefits. To provide utility to their users Pearl agents
        use the marketplace. The marketplace charges fees to agents. Fees are
        used to burn OLAS.
      </p>

      <div className="flex flex-col max-w-4xl mx-auto text-slate-500 place-items-center hidden md:flex">
        <div className="flex flex-row">
          <p className="w-[124px] text-sm pt-24">
            Attracts more builders and users
          </p>
          <Image
            src={`${imgPath}arrow5.png`}
            alt="arrow"
            width={124}
            height={176}
            className="mt-12 ml-3 md:mr-4 w-[124px] h-[176px]"
          />
          <UsersCard
            agents={processedMetrics?.agents}
            olasStaked={processedMetrics?.olasStaked}
          />
          <Image
            src={`${imgPath}arrow.png`}
            alt="arrow"
            width={150}
            height={142}
            className="mt-14 mr-2 w-[150px] h-[142px]"
          />
          <p className="w-[124px] text-sm pt-24">
            Stake OLAS to use Pearl agents
          </p>
        </div>
        <div className="flex flex-row place-items-center w-full justify-between">
          <div className="flex flex-col">
            <OlasBurnedCard olasBurned={processedMetrics?.olasBurned} />
            <OlasIsBurnedArrow />
          </div>
          <div className="flex flex-col place-items-center z-10">
            <div className="flex flex-row w-[124px] flex-wrap mb-2 px-auto">
              {agents.map((item) => (
                <Image
                  key={item}
                  src={`/images/homepage/activity/${item}.png`}
                  alt={item}
                  width={62}
                  height={62}
                  className="hover:-translate-y-1 duration-150"
                />
              ))}
            </div>
            <Link
              href="/agent-economies"
              className="text-purple-700 hover:text-purple-900"
            >
              Agent economies
            </Link>
          </div>
          <div className="flex flex-col">
            <DailyActiveAgentsCard
              dailyActiveAgents={processedMetrics?.dailyActiveAgents}
            />
            <div className="flex flex-row">
              <Image
                src={`${imgPath}arrow2.png`}
                alt="arrow2"
                width={28}
                height={124}
                className="h-[124px] ml-auto"
              />
              <p className="w-[76px] text-sm mr-[68px] ml-2 my-auto">
                Agents are active
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row place-items-center">
          <AgentToAgentCard
            a2aTransactions={processedMetrics?.a2aTransactions}
            feesCollected={processedMetrics?.feesCollected}
            protocolFees={processedMetrics?.protocolFees}
          />
          <div>
            <Image
              src={`${imgPath}arrow3.png`}
              alt="arrow2"
              width={257}
              height={10}
              className="ml-4"
            />
            <p>AI Agent Bazaar is used</p>
          </div>
          <TransactionsCard transactions={processedMetrics?.transactions} />
        </div>
      </div>

      <div className="flex flex-col md:hidden w-[90%] mx-auto">
        <UsersCard
          agents={processedMetrics?.agents}
          olasStaked={processedMetrics?.olasStaked}
        />
        <Image
          src={`${imgPath}mobile-arrow.png`}
          alt="arrow"
          width={240}
          height={120}
          className="mx-auto mb-2"
        />
        <DailyActiveAgentsCard
          dailyActiveAgents={processedMetrics?.dailyActiveAgents}
        />
        <Image
          src={`${imgPath}mobile-arrow2.png`}
          alt="arrow"
          width={132}
          height={120}
          className="mx-auto mb-2"
        />
        <TransactionsCard transactions={processedMetrics?.transactions} />
        <Image
          src={`${imgPath}mobile-arrow3.png`}
          alt="arrow"
          width={180}
          height={120}
          className="mx-auto mb-2"
        />
        <AgentToAgentCard
          a2aTransactions={processedMetrics?.a2aTransactions}
          feesCollected={processedMetrics?.feesCollected}
          protocolFees={processedMetrics?.protocolFees}
        />
        <OlasIsBurnedArrow pointsDown className="mx-auto mb-2" />
        <OlasBurnedCard olasBurned={processedMetrics?.olasBurned} />
        <Image
          src={`${imgPath}mobile-arrow5.png`}
          alt="arrow"
          width={343}
          height={202}
          className="mx-auto"
        />
      </div>
    </div>
  );
};
