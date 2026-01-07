import { getMainMetrics } from 'common-util/api';
import { getTotalUniqueStakers } from 'common-util/api/dune';
import { VALORY_GIT_URL } from 'common-util/constants';
import { formatEthNumber } from 'common-util/numberFormatter';
import SectionHeading from 'components/SectionHeading';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { ExternalLink, Link } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

const imgPath = '/images/homepage/activity/';

const fetchMetrics = async () => {
  const [mainMetrics, agents] = await Promise.allSettled([
    getMainMetrics(),
    getTotalUniqueStakers(),
  ]);

  return {
    transactions:
      mainMetrics.status === 'fulfilled'
        ? mainMetrics.value?.data?.transactions
        : null,
    agents: agents.status === 'fulfilled' ? agents.value : null,
    olasStaked:
      mainMetrics.status === 'fulfilled'
        ? mainMetrics.value?.data?.olasStaked
        : null,
    dailyActiveAgents:
      mainMetrics.status === 'fulfilled'
        ? mainMetrics.value?.data?.dailyActiveAgents
        : null,
    ataTransactions:
      mainMetrics.status === 'fulfilled'
        ? mainMetrics.value?.data?.ataTransactions
        : null,
    mechTurnover:
      mainMetrics.status === 'fulfilled'
        ? mainMetrics.value?.data?.mechFees
        : null,
    totalOperators:
      mainMetrics.status === 'fulfilled'
        ? mainMetrics.value?.data?.totalOperators
        : null,
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
        // @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; align: str... Remove this comment to see the full error message
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
  alt,
  text,
  primary: {
    text: primaryText,
    link: primaryLink,
    value: primaryValue,
    isLinkExternal: primaryIsLinkExternal = true,
  },
  secondary = {},
  tertiary = {},
}) => {
  const {

    // @ts-expect-error TS(2339) FIXME: Property 'text' does not exist on type '{}'.
    text: secondaryText,

    // @ts-expect-error TS(2339) FIXME: Property 'link' does not exist on type '{}'.
    link: secondaryLink,

    // @ts-expect-error TS(2339) FIXME: Property 'value' does not exist on type '{}'.
    value: secondaryValue,

    // @ts-expect-error TS(2339) FIXME: Property 'isLinkExternal' does not exist on type '... Remove this comment to see the full error message
    isLinkExternal: secondaryIsLinkExternal = true,
  } = secondary;

  const {

    // @ts-expect-error TS(2339) FIXME: Property 'text' does not exist on type '{}'.
    text: tertiaryText,

    // @ts-expect-error TS(2339) FIXME: Property 'link' does not exist on type '{}'.
    link: tertiaryLink,

    // @ts-expect-error TS(2339) FIXME: Property 'value' does not exist on type '{}'.
    value: tertiaryValue,

    // @ts-expect-error TS(2339) FIXME: Property 'isLinkExternal' does not exist on type '... Remove this comment to see the full error message
    isLinkExternal: tertiaryIsLinkExternal = true,
  } = tertiary;

  const PrimaryLink = primaryIsLinkExternal ? ExternalLink : Link;
  const SecondaryLink = secondaryIsLinkExternal ? ExternalLink : Link;
  const TertiaryLink = tertiaryIsLinkExternal ? ExternalLink : Link;

  return (

    // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
    <Card className="flex flex-col py-4 px-6 gap-4 h-fit w-full md:w-[300px] activity-card-opaque">
      <div className="flex flex-row place-items-center gap-3">
        <Image
          src={`${imgPath}${icon}`}
          alt={alt ?? text}
          width={iconWidth}
          height={iconHeight}
        />
        {text}
      </div>
      <div className="flex flex-row gap-2 place-items-center">
        <PrimaryLink href={primaryLink}>
          <div className="text-purple-700 text-2xl font-semibold">
            {primaryValue}
          </div>
        </PrimaryLink>
        {primaryText}
      </div>
      {secondaryValue && (
        <div className="flex flex-row gap-2 place-items-center">
          <SecondaryLink href={secondaryLink}>
            <div className="text-purple-700 text-xl font-semibold">
              {secondaryValue}
            </div>
          </SecondaryLink>
          {secondaryText}
        </div>
      )}
      {tertiaryValue && (
        <div className="flex flex-row gap-2 place-items-center">
          <TertiaryLink href={tertiaryLink}>
            <div className="text-purple-700 text-xl font-semibold">
              {tertiaryValue}
            </div>
          </TertiaryLink>
          {tertiaryText}
        </div>
      )}
    </Card>
  );
};

const UsersCard = ({ olasStaked, totalOperators }) => (

  // @ts-expect-error TS(2741) FIXME: Property 'alt' is missing in type '{ icon: string;... Remove this comment to see the full error message
  <ActivityCard
    icon="users.png"
    text="Users"
    primary={{
      value: totalOperators,
      text: 'Agents deployed',
      link: '/data#operators',
      isLinkExternal: false,
    }}
    secondary={{
      value: olasStaked,
      text: 'OLAS staked',
      link: '/data#olas-staked',
      isLinkExternal: false,
    }}
  />
);

const OlasBurnedCard = () => (

  // @ts-expect-error TS(2741) FIXME: Property 'text' is missing in type '{ icon: string... Remove this comment to see the full error message
  <ActivityCard
    icon="olas-burned.png"
    alt="OLAS burned"
    primary={{
      value: '$0',
      text: 'OLAS burned',
      link: '/data#protocol-fees',
      isLinkExternal: false,
    }}
  />
);

