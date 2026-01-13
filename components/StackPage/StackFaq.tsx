import { Accordion } from 'common-util/Accordion';
import { SCREEN_WIDTH_LG, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const faqList = [
  {
    list: [
      {
        title: 'What is Olas Stack?',
        desc: 'Olas Stack is a framework for building, deploying, and managing autonomous services and agents. It provides a modular architecture, decentralised governance, and comprehensive interoperability.',
      },
      {
        title: 'How can I get started with Olas Stack?',
        desc: 'Start by following the installation guide to set up your environment. Use the development tools and framework provided to create your services, and refer to the guides for deploying them.',
      },
      {
        title: 'What kind of applications can I build with Olas Stack?',
        desc: 'Olas Stack supports a wide range of applications, from sovereign agents to decentralized agents and even full agent economies. The modular architecture allows for extensive customization and scalability.',
      },
      {
        title: 'Is there support available for developers?',
        desc: 'Yes, Olas Stack offers extensive documentation, including guides, tutorials, and API references. Additionally, a community forum is available for peer support and knowledge sharing.',
      },
    ],
  },
];

export const StackFaq = () => (
  <SectionWrapper
    customClasses="bg-no-repeat py-8 px-6 lg:py-24 lg:px-0"
    id="faq"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className={`${SCREEN_WIDTH_LG}`}>
      <div className="grid gap-12">
        <h2 className={`${SUB_HEADER_CLASS} text-left mb-6 lg:mb-8`}>Frequently asked questions</h2>
      </div>

      {faqList.map((faq, faqIndex) => (
        <div key={faqIndex} className={faqIndex === faqList.length - 1 ? '' : 'mb-8'}>
          {'name' in faq && faq.name && (
            <div className="text-2xl font-semibold mt-2 mb-4">{String(faq.name)}</div>
          )}

          {faq.list.map((eachFaq, index) => (
            <div className="py-2" key={index}>
              <Accordion label={eachFaq.title} defaultOpen={false}>
                {eachFaq.desc}
              </Accordion>
            </div>
          ))}
        </div>
      ))}
    </div>
  </SectionWrapper>
);
