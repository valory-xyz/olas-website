import {
  COINGECKO_URL,
  DISCORD_INVITE_URL,
  DOCS_BASE_URL,
  PEARL_YOU_URL,
  WHITEPAPER,
  X_OLAS_URL,
} from 'common-util/constants';
import { cn } from 'lib/utils';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SOCIAL_LINKS = [
  {
    title: 'Twitter',
    icon: '/images/footer/x.svg',
    link: X_OLAS_URL,
  },
  {
    title: 'Discord',
    icon: '/images/footer/discord.svg',
    link: DISCORD_INVITE_URL,
  },
  {
    title: 'Coingecko',
    icon: '/images/footer/coingecko.svg',
    link: `${COINGECKO_URL}/en/coins/autonolas`,
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

const FOR_USERS_LINKS = [
  {
    title: 'Pearl: The “AI Agent App Store”',
    link: PEARL_YOU_URL,
  },
  {
    title: 'Mech Marketplace: The "AI Agent Bazaar"',
    link: '/mech-marketplace',
  },
  {
    title: 'OLAS Token',
    link: '/olas-token',
  },
];

const DAO_LINKS = [
  { title: 'Contribute', link: '/contribute' },
  { title: 'Launch', link: '/launch' },
  { title: 'Build', link: '/build' },
  { title: 'Operate', link: '/operate' },
  { title: 'Bond', link: '/bond' },
  { title: 'Govern', link: '/govern' },
  {
    title: 'Constitution',
    link: 'https://gateway.autonolas.tech/ipfs/bafybeibrhz6hnxsxcbv7dkzerq4chssotexb276pidzwclbytzj7m4t47u',
    isExternal: true,
  },
];

const RESOURCES_LINKS = [
  {
    title: 'Blog',
    link: '/blog',
  },
  {
    title: 'FAQ',
    link: '/faq',
  },
  {
    title: 'Docs',
    link: DOCS_BASE_URL,
  },
  {
    title: 'Quarterly Updates',
    link: '/quarterly-updates',
  },
  {
    title: 'Agents Unleashed',
    link: '/agents-unleashed',
  },
  {
    title: 'Videos & Podcasts',
    link: '/videos',
  },
  {
    title: 'Hackathons',
    link: '/hackathons',
  },
  {
    title: 'Roadmap',
    link: '/roadmap',
  },
  {
    title: 'Timeline',
    link: '/timeline',
  },
  {
    title: 'Stack',
    link: '/stack',
  },
];

const MORE_LINKS = [
  {
    title: 'About',
    link: '/about',
  },
  {
    title: 'Staking',
    link: '/staking',
  },
  {
    title: 'Whitepaper',
    link: WHITEPAPER,
  },
  {
    title: 'Tokenomics',
    link: '/olas-token',
  },
  {
    title: 'Brand Kit',
    link: 'https://github.com/contentwillvary/brand-and-press-kit-olas/blob/main/README.md',
    isExternal: true,
  },
];

const CURRENT_YEAR = new Date().getFullYear();

interface LinksBlockProps {
  title: string;
  links: {
    title: string;
    link: string;
    isExternal?: boolean;
  }[];
  className?: string;
}

const LinksBlock = ({
  title,
  links,
  className
}: LinksBlockProps) => (
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
      <div className="grid max-sm:grid-cols-1 grid-cols-2 xl:flex md:flex-row max-xl:gap-y-8 gap-x-12 w-full flex-wrap">
        <LinksBlock title="For Users" links={FOR_USERS_LINKS} />
        <LinksBlock title="DAO" links={DAO_LINKS} />
        <LinksBlock title="Resources" links={RESOURCES_LINKS} />
        <LinksBlock title="More" links={MORE_LINKS} />
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
