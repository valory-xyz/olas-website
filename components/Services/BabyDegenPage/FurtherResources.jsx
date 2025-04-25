import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';

const { default: SectionWrapper } = require('components/Layout/SectionWrapper');
const { MoveUpRight } = require('lucide-react');

const resources = [
  {
    title: 'Contribute a strategy',
    description:
      'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    action: {
      url: 'https://discord.gg/RHY6eJ35ar',
      text: 'Reach out on Discord',
    },
  },
  {
    title: 'Join as an Alpha tester',
    description: 'Keen on being at the forefront of trading innovation?',
    action: {
      url: 'https://discord.gg/RHY6eJ35ar',
      text: 'Reach out on Discord',
    },
  },
];

export const FurtherResources = () => (
  <SectionWrapper>
    <h2 className={`${SUB_HEADER_CLASS} text-center lg:mb-14 text-left mb-6 `}>
      Further resources
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-screen-lg mx-auto">
      {resources.map((resource, index) => (
        <div
          key={index}
          className="lg:p-6 align flex flex-col gap-2 p-4 rounded-xl border border-l-4"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">{resource.title}</h2>
          </div>

          <p className={`${TEXT_CLASS} flex-1`}>{resource.description}</p>
          <a
            href={resource.action.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 flex-end"
          >
            {resource.action.text}{' '}
            <MoveUpRight className="ml-2 inline" size={16} />
          </a>
        </div>
      ))}
    </div>
  </SectionWrapper>
);