const DailyActiveAgentsCard = ({ dailyActiveAgents }) => (

  // @ts-expect-error TS(2741) FIXME: Property 'text' is missing in type '{ icon: string... Remove this comment to see the full error message
  <ActivityCard
    icon="daas.png"
    alt="Daily Active Agents"
    iconWidth={252}
    iconHeight={56}
    primary={{
      value: dailyActiveAgents,
      text: (
        <>
          // @ts-expect-error TS(2609) FIXME: JSX spread child must be an array type.
          // @ts-expect-error TS(2741): Property 'contentClassName' is missing in type '{ ... Remove this comment to see the full error message
          DAAs <Popover>7-day average Daily Active Agents</Popover>
        </>
      ),
      link: '/data#daily-active-agents',
      isLinkExternal: false,
    }}
  />
);

const AgentToAgentCard = ({ ataTransactions, mechTurnover }) => (

  // @ts-expect-error TS(2741) FIXME: Property 'text' is missing in type '{ icon: string... Remove this comment to see the full error message
  <ActivityCard
    icon="agent-to-agent.png"
    alt="Agent to Agent"
    iconWidth={104}
    iconHeight={36}
    primary={{

      // @ts-expect-error TS(2345) FIXME: Argument of type '{ notation: string; }' is not as... Remove this comment to see the full error message
      value: formatEthNumber(ataTransactions, { notation: 'standard' }),
      text: 'A2A txns',
      link: '/data#ata-transactions',
      isLinkExternal: false,
    }}
    secondary={{
      value: `$${Number(mechTurnover).toLocaleString()}`,
      text: 'turnover',
      link: '/data#mech-turnover',
      isLinkExternal: false,
    }}
    tertiary={{
      value: '0%',
      text: 'fees collected',
      link: '/data#protocol-fees',
      isLinkExternal: false,
    }}
  />
);

const TransactionsCard = ({ transactions }) => (

  // @ts-expect-error TS(2741) FIXME: Property 'text' is missing in type '{ icon: string... Remove this comment to see the full error message
  <ActivityCard
    icon="txns.png"
    alt="Transactions"
    primary={{
      value: transactions,
      text: 'txns',
      link: '/data#transactions',
      isLinkExternal: false,
    }}
  />
);

const AgentsGrid = () => (
  <div className="flex flex-row w-[124px] flex-wrap mb-2 px-auto">
    {agents.map((item) => (
      <Link key={item} href={`/agent-economies/${item}`}>
        <Image
          src={`/images/homepage/activity/${item}.png`}
          alt={item}
          width={62}
          height={62}
          className="hover:-translate-y-1 duration-150"
        />
      </Link>
    ))}
  </div>
);

export const Activity = () => {

  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
  const { data: metrics } = usePersistentSWR('tokenMetrics', fetchMetrics);

  const processedMetrics = useMemo(() => {
    if (!metrics) return null;

    return {
      transactions: metrics.transactions?.toLocaleString() || '--',
      agents: metrics.agents?.toLocaleString() || '--',
      olasStaked: metrics.olasStaked?.toLocaleString() || '--',
      dailyActiveAgents: metrics.dailyActiveAgents?.toLocaleString() || '--',
      mechTurnover: metrics.mechTurnover || '--',
      ataTransactions: metrics.ataTransactions?.toLocaleString() || '--',
      totalOperators: metrics.totalOperators?.toLocaleString() || '--',
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

            // @ts-expect-error TS(2322) FIXME: Type '{ agents: any; olasStaked: any; totalOperato... Remove this comment to see the full error message
            agents={processedMetrics?.agents}
            olasStaked={processedMetrics?.olasStaked}
            totalOperators={processedMetrics?.totalOperators}
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
            <OlasBurnedCard />
            // @ts-expect-error TS(2741): Property 'className' is missing in type '{}' but r... Remove this comment to see the full error message
            // @ts-expect-error TS(2741) FIXME: Property 'className' is missing in type '{}' but r... Remove this comment to see the full error message
            <OlasIsBurnedArrow />
          </div>
          <div className="flex flex-col place-items-center z-10">
            <AgentsGrid />
            <Link href="/agent-economies">Agent economies</Link>
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
            ataTransactions={processedMetrics?.ataTransactions}
            mechTurnover={processedMetrics?.mechTurnover}
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

          // @ts-expect-error TS(2322) FIXME: Type '{ agents: any; olasStaked: any; totalOperato... Remove this comment to see the full error message
          agents={processedMetrics?.agents}
          olasStaked={processedMetrics?.olasStaked}
          totalOperators={processedMetrics?.totalOperators}
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
          ataTransactions={processedMetrics?.ataTransactions}
          mechTurnover={processedMetrics?.mechTurnover}
        />
        <OlasIsBurnedArrow pointsDown className="mx-auto mb-2" />
        <OlasBurnedCard />
        <Image
          src={`${imgPath}mobile-arrow5.png`}
          alt="arrow"
          width={343}
          height={202}
          className="mx-auto mb-12"
        />
        <div className="mx-auto grid place-items-center z-10">
          <AgentsGrid />
          <div>
            As a result, <Link href="/agent-economies">Agent economies</Link>{' '}
            are thriving.
          </div>
        </div>
      </div>
    </div>
  );
};
