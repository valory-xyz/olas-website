import PropTypes from 'prop-types';
import Image from 'next/image';
import opportunities from 'data/opportunities.json';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { H1 } from 'components/ui/typography';
import { Button } from 'components/ui/button';
import { LAUNCH_CONTACT_URL } from 'common-util/constants';

const OpportunityCard = ({
  agentName, agentDescription, project, image, background,
}) => (
  <div className="grid gap-8 md:grid-cols-3 rounded-xl border border-gray-300 shadow-sm p-6 mb-8">
    <div className="col-span-2 text-start">
      <h2 className="font-bold text-xl mb-2">{agentName}</h2>
      <p className="text-gray-600 mb-6 whitespace-pre-line">
        {agentDescription}
      </p>
    </div>
    <div className="gap-2 mb-4">
      <div className="flex mb-4 gap-4">
        <Image
          alt={project}
          src={image}
          width="100"
          height="100"
          style={{ objectFit: 'contain' }}
        />
        <div>
          <span className="block mb-1 text-sm text-gray-700 font-medium tracking-wider">
            PROJECT
          </span>
          <span className="block text-sm font-bold">{project}</span>
        </div>
      </div>
      <p className="text-sm mb-4">{background}</p>
      <Button size="default" variant="default" asChild isExternal>
        <a href={LAUNCH_CONTACT_URL} target="_blank" rel="noopener noreferrer">
          Get in touch
        </a>
      </Button>
    </div>
  </div>
);

OpportunityCard.propTypes = {
  project: PropTypes.string.isRequired,
  agentName: PropTypes.string.isRequired,
  agentDescription: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export const Opportunities = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12" id="opportunities">
    <div className="max-w-[1024px] mx-auto mb-12">
      <H1 className="mb-8 text-center">Opportunities</H1>
      <p className="text-xl text-gray-600 text-center mb-12">
        Projects are interested in bringing Olas agents to their ecosystem.
        This is a list of &quot;requests for agents&quot;
      </p>
      {opportunities.map((item) => (
        <OpportunityCard key={item.agentName} {...item} />
      ))}
    </div>
  </SectionWrapper>
);
