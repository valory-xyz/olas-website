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
        <li>Individuals holding over 10k veOLAS (a locked variant of the OLAS token) have the ability to donate ETH to services via the protocol.</li>
        <li>The donated ETH is then distributed among developers who have contributed to that particular service. Part of it goes to those who have provided code components, and part goes to those who have supplied agents.</li>
        <li>A small portion of the ETH is set to go to the protocol itself, although currently, this is set to zero, meaning none goes to the protocol at the moment.</li>
        <li>No portion of the ETH goes directly to the service owner.</li>
      </ul>
      <p className={pClass}>In addition to ETH, the protocol also provides top-ups in the form of OLAS tokens. These are allocated proportionally to the amount of ETH that each contributor has directed towards other services.</p>
      <p className={pClass}>Developers receive different splits of ETH and OLAS top-ups, which can vary, but an example ratio provided is 30% to 70%. This ratio is a protocol parameter that can be configured by the Olas DAO.</p>
      <strong className={pClass}>An illustrative example explains the reward mechanism further:</strong>
      <ul className={ulClass}>
        <li>There are two services within the protocol.</li>
        <li>Service #1 consists of an agent and a component, each owned by different developers.</li>
        <li>Service #2 is similar but includes two components, each with their respective owners.</li>
        <li>A developer, owning more than 10k veOLAS, donates 1 ETH to each service.</li>
      </ul>
      <strong className={pClass}>Based on a 30/70 agent/component split, the breakdown of ETH earnings would be as follows:</strong>
      <ul className={ulClass}>
        <li>Service #1 earns no ETH directly. However, the agent's developer earns 0.3 ETH, and the component's developer receives 0.7 ETH.</li>
        <li>Service #2, likewise, earns no ETH directly. The agent's developer and the two component developers split the ETH, each earning portions according to the predetermined ratio.</li>
      </ul>
      <strong className={pClass}>For OLAS rewards, assuming there is 100k OLAS available for this epoch:</strong>
      <ul className={ulClass}>
        <li>Service #1 would have 50k OLAS allocated for contributors. The agent's developer would receive 15k OLAS (30% of 50k), and the component's developer would receive 35k OLAS (70% of 50k).</li>
        <li>Service #2 would also have 50k OLAS allocated for contributors. The agent's developer would receive 15k OLAS, while the two components' developers would receive 17.5k OLAS each, reflecting a 35% share of the 50k OLAS.</li>
      </ul>
      <p className={pClass}>If only one service had received ETH donations, the contributors to that service would have received a larger share of OLAS, demonstrating the incentive mechanism's fluidity and proportionality.</p>
      <p className={pClass}>The OLAS Build Rewards system is designed to be a dynamic and fair way to incentivise and reward the community of developers who contribute to the growth and maintenance of services within the OLAS ecosystem.</p>
    </div>
  </SectionWrapper>
);

export default Content;
