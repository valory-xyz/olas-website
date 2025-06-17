import { getA2ATransactions, getFeeFlowMetrics } from 'common-util/api/dune';
import {
  get7DaysAvgActivity,
  getTotalTransactionsCount,
  getTotalUnitsCount,
} from 'common-util/api/flipside';
import {
  DUNE_A2A_TRANSACTIONS_QUERY_URL,
  DUNE_AGENTS_QUERY_URL,
  DUNE_MMV2_URL,
  FLIPSIDE_DAAS_QUERY_URL,
  FLIPSIDE_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import { ChevronDown, Copy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const imgPath = '/images/homepage/activity/';

const fetchMetrics = async () => {
  const [transactions, agents, dailyActiveAgents, a2aTransactions, feeMetrics] =
    await Promise.allSettled([
      getTotalTransactionsCount(),
      getTotalUnitsCount(),
      get7DaysAvgActivity(),
      getA2ATransactions(),
      getFeeFlowMetrics(),
    ]);

  return {
    transactions:
      transactions.status === 'fulfilled' ? transactions.value : null,
    agents: agents.status === 'fulfilled' ? agents.value : null,
    dailyActiveAgents:
      dailyActiveAgents.status === 'fulfilled' ? dailyActiveAgents.value : null,
    a2aTransactions:
      a2aTransactions.status === 'fulfilled' ? a2aTransactions.value : null,
    feeMetrics: feeMetrics.status == 'fulfilled' ? feeMetrics.value : null,
  };
};

const addresses = [
  {
    name: 'Etherium',
    src: 'eth.svg',
    activeSrc: 'eth-color.svg',
    address: '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0',
  },
  {
    name: 'Gnosis',
    src: 'gnosis.svg',
    activeSrc: 'gnosis-color.svg',
    address: '0xcE11e14225575945b8E6Dc0D4F2dD4C570f79d9f',
  },
  {
    name: 'Polygon',
    src: 'polygon.svg',
    activeSrc: 'polygon-color.svg',
    address: '0xFEF5d947472e72Efbb2E388c730B7428406F2F95',
  },
  {
    name: 'Arbitrum',
    src: 'arbitrum.svg',
    activeSrc: 'arbitrum-color.svg',
    address: '0x064F8B858C2A603e1b106a2039f5446D32dc81c1',
  },
  {
    name: 'Solana',
    src: 'solana.svg',
    activeSrc: 'solana-color.svg',
    address: 'Ez3nzG9ofodYCvEmw73XhQ87LWNYVRM2s7diB5tBZPyM',
  },
  {
    name: 'Optimism',
    src: 'optimism.svg',
    activeSrc: 'optimism-color.svg',
    address: '0xFC2E6e6BCbd49ccf3A5f029c79984372DcBFE527',
  },
  {
    name: 'Base',
    src: 'base.svg',
    activeSrc: 'base-color.svg',
    address: '0x54330d28ca3357F294334BDC454a032e7f353416',
  },
  {
    name: 'Celo',
    src: 'celo.svg',
    activeSrc: 'celo-color.svg',
    address: '0xaCFfAe8e57Ec6E394Eb1b41939A8CF7892DbDc51',
  },
  {
    name: 'Mode',
    src: 'mode.svg',
    activeSrc: 'mode-color.svg',
    address: '0xcfD1D50ce23C46D3Cf6407487B2F8934e96DC8f9',
  },
];

const agentsHere = ['predict', 'babydegen', 'mech', 'agentsfun'];

const OlasIsBurnedArrow = ({ pointsDown = false, className }) => (
  <div className={`flex flex-row gap-2 ${className}`}>
    <p className="w-[76px] md:ml-[66px] text-sm my-auto max-sm:text-slate-500">
      OLAS is burned
    </p>
    <Image
      src={`${imgPath}${pointsDown ? 'mobile-arrow4.png' : 'arrow4.png'}`}
      alt="arrow"
      width={50}
      height={124}
      className="h-[124px]"
    />
    <div className="mb-auto mt-[42px] font-semibold text-sm md:mt-[54px] text-black">
      OFF{' '}
      <Popover
        align="start"
        side="right"
        contentClassName="w-[382px] text-left"
      >
        Fees collected can be turned on or off by the Governors of the Olas
        Protocol. Currently, fees are turned off to encourage early adoption and
        growth of the marketplace.
        <ExternalLink className="mt-2 cursor-pointer">
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
  primaryValue,
  primaryText,
  primaryLink,
  secondaryValue,
  secondaryText,
  secondaryLink,
}) => (
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
  </Card>
);

const Activity = () => {
  const { data: metrics } = usePersistentSWR('tokenMetrics', fetchMetrics);

  const processedMetrics = useMemo(() => {
    if (!metrics) return null;

    return {
      transactions: metrics.transactions?.toLocaleString() || '--',
      agents: metrics.agents?.toLocaleString() || '--',
      dailyActiveAgents: metrics.dailyActiveAgents?.toLocaleString() || '--',
      a2aTransactions: metrics.a2aTransactions?.toLocaleString() || '--',
      feesCollected: metrics.feeMetrics?.totalFees?.toFixed(2) || '--',
      olasBurned: metrics.feeMetrics?.olasBurned?.toFixed(2) || '--',
    };
  }, [metrics]);

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading
        size="max-sm:text-5xl"
        color="text-gray-900"
        weight="font-bold"
        other="mb-12 max-w-3xl text-center mx-auto"
      >
        OLAS: Powers AI Agent Economies
      </SectionHeading>
      <p className="text-lg text-slate-600 mb-20">
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
            className="mt-12 ml-3 w-[124px] h-[176px]"
          />
          <ActivityCard
            icon="users.png"
            text="Users"
            primaryValue={processedMetrics?.agents}
            primaryText="agents deployed"
            primaryLink={DUNE_AGENTS_QUERY_URL}
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
            <ActivityCard
              icon="olas-burnt.png"
              primaryValue={`$${Number(processedMetrics?.olasBurned || 0).toLocaleString()}`}
              primaryText="OLAS burned"
              primaryLink={DUNE_MMV2_URL}
            />
            <OlasIsBurnedArrow />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row w-[132px] flex-wrap mb-2">
              {agentsHere.map((item) => (
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
            <ActivityCard
              icon="daas.png"
              iconWidth={252}
              iconHeight={56}
              primaryValue={processedMetrics?.dailyActiveAgents}
              primaryText={
                <>
                  DAAs <Popover>7-day average Daily Active Agents</Popover>
                </>
              }
              primaryLink={FLIPSIDE_DAAS_QUERY_URL}
            />
            <div className="flex flex-row">
              <Image
                src={`${imgPath}arrow2.png`}
                alt="arrow2"
                width={28}
                height={124}
                className="h-[124px] ml-auto"
              />
              <p className="w-[76px] text-sm mr-[76px] ml-2 my-auto">
                Agents are active
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row place-items-center">
          <ActivityCard
            icon="agent-to-agent.png"
            iconWidth={104}
            iconHeight={36}
            primaryValue={processedMetrics?.a2aTransactions}
            primaryText="A2A txns"
            primaryLink={DUNE_A2A_TRANSACTIONS_QUERY_URL}
            secondaryValue={`$${Number(processedMetrics?.feesCollected || 0).toLocaleString()}`}
            secondaryText="fees collected"
            secondaryLink={DUNE_MMV2_URL}
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
          <ActivityCard
            icon="txns.png"
            primaryValue={processedMetrics?.transactions}
            primaryText="txns"
            primaryLink={FLIPSIDE_URL}
          />
        </div>
      </div>

      <div className="flex flex-col md:hidden w-[90%] mx-auto">
        <ActivityCard
          icon="users.png"
          text="Users"
          primaryValue={processedMetrics?.agents}
          primaryText="agents deployed"
          primaryLink={DUNE_AGENTS_QUERY_URL}
        />
        <Image
          src={`${imgPath}mobile-arrow.png`}
          alt="arrow"
          width={240}
          height={120}
          className="mx-auto mb-2"
        />
        <ActivityCard
          icon="daas.png"
          iconWidth={252}
          iconHeight={56}
          primaryValue={processedMetrics?.dailyActiveAgents}
          primaryText={
            <>
              DAAs <Popover>7-day average Daily Active Agents</Popover>
            </>
          }
          primaryLink={FLIPSIDE_DAAS_QUERY_URL}
        />
        <Image
          src={`${imgPath}mobile-arrow2.png`}
          alt="arrow"
          width={132}
          height={120}
          className="mx-auto mb-2"
        />
        <ActivityCard
          icon="txns.png"
          primaryValue={processedMetrics?.transactions}
          primaryText="txns"
          primaryLink={FLIPSIDE_URL}
        />
        <Image
          src={`${imgPath}mobile-arrow3.png`}
          alt="arrow"
          width={180}
          height={120}
          className="mx-auto mb-2"
        />
        <ActivityCard
          icon="agent-to-agent.png"
          iconWidth={104}
          iconHeight={36}
          primaryValue={processedMetrics?.a2aTransactions}
          primaryText="A2A txns"
          primaryLink={DUNE_A2A_TRANSACTIONS_QUERY_URL}
          secondaryValue={`$${Number(processedMetrics?.feesCollected || 0).toLocaleString()}`}
          secondaryText="fees collected"
          secondaryLink={DUNE_MMV2_URL}
        />
        <OlasIsBurnedArrow pointsDown className="mx-auto mb-2" />
        <ActivityCard
          icon="olas-burnt.png"
          primaryValue={`$${Number(processedMetrics?.olasBurned || 0).toLocaleString()}`}
          primaryText="OLAS burned"
          primaryLink={DUNE_MMV2_URL}
        />
        <Image
          src={`${imgPath}mobile-arrow5.png`}
          alt="arrow"
          width={287}
          height={202}
          className="ml-[30px]"
        />
      </div>
    </div>
  );
};

const TokenAddress = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('Etherium');
  const [currentAddress, setCurrentAddress] = useState(
    '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0',
  );

  const getTokenAddress = async () => {
    try {
      await navigator.clipboard.writeText(currentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy to clipboard: ', error);
    }
  };

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="place-items-center mt-20">
      <Image
        src="/images/homepage/olas-token.png"
        alt="OLAS token"
        width={487}
        height={444}
      />
      <Card className="absolute card-opaque w-[90%] md:w-[648px] left-1/2 transform -translate-x-1/2 -translate-y-[200px] pt-4 p-6 bg-white flex flex-col">
        <div className="flex md:hidden text-left w-full mb-4 relative">
          <button
            type="button"
            className="w-full flex items-center justify-between bg-white rounded-lg p-2"
            onClick={() => setOpenDropdown(!openDropdown)}
            aria-expanded={openDropdown}
            aria-haspopup="true"
          >
            <div className="flex items-center gap-2">
              {(() => {
                const activeItem = addresses.find(
                  (item) => item.name === activeTab,
                );
                return (
                  activeItem && (
                    <Image
                      src={`/images/homepage/addresses/${activeItem.activeSrc}`}
                      alt={activeItem.name}
                      width={20}
                      height={20}
                    />
                  )
                );
              })()}
              <span>{activeTab}</span>
            </div>
            <ChevronDown size={24} />
          </button>

          {openDropdown && (
            <div
              className="absolute w-full z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-1">
                {addresses.map((address, index) => (
                  <button
                    key={index}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex flex-row gap-2"
                    role="menuitem"
                    onClick={() => {
                      setOpenDropdown(false);
                      setActiveTab(address.name);
                      setCurrentAddress(address.address);
                    }}
                  >
                    <Image
                      src={`/images/homepage/addresses/${address.src}`}
                      alt={address.name}
                      width={20}
                      height={20}
                    />
                    {address.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-row mb-6">
          {addresses.map((address) => {
            const activeClass =
              activeTab === address.name
                ? 'border-purple-700 selected-button'
                : 'border-transparent';
            const imageSrc =
              activeTab === address.name ? address.activeSrc : address.src;
            return (
              <button
                key={address.name}
                onClick={() => {
                  setActiveTab(address.name);
                  setCurrentAddress(address.address);
                }}
                className={`opaque-button max-sm:text-sm font-medium transition-colors w-full w-[66px] h-[44px] border-b-4 hover:border-slate-500 ${activeClass}`}
              >
                <Image
                  src={`/images/homepage/addresses/${imageSrc}`}
                  alt={addresses.name}
                  width={20}
                  height={20}
                  className="mx-auto aspect-square min-w-[20px]"
                />
              </button>
            );
          })}
        </div>
        <div className="text-left flex flex-col gap-4">
          <p className="text-slate-600 text-medium">
            Token address on {activeTab}
          </p>
          <div className="text-lg flex flex-row gap-3 place-items-center">
            <Image
              src="/images/olas-token-logo.png"
              alt="olas-token"
              width={28}
              height={32}
            />
            <p className="break-all">{currentAddress}</p>
            <button
              onClick={getTokenAddress}
              className="p-1 place-items-center w-8 h-8 border rounded-md border-slate-300"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </Card>
      {copied && (
        <Card className="fixed bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 z-50 bg-white shadow-lg">
          Copied to clipboard
        </Card>
      )}
      <div className="flex flex-row gap-4 mt-14">
        <Button variant="default" size="lg" asChild>
          <Link href="/olas-token#token-details">Get OLAS</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/olas-token">Tokenomics</Link>
        </Button>
      </div>
    </div>
  );
};

export const PowersAIAgentEconomies = () => (
  <div className="relative">
    <div className="activity-bg h-full" />
    <SectionWrapper
      id="olas-token"
      backgroundType="NONE"
      customClasses="bg-slate-100 text-center py-20"
    >
      <Activity />
      <TokenAddress />
    </SectionWrapper>
  </div>
);
