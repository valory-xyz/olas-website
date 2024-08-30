import React from 'react';
import SectionWrapper from 'components/Layout/SectionWrapper';
import UseCases from './UseCases';
import { Dashboards } from './Dashboards';
import PageWrapper from '../Layout/PageWrapper';
import Meta from '../Meta';

const ExplorePage = () => (
  <PageWrapper>
    <Meta pageTitle="Explore" />
    <SectionWrapper customClasses="px-8 mt-12 mb-20 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tighter text-center sm:text-5xl md:text-6xl mb-6">
        Explore
      </h1>
    </SectionWrapper>

    <div className="flex flex-col gap-20 mb-20">
      <UseCases />
      <Dashboards />
    </div>
  </PageWrapper>
);

export default ExplorePage;
