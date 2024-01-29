import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

const ideaGroups = [
  // ... (ideaGroups content remains unchanged)
];

const WhatCouldYouBuild = () => (
  <section
    className="section section-what-could-you-build"
    id="what-could-you-build"
  >
    <div className="header">
      What could&nbsp;
      <br />
      <span className="sub-text">you</span>
      &nbsp;build?
    </div>

    {ideaGroups.map(ideaGroup => {
      const { id, ideas, title } = ideaGroup;

      return (
        <div key={id} className="mt-8">
          <h2 className="text-2xl font-bold group-title">{title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {ideas.map(idea => (
              <div key={idea.id} className="idea">
                <h3 className="text-xl font-semibold idea-title">
                  {idea.title}
                </h3>
                <p className="text-lg idea-text">{idea.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    })}

    <div className="oracle-sell mt-8">
      <h1 className="text-2xl font-bold">*Future-proof your stack with a customizable oracle</h1>
      <p className="text-lg oracle-sell-description">
        Autonolas Oracles are a unique way to advance the capabilities of your
        stack.
      </p>
      <br />
      <Link href="/oracles" passHref>
        <Button>Learn more</Button>
      </Link>
    </div>

    <div className="divider my-8" />
  </section>
);

export default WhatCouldYouBuild;
