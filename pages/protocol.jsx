import Link from 'next/link';

import { DOCS_BASE_URL } from 'common-util/constants';
import {
  P_MEDIUM_CLASS,
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';

const ProtocolPage = () => (
  <PageWrapper>
    <SectionWrapper customClasses="px-4 py-12 border-b">
      <div className={SCREEN_WIDTH_LG}>
        <h2 className={`${SUB_HEADER_CLASS} text-left mb-8`}>Olas Protocol</h2>

        <p className={`${P_MEDIUM_CLASS} mb-4`}>
          <Link href={`${DOCS_BASE_URL}/protocol`} className="text-purple-600">
            Go to Documentation
          </Link>
        </p>
      </div>
    </SectionWrapper>
  </PageWrapper>
);

export default ProtocolPage;
