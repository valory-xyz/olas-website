import { REGISTRY_URL } from 'common-util/constants';
import { cn } from 'lib/utils';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

const SOCIAL_LINKS = [
  {
    title: 'Twitter',
    icon: '/images/footer/x.svg',
    link: 'https://twitter.com/autonolas',
  },
  {
    title: 'Discord',
    icon: '/images/footer/discord.svg',
    link: 'https://discord.gg/BQzYqhjGjQ',
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
  { title: 'Olas Protocol', link: '/protocol' },
  { title: 'Olas Stack', link: '/stack' },
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

const OTHER_APPS_LINKS = [
  { title: 'Registry', link: REGISTRY_URL, isExternal: true },
  {
    title: 'Press Kit',
    link: 'https://github.com/contentwillvary/brand-and-press-kit-olas/blob/main/README.md',
    isExternal: true,
  },
];

const RESOURCES_LINKS = [
  {
    title: 'Docs',
    link: 'https://docs.autonolas.network',
    isExternal: true,
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
    title: 'Olas Dev Academy Videos',
    link: 'https://www.youtube.com/playlist?list=PLXztsZv11CTfXiQK9OJhMwBkfgf4ETZkl',
    isExternal: true,
  },
  {
    title: 'Whitepaper',
    link: '/whitepaper',
  },
  {
    title: 'DAO Constitution',
    link: 'https://gateway.autonolas.tech/ipfs/bafybeibrhz6hnxsxcbv7dkzerq4chssotexb276pidzwclbytzj7m4t47u',
    isExternal: true,
  },
  {
    title: 'Quarterly Updates',
    link: '/quarterly-updates',
  },
  {
    title: 'FAQ',
    link: '/faq',
  },
  {
    title: 'Tokenomics',
    link: '/olas-token',
  },
  {
    title: 'Agents Unleashed',
    link: '/agents-unleashed',
  },
  {
    title: 'Olas Hackathons',
    link: '/hackathons',
  },
  {
    title: 'Timeline',
    link: '/timeline',
  },
];

const CURRENT_YEAR = new Date().getFullYear();

const LinksBlock = ({ title, links, className }) => (
  <div>
    <span className="block font-semibold">{title}</span>
    <div className={cn('flex flex-col gap-3 py-3', className)}>
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
    <div className="mx-auto max-w-screen-xl flex max-lg:flex-col gap-8 xl:gap-12 border-b-1.5 pb-12 mb-6 text-slate-700">
      <div className="block md:flex lg:block justify-between md:justify-start">
        <div className="">
          <Link href="/" className="block mb-3">
            <Image
              src="/images/olas-logo.svg"
              alt="logo"
              width="120"
              height="60"
            />
          </Link>
          <span className="whitespace-nowrap">
            The Network for Co-owning AI
          </span>
        </div>
        <div className="flex w-full gap-2 items-center max-sm:mt-6 md:justify-end lg:justify-start lg:items-start lg:mt-6">
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
      <div className="grid grid-cols-2 md:flex md:flex-row max-sm:gap-y-8 gap-x-12 w-full flex-wrap">
        <LinksBlock title="Learn" links={LEARN_LINKS} />
        <LinksBlock title="Get Involved" links={GET_INVOLVED_LINKS} />
        <LinksBlock title="Other" links={OTHER_APPS_LINKS} />
        <LinksBlock
          title="Resources"
          links={RESOURCES_LINKS}
          className="lg:max-h-[250px] flex-wrap"
        />
      </div>
    </div>
    <div className="text-center text-slate-500">
      {`© Olas DAO ${CURRENT_YEAR} • `}
      <Link href="/disclaimer" className="hover:text-black">
        Disclaimer & Privacy Policy
      </Link>
    </div>
  </footer>
);

export default Footer;
