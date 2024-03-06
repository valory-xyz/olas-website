import React from 'react';
import { DOCS_BASE_URL } from 'common-util/constants';
import PageWrapper from '@/components/Layout/PageWrapper';
import { TITLE } from '@/styles/globals';

const StackPage = () => (
  <PageWrapper>
    <h1 className={TITLE.BIG}>Olas Stack</h1>
    <a href={`${DOCS_BASE_URL}/open-autonomy`}>Go to Documentation</a>
  </PageWrapper>
);

export default StackPage;
