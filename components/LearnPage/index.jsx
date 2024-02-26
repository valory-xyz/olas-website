import React from 'react';
import Link from 'next/link';
import WhatIsOlas from './2WhatIsOlas';
import DecentralizedAndSophisticated from './3DecentralizedAndSophisticated';
import HowDoOlasWork from './4HowDoOlasWork';
import QuickIntroArticles from './5QuickIntroArticles';
import WhyBuildOnOlas from './6WhyBuildOnOlas';
import WhatCouldYouBuild from './8WhatCouldYouBuild';
// import Mission from './9Mission';
import PageWrapper from '../Layout/PageWrapper';
import Meta from '../Meta';
import Head from 'next/head';

export const LEARN_LIST = [
  { name: 'What is Olas?', id: 'what-is-olas' },
  { name: 'What are autonomous services?', id: 'what-are-autonomous-services' },
  {
    name: 'How do autonomous services work?',
    id: 'how-do-autonomous-services-work',
  },
  { name: 'Quick intro articles', id: 'quick-intro-articles' },
  { name: 'Why build on Olas?', id: 'why-build-on-olas' },
  { name: 'What could you build?', id: 'what-could-you-build' },
  { name: 'What’s our mission?', id: 'mission' },
];

const LearnPage = () => <>
  <Head>
      <title key={"title"}>Learn | Olas</title>
      <meta name="title" content="Learn | Olas" key={"meta-title"}/>
      <meta
        key={"meta-description"}
        name="description"
        content="Build your understanding of what Olas is and how it works."/>
      <meta property="og:type" content="website" key={"og-type"}/>
      <meta property="og:url" content="https://olas.network/learn" key={"og-url"}/>
      <meta property="og:title" content="Learn | Olas" key={"og-title"}/>
      <meta
        key={"og-description"}
        property="og:description"
        content="Build your understanding of what Olas is and how it works."/>
      <meta property="og:image" content="https://olas.network/images/meta-tag.png" key={"og-image"} />
      <meta property="twitter:card" content="summary_large_image" key={"twitter-card"} />
      <meta property="twitter:url" content="https://olas.network/learn" key={"twitter-url"}/>
      <meta property="twitter:title" content="Learn | Olas" key={"twitter-title"} />
      <meta
        key={"twitter-description"}
        property="twitter:description"
        content="Build your understanding of what Olas is and how it works."/>
  </Head>
  <PageWrapper>
    <Meta title='Learn' description='Build your understanding of what Olas is and how it works.' />
    <section className="bg-white mb-10 container px-4 mt-4">
      <h2 className="text-4xl font-bold tracking-tighter text-center sm:text-5xl md:text-6xl mb-6">Learn</h2>
      <h4 className="text-2xl font-semibold text-center mb-8">Jump To:</h4>
      <div className="bg-gray-100 rounded-lg p-6 mx-auto">
        <ul>
          {LEARN_LIST.map(e => (
            <li key={e.id} className="mb-4">
              <Link href={`/learn/#${e.id}`} className="text-2xl text-purple-600 hover:text-purple-800 visited:text-purple-600">
                  {e.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <div className="container mx-auto px-4">
      <WhatIsOlas />
      <DecentralizedAndSophisticated />
      <HowDoOlasWork />
      {/* <QuickIntroArticles /> */}
      <WhyBuildOnOlas />
      <WhatCouldYouBuild />
      {/* <Mission /> */}
    </div>
  </PageWrapper>
  </>;

export default LearnPage;
