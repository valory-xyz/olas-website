import PropTypes from 'prop-types';

const features = [
  {
    id: 'f1bec8d4-d16f-4ae5-b8bc-1e3b4fdc7ae7',
    title: 'Contribution Tracking',
    icon: '👀',
    description:
      'Contribute uses AI and decentralized automation to observe your contributions, analyse their impact and award points.',
  },
  {
    id: '36a7ce0e-035e-47ce-9e68-701773300ba9',
    title: 'Leaderboard',
    icon: '🏆',
    description:
      'Rank your contributions against those of other community members. Stored on Ceramic.',
  },
  {
    id: '3c856d9f-b017-4245-bafd-d517b038ef9a',
    title: 'Recognition Badges',
    icon: '🎖️',
    description: 'Mint a dynamic NFT badge that evolves as you earn points.',
  },
  {
    id: 'fa7c3bdb-56a4-4eff-a88c-42f85a1c4f03',
    title: 'Contributor Profiles',
    icon: '🧞‍♂️',
    description:
      'Showcase your position in the community with a dedicated page.',
  },
  // {
  //   id: 'bf77fa18-0a70-4651-ad97-49563fd620b8',
  //   title: 'Community-owned Chatbot',
  //   icon: '🤖',
  //   description:
  //     `veOLAS holders can collaboratively shape the 'memory' of
  //     a chatbot for community newcomers to learn from.`,
  // },
  {
    id: 'ed74f1e1-3b5f-4a74-80ea-61182d9764d2',
    title: 'Community-owned Social Posting',
    icon: '🐦',
    description:
      'veOLAS hodlers can propose and vote on tweets to be posted by the community Twitter account.',
  },
  // {
  //   id: '9a94e834-2b91-4010-b2f9-e9321fbd64d2',
  //   title: 'Community Chat',
  //   icon: '💬',
  //   description:
  //     `veOLAS holders have a dedicated space to discuss as a group
  //     and message one another via encrypted private chat.`,
  // },
];

const Feature = ({ feature }) => (
  <div className="flex items-start gap-6 mb-6 sm:mb-0">
    <span className="shrink-0 rounded-lg border bg-purple-50 p-4 text-3xl">
      {feature.icon}
    </span>

    <div>
      <h2 className="text-xl font-bold">{feature.title}</h2>

      <p className="mt-1 text-md text-slate-600">{feature.description}</p>
    </div>
  </div>
);

Feature.propTypes = {
  feature: PropTypes.shape({
    description: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

const Features = () => (
  <section className="bg-fuchsia-50 text-slate-800 py-12">
    <div className="max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8 mx-auto">
      <div className="max-w-screen-xl">
        <h2 className="text-3xl font-bold sm:text-4xl text-center">Features</h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
        {features.map((feature) => (
          <Feature key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  </section>
);

export default Features;
