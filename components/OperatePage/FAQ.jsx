import { Accordion } from 'common-util/Accordion';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';

const faqList = [
  {
    name: 'Olas Operate',
    list: [
      {
        title: 'What is the Olas Operate app?',
        desc: ' The Olas Operate app allows you to set up and run decentralized agents directly from your computer, earning OLAS tokens by simply keeping your machine on.',
      },
      {
        // TODO
        title: 'How do I install the Olas Operate app?',
        desc: (
          <>
            Visit the Olas Operate download page, download the app, and follow
            the installation guide provided.
          </>
        ),
      },
      {
        // TODO
        title: 'What are the system requirements for the Olas Operate app?',
        desc: (
          <>
            Minimal system requirements for Mac devices: 800 MB of free RAM
            (suggested 1 GB) 1.3 GB disk space
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
        // TODO
        title: 'Can I run an agent without using the app?',
        desc: 'Yes, for more technical control and flexibility, you can set up and run agents manually. Visit operate.olas.network to get started.',
      },
      {
        title: 'How do I earn OLAS tokens?',
        desc: 'Earn OLAS by staking OLAS and running agents on your computer.',
      },
      {
        // TODO
        title: 'Where can I get support if I encounter issues?',
        desc: 'There is no official support, but the Olas community can help you if you run into any issues.',
      },
      {
        title: 'Can I run multiple agents at the same time?',
        desc: 'Yes, you can run multiple agents simultaneously to increase your earning potential.',
      },
    ],
  },
];

export const FAQ = () => (
  <div>
    <SectionWrapper
      customClasses="py-24 border bg-no-repeat"
      backgroundType="CONTAIN"
      backgroundImage="/images/homepage/hero.png"
    >
      <div className="max-w-screen-lg lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12">
        <div className="grid gap-12">
          <SectionHeading size="mb-0">
            <div className="text-center">Commonly asked questions</div>
          </SectionHeading>
        </div>

        {faqList.map((faq) => (
          <div key={faq.name}>
            <div className="text-2xl font-bold mt-16 mb-4 text-slate-900">
              {faq.name}
            </div>

            {faq.list.map((item) => (
              <div className="py-2">
                <Accordion key={item.title} label={item.title}>
                  {item.desc}
                </Accordion>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionWrapper>
  </div>
);
