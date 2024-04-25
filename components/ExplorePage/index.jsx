import React from 'react';
import Link from 'next/link';
import SectionWrapper from 'components/Layout/SectionWrapper';
import UseCases from './UseCases';
import Chains from './Chains';
import Dashboards from './Dashboards';
import PageWrapper from '../Layout/PageWrapper';
import Meta from '../Meta';

export const EXPLORE_LIST = [
  { name: 'Use cases', id: 'use-cases' },
  { name: 'Chains', id: 'chains' },
  { name: 'Dashboards', id: 'dashboards' },
];

const ExplorePage = () => (
  <PageWrapper>
    <Meta pageTitle="Explore" />
    <SectionWrapper customClasses="px-8 mt-12 mb-20 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tighter text-center sm:text-5xl md:text-6xl mb-6">Explore</h1>
      <span className="block text-2xl text-center mb-8">Jump To:</span>
      <div className="bg-gray-100 rounded-lg p-6 mx-auto">
        <ul>
          {EXPLORE_LIST.map((item) => (
            <li key={item.id} className="mb-4">
              <Link href={`/explore/#${item.id}`} className="text-2xl text-purple-600 hover:text-purple-800 visited:text-purple-600">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>

    <div className="flex flex-col gap-20 mb-20">
      <UseCases />
      <Chains />
      <Dashboards />
    </div>
  </PageWrapper>
);

export default ExplorePage;
