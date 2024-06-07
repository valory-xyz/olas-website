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
        desc: 'Start by following the installation guide to set up your environment. Use the development tools and SDK provided to create your services, and refer to the deployment guides for integrating them into a decentralised network.',
      },
      {
        title: 'What kind of applications can I build with Olas Stack?',
        desc: 'Olas Stack supports a wide range of applications, from simple autonomous agents to complex decentralised services. The modular architecture allows for extensive customization and scalability.',
      },
      {
        title: 'Is there support available for developers?',
        desc: 'Yes, Olas Stack offers extensive documentation, including guides, tutorials, and API references. Additionally, a community forum is available for peer support and knowledge sharing.',
      },
      {
        title: 'How does Olas Stack ensure security and transparency?',
        desc: 'Olas Stack incorporates decentralised governance mechanisms, ensuring that all operations are transparent and secure. The framework is designed to resist tampering and ensure the integrity of autonomous services.',
      },
    ],
  },
];

export const StackFaq = () => (
  <SectionWrapper
    customClasses="border bg-no-repeat py-8 px-6 lg:py-24 lg:px-0"
    id="stack-faq"
  >
    <div className={`${SCREEN_WIDTH_LG}`}>
      <div className="grid gap-12">
        <h2 className={`${SUB_HEADER_CLASS} text-left mb-6 lg:mb-8`}>
          Frequently asked questions
        </h2>
      </div>

      {faqList.map((faq, faqIndex) => (
        <div
          key={faq.name}
          className={faqIndex === faqList.length - 1 ? '' : 'mb-8'}
        >
          {faq.name && (
            <div className="text-2xl font-semibold mt-2 mb-4">{faq.name}</div>
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
