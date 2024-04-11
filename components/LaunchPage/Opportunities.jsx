import PropTypes from 'prop-types';
import Image from 'next/image';
import opportunities from 'data/opportunities.json';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { H1 } from 'components/ui/typography';
import { Button } from 'components/ui/button';

const CONTACT_URL = 'https://t.me/pahlmeyer';

const OpportunityCard = ({ item }) => (
  <div className="grid gap-8 md:grid-cols-3 rounded-xl border border-gray-300 shadow-sm p-6 mb-8">
    <div className="col-span-2 text-start">
      <h2 className="font-bold text-xl mb-2">{item.agentName}</h2>
      <pre className="text-l text-gray-600 mb-6 whitespace-pre-line font-sans">
        {item.agentDescription}
      </pre>
    </div>
    <div className="gap-2 mb-4">
      <div className="flex mb-4 gap-4">
        <Image
          alt={item.project}
          src={item.image}
          width="100"
          height="100"
          style={{ objectFit: 'contain' }}
        />
        <div>
          <div className="mb-1 text-sm text-gray-700 font-medium tracking-wider">
            PROJECT
          </div>
          <div className="text-sm font-bold">{item.project}</div>
        </div>
      </div>
      <div className="text-sm mb-4">{item.background}</div>
      <Button size="default" variant="default" asChild isExternal>
        <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
          Contact Origin
        </a>
      </Button>
    </div>
  </div>
);

OpportunityCard.propTypes = {
  item: PropTypes.shape({
    project: PropTypes.string.isRequired,
    agentName: PropTypes.string.isRequired,
    agentDescription: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

const Opportunities = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="rewards">
    <div className="max-w-[1024px] mx-auto mb-12">
      <H1 className="mb-12 text-center">Opportunities</H1>
      {opportunities.map((item) => (
        <OpportunityCard key={item.agentName} item={item} />
      ))}
    </div>
  </SectionWrapper>
);

export default Opportunities;
