import { SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Award, BicepsFlexed, Crown, Gem, Twitter } from 'lucide-react';

const list = [
  {
    title: 'Earn OLAS',
    icon: <Gem />,
    desc: 'Get rewarded for sharing posts about Olas. Participate in campaigns, post impactful content, and potentially earn OLAS for it.',
  },
  {
    title: 'Climb the leaderboard',
    icon: <Crown />,
    desc: 'Gain recognition within the Olas community by competing on the leaderboard. Showcase your efforts, rise through the ranks, and establish yourself as a leading contributor.',
  },
  {
    title: 'Unlock dynamic NFT badges',
    icon: <Award />,
    desc: 'Mint an evolving NFT badge that grows with your contributions. Display your impact proudly with this unique reward.',
  },
  {
    title: 'Shape Olas messaging',
    icon: <Twitter />,
    desc: 'If you are a veOLAS holder, you can propose and vote on tweets to be posted by the community X account. Be part of a decentralized system driving Olas’ social presence.',
  },
  {
    title: 'Strengthen the Olas Network',
    icon: <BicepsFlexed />,
    desc: 'Every post you make promotes Olas, strengthens the ecosystem, and brings in more supporters. Your efforts drive growth, activity, and adoption—ultimately boosting the value of your contributions and rewards.',
  },
];

export const WhyBecomeAnOlasContributor = () => (
  <SectionWrapper customClasses="py-8 px-5 lg:py-24 lg:px-0 lg:pt-16">
    <div className="max-w-screen-xl mx-auto lg:px-12">
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why become an Olas Contributor?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
