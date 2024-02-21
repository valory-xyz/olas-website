import SectionWrapper from '@/components/Layout/SectionWrapper';
import { H1 } from '../ui/typography';

const pClass = 'text-xl';
const ulClass = 'ml-6 list-disc text-xl flex flex-col gap-3';

const Content = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
    <div className="max-w-screen-xl mx-auto flex flex-col gap-5">
      <H1 className="mb-12">
        How do Build Rewards work?
      </H1>
      <p className={pClass}>OLAS Build Rewards is a part of the protocol that facilitates the distribution of capital to developers who contribute to various services in the ecosystem. This system is designed to reward both the contribution of code components and the provision of agents to the services.</p>
      <strong className={pClass}>Here's how the distribution works:</strong>
      <ul className={ulClass}>
        <li>
          Anyone has the ability to donate ETH to services via the protocol.
        </li>
        <li>The donated ETH is then distributed among developers who have contributed to that particular service. Specifically, donations to the protocol are distributed to agent or component developers within services, however, no portion of the donations goes to the service owners.</li>
        <li>
          A portion of the ETH can go to the protocol itself, although currently, this is set to zero. So no portion of donations goes to the protocol at the moment.
        </li>
      </ul>
      <p className={pClass}>
        Additionally, whether a donor of a service or service owner holds at least 10k veOLAS, the protocol also provides top-ups in the form of OLAS tokens to component and agent developers within donated services.
      </p>

      <p className={pClass}>Developers receive different splits of ETH and OLAS top-ups proportionally to the usefulness of their code within services in the ecosystem.</p>
      <strong className={pClass}>
        An illustrative example explains the reward mechanism further:
      </strong>
      <p className={pClass}>
        There are two services registered and deployed in the Olas registries deployed on Ethereum.
      </p>
      <ul className={ulClass}>
        <li>
          Service #1 consists of an agent owned by the developer D1 and a component owned by developer D2.
        </li>
        <li>Service #2 consists of  an agent owned by the developer D3 and two components owned by developer D4 and D5 respectively.</li>
      </ul>
      <p className={pClass}>
        Assume that a donor, holding more than 10k veOLAS, donates 1 ETH to each service. Additionally, assume that the ratio for ETH donation reserved to components is 83% while 17% for agents, and similarly, assume that the ratio for top-ups donation reserved to components is 82% while 18% for agents.
        <a href="#footnote-1"><sup>1</sup></a>
      </p>

      <p className={pClass}>
        Then the distribution of ETH rewards is as follows:
      </p>
      <ul className={ulClass}>
        <li>Service #1: The agent's developer D1 earns 0.17 ETH and the component's developer D2 receives 0.83 ETH.</li>
        <li>Service #2: The agent's developer D3 earns 0.17 ETH and component developers D4 and D5 receive 0.415 ETH each.</li>
      </ul>
      <p className={pClass}>
        For OLAS top-ups, assuming there is 10k OLAS available for this epoch, the OLAS top-up distribution is as follows:
      </p>
      <ul className={ulClass}>
        <li>Service #1: The agent's developer D1 receives 900 OLAS and the component's developer D2 receives 4100 OLAS.</li>
        <li>Service #2: The agent's developer D3 receives 900k OLAS, while the component developers D4 and D5 receive 2050 OLAS each.</li>
      </ul>
      <p className={pClass}>
        If service #1 had received a more substantial ETH donation, or if developer D1 had possessed ownership of one or both components of the alternative service, developers D1 and D2 would have received a higher allocation of OLAS and ETH. This illustrates how the incentive mechanism effectively aligned incentives with the usefulness of code contributions within the services in the ecosystem.
      </p>
      <p className={pClass}>
        The OLAS Build Rewards system is designed to be a dynamic and fair way to incentivise and reward the community of developers who contribute to the growth and maintenance of services within the OLAS ecosystem.
      </p>
      <em id="footnote-1">
        <sup>1</sup>
        {' '}
        Note that these ratios are protocol parameters that can be configured by the Olas DAO via a governance vote.
      </em>

    </div>
  </SectionWrapper>
);

export default Content;
