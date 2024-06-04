import React from 'react';
import { DOCS_BASE_URL } from 'common-util/constants';
import PageWrapper from 'components/Layout/PageWrapper';
import { P_MEDIUM_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';

const StackPage = () => (
  <PageWrapper>
    <SectionWrapper customClasses="px-4 py-12 border-b">
      <div className="max-w-[800px] mx-auto flex flex-col gap-5">
        <h2 className={`${SUB_HEADER_CLASS} text-left mb-8`}>Olas Stack</h2>

        <p className={`${P_MEDIUM_CLASS} mb-4`}>
          <Link
            href={`${DOCS_BASE_URL}/open-autonomy`}
            className="text-purple-600"
          >
            Go to Documentation
          </Link>
        </p>
      </div>
    </SectionWrapper>
  </PageWrapper>
);

export default StackPage;
