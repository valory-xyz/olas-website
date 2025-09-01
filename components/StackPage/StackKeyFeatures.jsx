import { SCREEN_WIDTH_LG } from 'common-util/classes';
import { DOCS_BASE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Link, SubsiteLink } from 'components/ui/typography';

const list = [
  {
    title: 'Mech Marketplace',
    description: (
      <>
        <Link href="/mech-marketplace">Mech Marketplace</Link>: the AI Agent
        Bazaar for businesses to monetize or hire agents on Olas
      </>
    ),
  },
  {
    title: 'Pearl',
    description: (
      <>
        <Link href="/pearl">Pearl</Link>: the AI Agent App Store for consumers
        to own AI agents
      </>
    ),
  },
  {
    title: 'Agent Frameworks',
    description: (
      <>
        <Link href="/agents">Agent Frameworks</Link>: the open-source tools for
        developers to build and deploy AI agents on Olas
      </>
    ),
  },
  {
    title: 'Olas Protocol',
    description: (
      <>
        <Link href="/olas-token#protocol">Olas Protocol</Link>: the on-chain
        protocol that defines the core platform features and coordinates agent
        economies
      </>
    ),
  },
];

export const StackKeyFeatures = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="key-features">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <p>
        The Olas Stack is the technical foundation of Olas. It consists of four
        core innovations:
      </p>

      <ul className="list-disc ml-6">
        {list.map((item) => (
          <li key={item.title} className="mb-2">
            {item.description}
          </li>
        ))}
      </ul>

      <p>
        To learn more about each part of the stack, visit their relevant pages
        or the{' '}
        <SubsiteLink href={DOCS_BASE_URL}>technical documentation.</SubsiteLink>
      </p>
    </div>
  </SectionWrapper>
);
