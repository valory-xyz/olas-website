import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { MoveUpRight } from 'lucide-react';
import { REGISTRY_URL } from 'common-util/constants';
import { cn } from 'lib/utils';

const SOCIAL_LINKS = [
  {
    title: 'Twitter',
    icon: '/images/footer/x.svg',
    link: 'https://twitter.com/autonolas',
  },
  {
    title: 'Discord',
    icon: '/images/footer/discord.svg',
    link: 'https://discord.com/invite/z2PT65jKqQ',
  },
  {
    title: 'Coingecko',
    icon: '/images/footer/coingecko.svg',
    link: 'https://www.coingecko.com/en/coins/autonolas',
  },
  {
    title: 'Coinmarketcap',
    icon: '/images/footer/cmc.svg',
    link: 'https://coinmarketcap.com/currencies/autonolas/',
  },
  {
    title: 'YouTube',
    icon: '/images/footer/youtube.svg',
    link: 'https://www.youtube.com/@autonolas',
  },
];

const LEARN_LINKS = [
  { title: 'What is Olas?', link: '/learn#what-is-olas' },
  { title: 'Olas Protocol', link: '/protocol' },
  { title: 'Olas Stack', link: '/stack' },
];

const EXPLORE_LINKS = [
  { title: 'Use Cases', link: '/explore#use-cases' }
];

const GET_INVOLVED_LINKS = [
  { title: 'Get OLAS', link: '/olas-token' },
  { title: 'Contribute', link: '/contribute' },
  { title: 'Launch', link: '/launch' },
  { title: 'Build', link: '/build' },
  { title: 'Operate', link: '/operate' },
  { title: 'Bond', link: '/bond' },
  { title: 'Govern', link: '/govern' },
];

const OTHER_APPS_LINKS = [{ title: 'Registry', link: REGISTRY_URL }];

const RESOURCES_LINKS = [
  {
    title: 'Docs',
    link: 'https://docs.autonolas.network',
    isExternal: true,
  },
  {
    title: 'Whitepaper',
    link: '/whitepaper',
  },
  {
    title: 'Videos & Podcasts',
    link: '/videos',
  },
  {
    title: 'Blog',
    link: '/blog',
  },
  {
    title: 'DAO Constitution',
    link: 'https://gateway.autonolas.tech/ipfs/bafybeibrhz6hnxsxcbv7dkzerq4chssotexb276pidzwclbytzj7m4t47u',
    isExternal: true,
  },
  {
    title: 'Calendar',
    link: 'https://contribute.olas.network/calendar',
    isExternal: true,
  },
  {
    title: 'Roadmap',
    link: 'https://contribute.olas.network/roadmap',
    isExternal: true,
  },
  {
    title: 'FAQ',
    link: '/faq',
  },
  {
    title: 'Press Kit',
    link: 'https://github.com/contentwillvary/brand-and-press-kit-olas/blob/main/README.md',
    isExternal: true,
  },
  {
    title: 'Alter Orbis',
    link: 'https://autonolas.world',
    isExternal: true,
  },
  {
    title: 'Tokenomics',
    link: '/olas-token',
  },
];

const CURRENT_YEAR = new Date().getFullYear();

const LinksBlock = ({ title, links, className }) => (
  <div className={cn('flex flex-col gap-3 py-3', className)}>
    <span className="block font-semibold mb-3 col-span-2">{title}</span>
    {links.map((item) => {
      const LinkTag = item.isExternal ? 'a' : Link;
      return (
        <span key={item.title} className="contents">
          <LinkTag
            href={item.link}
            className="hover:text-black"
            {...(item.isExternal
              ? {
                target: '_blank',
                rel: 'noopener noreferrer',
              }
              : {})}
          >
            <span className="whitespace-nowrap">
              <span className="whitespace-normal">{item.title}</span>
              &nbsp;
              {item.isExternal && (
                <MoveUpRight className="ml-1 inline" size={8} />
              )}
            </span>
          </LinkTag>
        </span>
      );
    })}
  </div>
);

LinksBlock.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      isExternal: PropTypes.bool,
    }),
  ).isRequired,
  className: PropTypes.string,
};

LinksBlock.defaultProps = {
  className: '',
};

const Footer = () => (
  <footer className="bg-white px-4 lg:px-6 py-16">
    <div className="mx-auto max-w-screen-xl grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-y-8 border-b-1.5 pb-12 mb-6 text-slate-700">
      <div className="flex justify-between md:justify-start col-span-2 md:col-span-5 lg:col-span-2 md:grid md:grid-cols-5 lg:block">
        <div className="md:col-span-4">
          <Link href="/" className="block mb-3">
            <Image
              src="/images/olas-logo.svg"
              alt="logo"
              width="120"
              height="60"
            />
          </Link>
          <span>The Network for Co-owning AI</span>
        </div>
        <div className="flex gap-2 items-center justify-end md:justify-start lg:items-start lg:mt-6">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full hover:bg-slate-100"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width="40"
                height="40"
                className="hover:filter hover:brightness-0"
              />
            </a>
          ))}
        </div>
      </div>
      <LinksBlock title="Learn" links={LEARN_LINKS} />
      <LinksBlock title="Explore" links={EXPLORE_LINKS} />
      <LinksBlock title="Get Involved" links={GET_INVOLVED_LINKS} />
      <LinksBlock title="Other Apps" links={OTHER_APPS_LINKS} />
      <LinksBlock title="Resources" links={RESOURCES_LINKS} />
    </div>
    <div className="text-center text-slate-500">
      {`© Autonolas DAO ${CURRENT_YEAR} • `}
      <Link href="/disclaimer" className="hover:text-black">
        Disclaimer
      </Link>
    </div>
  </footer>
);

export default Footer;
