import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import quotes from 'data/trustedBy.json';
import { TrustedByItem } from './TrustedByItem';

export const TrustedBy = () => (
  <SectionWrapper
    id="social-proof"
    customClasses="lg:p-24 px-4 py-20 mt-20"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6 lg:mb-14`}>
      Trusted by Leading Web3 Teams and Users
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {quotes.map((quote, index) => (
        <TrustedByItem key={index} quote={quote} />
      ))}
    </div>
  </SectionWrapper>
);
