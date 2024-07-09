import { SCREEN_WIDTH_LG } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { H1 } from '../ui/typography';

const pClass = 'text-xl';
const ulClass = 'ml-6 list-disc text-xl flex flex-col gap-3';

const InfoIcon = () => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="info-circle"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
    <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
  </svg>
);

const TokenomicsAlert = () => (
  <div
    className="bg-blue-100 rounded-md border-1.5 border-[#91CAFF] text-[#002C8C] p-2 flex"
    role="alert"
  >
    <div className="py-1 mr-2">
      <InfoIcon />
    </div>
    <div>
      <p>
        You can check available dev rewards for existing/minted agents and
        components on
        {' '}
        <a
          href="https://tokenomics.olas.network/dev-incentives"
          className="text-purple-600"
        >
          Tokenomics ↗
        </a>
        .
      </p>
    </div>
  </div>
);
const Content = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="rewards">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <H1 className="mb-12">How do Build Rewards work?</H1>

      <p className={pClass}>
        OLAS Build Rewards is a part of the protocol that facilitates the
        distribution of capital to developers who contribute to various services
        in the ecosystem. This system is designed to reward both the
        contribution of code components and the provision of agents to the
        services.
      </p>

      <TokenomicsAlert />

      <strong className={pClass}>
        Here&apos;s how the distribution works:
      </strong>
      <ul className={ulClass}>
        <li>
          Anyone has the ability to donate ETH to services via the protocol.
        </li>
        <li>
          The donated ETH is then distributed among developers who have
          contributed to that particular service. Specifically, donations to the
          protocol are distributed to agent or component developers within
          services, however, no portion of the donations goes to the service
          owners.
        </li>
        <li>
          A portion of the ETH can go to the protocol itself, although
          currently, this is set to zero. So no portion of donations goes to the
          protocol at the moment.
        </li>
      </ul>
      <p className={pClass}>
        Additionally, whether a donor of a service or service owner holds at
        least 10k veOLAS, the protocol also provides top-ups in the form of OLAS
        tokens to component and agent developers within donated services.
      </p>

      <p className={pClass}>
        Developers receive different splits of ETH and OLAS top-ups
        proportionally to the usefulness of their code within services in the
        ecosystem.
      </p>
      <strong className={pClass}>
        An illustrative example explains the reward mechanism further:
      </strong>
      <p className={pClass}>
        There are two services registered and deployed in the Olas registries
        deployed on Ethereum.
      </p>
      <ul className={ulClass}>
        <li>
          Service #1 consists of an agent owned by the developer D1 and a
          component owned by developer D2.
        </li>
        <li>
          Service #2 consists of an agent owned by the developer D3 and two
          components owned by developer D4 and D5 respectively.
        </li>
      </ul>
      <p className={pClass}>
        Assume that a donor, holding more than 10k veOLAS, donates 1 ETH to each
        service. Additionally, assume that the ratio for ETH donation reserved
        to components is 83% while 17% for agents, and similarly, assume that
        the ratio for top-ups donation reserved to components is 82% while 18%
        for agents.
        <a href="#footnote-1">
          <sup>1</sup>
        </a>
      </p>

      <p className={pClass}>
        Then the distribution of ETH rewards is as follows:
      </p>
      <ul className={ulClass}>
        <li>
          Service #1: The agent&apos;s developer D1 earns 0.17 ETH and the
          component&apos;s developer D2 receives 0.83 ETH.
        </li>
        <li>
          Service #2: The agent&apos;s developer D3 earns 0.17 ETH and component
          developers D4 and D5 receive 0.415 ETH each.
        </li>
      </ul>
      <p className={pClass}>
        For OLAS top-ups, assuming there is 10k OLAS available for this epoch,
        the OLAS top-up distribution is as follows:
      </p>
      <ul className={ulClass}>
        <li>
          Service #1: The agent&apos;s developer D1 receives 900 OLAS and the
          component&apos;s developer D2 receives 4100 OLAS.
        </li>
        <li>
          Service #2: The agent&apos;s developer D3 receives 900 OLAS, while the
          component developers D4 and D5 receive 2050 OLAS each.
        </li>
      </ul>
      <p className={pClass}>
        If service #1 had received a more substantial ETH donation, or if
        developer D1 had possessed ownership of one or both components of the
        alternative service, developers D1 and D2 would have received a higher
        allocation of OLAS and ETH. This illustrates how the incentive mechanism
        effectively aligned incentives with the usefulness of code contributions
        within the services in the ecosystem.
      </p>
      <p className={pClass}>
        The OLAS Build Rewards system is designed to be a dynamic and fair way
        to incentivise and reward the community of developers who contribute to
        the growth and maintenance of services within the OLAS ecosystem.
      </p>
      <em id="footnote-1">
        <sup>1</sup>
        {' '}
        Note that these ratios are protocol parameters that can be
        configured by the Olas DAO via a governance vote.
      </em>
    </div>
  </SectionWrapper>
);

export default Content;
