import { SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import { DEV_REWARDS_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { InfoIcon } from 'components/ui/info-icon';
import { ExternalLink, Link } from '../ui/typography';

const ulClass = 'ml-6 flex flex-col gap-3';

const TokenomicsAlert = () => (
  <div
    className="bg-sky-50 rounded-md border-1.5 border-sky-300 text-[#003EB3] text-md p-2 flex"
    role="alert"
  >
    <div className="mr-2 mb-auto mt-1">
      <InfoIcon />
    </div>
    <div>
      <p>
        You can check available dev rewards for existing/minted agents and
        components on{' '}
        <ExternalLink href={DEV_REWARDS_URL}>Tokenomics</ExternalLink>.
      </p>
    </div>
  </div>
);
const Content = () => (
  <SectionWrapper customClasses="max-w-screen-md m-8 mt-0" id="rewards">
    <div className={`flex flex-col gap-3 text-md w-full my-8`}>
      <h3 className={SUB_HEADER_MEDIUM_CLASS}>
        How do Olas Build Rewards work?
      </h3>

      <p>
        OLAS Build Rewards is a part of the protocol that facilitates the
        distribution of capital to developers who contribute to various agent
        services in the ecosystem. This system is designed to reward both the
        contribution of code components and the provision of agents to the
        services.
      </p>

      <TokenomicsAlert />

      <p>
        To understand the amount of developer rewards on offer, you can refer to
        the Emissions to builders section of{' '}
        <Link href="/olas-token">this dashboard</Link>.
      </p>

      <p>
        In order to qualify for developer rewards an Olas builder must mint a
        component or agent on the{' '}
        <ExternalLink
          href="https://registry.olas.network/ethereum/components"
          hideArrow
        >
          Olas Registry
        </ExternalLink>{' '}
        and have that component or agent be referenced in a service that
        receives donations. Note that services are made up of agents, and agents
        are made up of components. You can learn more about the{' '}
        <Link href="/stack">Olas stack here</Link>.
      </p>

      <p>
        When one mints an item on the registry, they&apos;re issued an NFT. The
        Build Rewards are paid out under the following conditions:
      </p>
      <ul className={`${ulClass} list-decimal`}>
        <li>Must own NFT.</li>
        <li>NFT is part of a service that receives donations.</li>
      </ul>

      <p>
        The builder reward program emissions go to components and agents
        referenced in the services that receive donations. In order to receive
        OLAS emissions, a service must have ETH donated to it by a wallet
        address that is holding at least 10,000 veOLAS. In order to get veOLAS
        one needs to lock OLAS through <Link href="/govern">Olas Govern</Link>.
        The minimum donation is 0.065 ETH and should an address that is holding
        10,000 veOLAS donate to a service, that service will receive OLAS
        rewards. ***
      </p>

      <div className="border-l-2 pl-5 flex flex-col gap-3">
        <p>
          *** An illustrative example explains the reward mechanism further:
        </p>
        <p>
          There are two services registered and deployed in the Olas registries
          deployed on Ethereum.
        </p>
        <p>
          Service #1 consists of an agent owned by the developer D1 and a
          component owned by developer D2.
        </p>
        <p>
          Service #2 consists of an agent owned by the developer D3 and two
          components owned by developer D4 and D5 respectively.
        </p>
        <p>
          Assume that a donor, holding more than 10k veOLAS, donates 1 ETH to
          each service. Additionally, assume that the ratio for ETH donation
          reserved to components is 83% while 17% for agents, and similarly,
          assume that the ratio for top-ups donation reserved to components is
          82% while 18% for agents. ¹
        </p>
        <p>Then the distribution of ETH rewards is as follows:</p>
        <ul className={`${ulClass} list-disc`}>
          <li>
            Service #1: The agent&apos;s developer D1 earns 0.17 ETH and the
            component&apos;s developer
          </li>
          <li>
            D2 receives 0.83 ETH. Service #2: The agent&apos;s developer D3
            earns 0.17 ETH and component developers D4 and D5 receive 0.415 ETH
            each.
          </li>
        </ul>
        <p>
          For OLAS top-ups, assuming there is 10k OLAS available for this epoch,
          the OLAS top-up distribution is as follows:
        </p>
        <ul className={`${ulClass} list-disc`}>
          <li>
            Service #1: The agent&apos;s developer D1 receives 900 OLAS and the
            component&apos;s developer D2 receives 4100 OLAS.
          </li>
          <li>
            Service #2: The agent&apos;s developer D3 receives 900 OLAS, while
            the component developers D4 and D5 receive 2050 OLAS each.
          </li>
        </ul>
        <p>
          If service #1 had received a more substantial ETH donation, or if
          developer D1 had possessed ownership of one or both components of the
          alternative service, developers D1 and D2 would have received a higher
          allocation of OLAS and ETH.
        </p>
        <p>
          ¹ - Note that these ratios are protocol parameters that can be
          configured by the Olas DAO via a governance vote.
        </p>
      </div>
      <p>
        The OLAS Build Rewards system is designed to be a dynamic and fair way
        to incentivise and reward the community of developers who contribute to
        the growth and maintenance of services within the OLAS ecosystem.
      </p>
    </div>
  </SectionWrapper>
);

export default Content;
