import { Accordion } from 'common-util/Accordion';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';
import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from './utils';

const faqList = [
  {
    name: 'Olas Operate',
    list: [
      {
        title: 'What is the Olas Operate app?',
        desc: ' The Olas Operate app allows you to set up and run decentralized agents directly from your computer, earning OLAS tokens by simply keeping your machine on.',
      },
      {
        title: 'How do I install the Olas Operate app?',
        desc: (
          <>
            Visit the
            {' '}
            <Link
              href="https://operate.olas.network/"
              className="text-purple-600"
            >
              Olas Operate download page
            </Link>
            {', '}
            download the app, and follow the installation guide provided.
          </>
        ),
      },
      {
        title: 'What are the system requirements for the Olas Operate app?',
        desc: (
          <>
            Minimal system requirements for Mac devices:
            <ul className="list-disc ml-6">
              <li>800 MB of free RAM (suggested 1 GB)</li>
              <li>1.3 GB disk space</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Is my data safe when using Olas Operate?',
        desc: 'The app is built with robust security measures to protect your data and earnings.',
      },
    ],
  },
  {
    name: 'General',
    list: [
      {
        title: 'Can I run an agent without using the app?',
        desc: (
          <>
            Yes, for more technical control and flexibility, you can set up and
            run agents manually. Visit
            {' '}
            <Link
              href="https://operate.olas.network/"
              className="text-purple-600"
            >
              operate.olas.network
            </Link>
            {' '}
            to get started.
          </>
        ),
      },
      {
        title: 'How do I earn OLAS tokens?',
        desc: 'Earn OLAS by staking OLAS and running agents on your computer.',
      },
      {
        title: 'Where can I get support if I encounter issues?',
        desc: (
          <>
            There is no official support, but the
            {' '}
            <Link
              target="_blank"
              href="https://discord.com/channels/899649805582737479/1169275451089367131"
              className="text-purple-600"
            >
              Olas community
            </Link>
            {' '}
            can help you if you run into any issues.
          </>
        ),
      },
      {
        title: 'Can I run multiple agents at the same time?',
        desc: 'Yes, you can run multiple agents simultaneously to increase your earning potential.',
      },
    ],
  },
];

export const FAQ = () => (
  <SectionWrapper
    customClasses={`border bg-no-repeat ${SECTION_BOX_CLASS}`}
    backgroundType="CONTAIN"
    backgroundImage="/images/homepage/hero.png"
  >
    <div className="max-w-screen-lg px-0 py-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 lg:px-12">
      <div className="grid gap-12">
        <h2 className={`${SUB_HEADER_CLASS}`}>
          <div className="text-left lg:text-center">
            Commonly asked questions
          </div>
        </h2>
      </div>

      {faqList.map((faq) => (
        <div key={faq.name}>
          <div className="text-2xl font-bold mt-2 mb-4 text-slate-900">
            {faq.name}
          </div>

          {faq.list.map((eachFaq, index) => (
            <div className="py-2" key={index}>
              <Accordion label={eachFaq.title}>{eachFaq.desc}</Accordion>
            </div>
          ))}
        </div>
      ))}
    </div>
  </SectionWrapper>
);
