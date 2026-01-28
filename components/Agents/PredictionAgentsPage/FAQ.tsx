import { Accordion } from 'common-util/Accordion';
import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import { PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { SubsiteLink } from 'components/ui/typography';

const faq = [
  {
    title: 'What is Omenstrat?',
    desc: 'Omenstrat is an autonomous AI agent that participates in prediction markets on your behalf autonomously. It is designed to analyze real-time data, discover new markets, and place bets on future events without manual input.',
  },
  {
    title: 'How does Omenstrat benefit DeFi users?',
    desc: 'By providing accurate, data-driven forecasts, Omenstrat helps you to make better decisions in trading, governance, and risk management.',
  },
  {
    title: 'Do I need coding skills to use Omenstrat?',
    desc: (
      <p>
        No. With the <SubsiteLink href={PEARL_YOU_URL}>Pearl app</SubsiteLink>, you can easily
        deploy and manage Omenstrat without coding, making AI-powered prediction markets accessible
        to a wider audience.
      </p>
    ),
  },
  {
    title: 'How can I get started with Omenstrat?',
    desc: (
      <p>
        You can start by downloading the <SubsiteLink href={PEARL_YOU_URL}>Pearl app</SubsiteLink>{' '}
        and running your own Omenstrat agent.
      </p>
    ),
  },
];

export const FAQ = () => (
  <SectionWrapper id="faq" customClasses={`${SECTION_BOX_CLASS} max-w-2xl mx-auto`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-14`}>Frequently Asked Questions</h2>
    {faq.map((eachFaq, index) => (
      <div className="py-2" key={index}>
        <Accordion label={eachFaq.title} defaultOpen={false}>
          {eachFaq.desc}
        </Accordion>
      </div>
    ))}
  </SectionWrapper>
);
