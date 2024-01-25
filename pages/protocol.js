import React from 'react';
import { DOCS_BASE_URL } from 'common-util/constants';
import PageWrapper from '@/components/Layout/PageWrapper';
import { TITLE } from '@/styles/globals';

const ProtocolPage = () => {
  return (
    <PageWrapper>
      <h1 className={TITLE.BIG}>Olas Protocol</h1>
      <a href={`${DOCS_BASE_URL}/protocol`}>Go to Documentation</a>
    </PageWrapper>
  );
};

export default ProtocolPage;
