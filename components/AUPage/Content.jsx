import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

const BLOG_POST_URL =
  'https://www.valory.xyz/post/co-owned-ai#:~:text=Valory%20believes%20AGI%20will%20likely,avoid%20devastating%20outcomes%20for%20societies.';
const largeIcons = [
  {
    id: '',
    name: 'Olas',
    iconFileName: '/olas-logo.svg',
  },
  {
    id: '',
    name: 'Near',
    iconFileName: '/au-page/icons/near.png',
  },
  {
    id: '',
    name: 'Almanak',
    iconFileName: '/au-page/icons/almanak.png',
  },
  {
    id: '',
    name: 'Flock',
    iconFileName: '/friends/flock.svg',
  },
  {
    id: '',
    name: 'Kryptoplanet',
    iconFileName: '/au-page/icons/kryptoplanet.png',
  },
  {
    id: '',
    name: 'Polywrap',
    iconFileName: '/au-page/icons/polywrap.png',
  },
];

const mediumIcons = [
  {
    id: '',
    name: 'Vana',
    iconFileName: '/au-page/icons/vana.svg',
  },
  {
    id: '',
    name: 'Myshell',
    iconFileName: '/au-page/icons/myshell.png',
  },
  {
    id: '',
    name: 'Capx',
    iconFileName: '/au-page/icons/capx.svg',
  },
  {
    id: '',
    name: 'Agentcoin',
    iconFileName: '/au-page/icons/agentcoin.svg',
  },
  {
    id: '',
    name: 'Layer',
    iconFileName: '/au-page/icons/layer.svg',
  },
  {
    id: '',
    name: 'Phala',
    iconFileName: '/au-page/icons/phala.svg',
  },
  {
    id: '',
    name: 'Creator',
    iconFileName: '/au-page/icons/creator.png',
  },
  {
    id: '',
    name: 'Gensyn',
    iconFileName: '/au-page/icons/gensyn.svg',
  },
  {
    id: '',
    name: 'Spectral',
    iconFileName: '/au-page/icons/spectral.png',
  },
  {
    id: '',
    name: 'Edge Network',
    iconFileName: '/au-page/icons/edge-network.png',
  },
  {
    id: '',
    name: 'Agentops',
    iconFileName: '/au-page/icons/agentops.png',
  },
];

const smallIcons = [
  {
    id: '',
    name: 'Nevermined',
    iconFileName: '/builders/nevermined.png',
  },
  {
    id: '',
    name: 'Signature Ventures',
    iconFileName: '/au-page/icons/signature-ventures.png',
  },
  {
    id: '',
    name: 'Keyko',
    iconFileName: '/au-page/icons/keyko.png',
  },
  {
    id: '',
    name: 'The Indexing Company',
    iconFileName: '/au-page/icons/indexing-company.png',
  },
  {
    id: '',
    name: 'Naptha AI',
    iconFileName: '/builders/naptha-ai.png',
  },
  {
    id: '',
    name: 'Wayfinder',
    iconFileName: '/au-page/icons/wayfinder.png',
  },
  {
    id: '',
    name: 'Mode',
    iconFileName: '/chains/mode.svg',
  },
  {
    id: '',
    name: 'Biconomy',
    iconFileName: '/au-page/icons/biconomy.png',
  },
  {
    id: '',
    name: 'Newcoin',
    iconFileName: '/au-page/icons/newcoin.png',
  },
  {
    id: '',
    name: 'Kaito',
    iconFileName: '/au-page/icons/kaito.png',
  },
  {
    id: '',
    name: 'Coophive',
    iconFileName: '/au-page/icons/coophive.png',
  },
  {
    id: '',
    name: 'Voiceflow',
    iconFileName: '/au-page/icons/voiceflow.png',
  },
  {
    id: '',
    name: 'Story',
    iconFileName: '/au-page/icons/story.png',
  },
];

const Sponsors = () => (
  <div className="mx-auto max-w-[1000px] max-sm:py-8 max-sm:px-6">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-24 gap-y-4 mb-20">
      {largeIcons.map((icon) => {
        const { id, name, iconFileName } = icon;
        return (
          <div
            key={id}
            className="grayscale flex max-w-[200px] justify-center items-center"
          >
            <Image
              src={`/images${iconFileName}`}
              alt={name}
              width={200}
              height={45}
              className="object-contain"
            />
          </div>
        );
      })}
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-6 gap-12 mb-20 ">
      {mediumIcons.map((icon) => {
        const { id, name, iconFileName } = icon;
        return (
          <div key={id} className="grayscale flex justify-center items-center">
            <Image
              src={`/images${iconFileName}`}
              alt={name}
              width={150}
              height={25}
              className="object-contain"
            />
          </div>
        );
      })}
    </div>

    <div className="grid grid-cols-3 sm:grid-cols-7 gap-8">
      {smallIcons.map((icon) => {
        const { id, name, iconFileName } = icon;
        return (
          <div key={id} className="grayscale flex justify-center items-center">
            <Image
              src={`/images${iconFileName}`}
              alt={name}
              width={100}
              height={20}
              className="object-contain max-h-[50px]"
            />
          </div>
        );
      })}
    </div>
  </div>
);

export const Content = () => (
  <SectionWrapper>
    <Sponsors />
    <div className="max-w-[1000px] mx-auto">
      <Image
        src={`/images/au-page/au-image.png`}
        alt="Agents Unleashed"
        width={1000}
        height={800}
        className="rounded-lg mx-auto mt-24 mb-8"
      />
      <p className="mb-4">
        &apos;Agents Unleashed&apos; showcases the latest developments in AI
        agents, an emergent area at the intersection of crypto and AI. Its
        organizers believe that{' '}
        <a href={BLOG_POST_URL} className="text-purple-600" target="_blank">
          Artificial General Intelligence will likely be agentic ↗
        </a>
        . Since AI agents won&apos;t be given bank accounts, crypto (aka the
        world of digital money) is AI agents&apos; natural home. It is
        unsurprising then, that some of the brightest minds in AI and in crypto
        are working on AI agents.
      </p>{' '}
      <p>
        The &apos;Agents Unleashed&apos; event series is hosted by Olas and
        coordinated by Valory. Both organizations were established in 2021,
        dedicated to leveraging AI agents to enable co-owned AI. They started
        Agents Unleashed as a way to bring together those working on agents to
        share best practices, innovations and common language, ultimately
        unleashing AI agents for the betterment of humanity.
      </p>
    </div>
  </SectionWrapper>
);
