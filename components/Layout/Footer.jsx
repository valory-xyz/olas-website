import Image from 'next/image';
import Link from 'next/link';

const SOCIALS = [
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
];

const LEARNS = [
  {
    title: 'What is Olas?',
    link: '/learn#what-is-olas',
    isExternal: false,
  }, {
    title: 'Olas Protocol',
    link: '/protocol',
    isExternal: false,
  }, {
    title: 'Olas Stack',
    link: '/stack',
    isExternal: false,
  },
];

const Footer = () => (
  <footer className="bg-white px-4 lg:px-6 py-16">
    <div className="grid grid-cols-6 border-b-1.5 pb-12 mb-6 text-slate-700">
      <div className="col-span-2">
        <Link href="/" className="block mb-3">
          <Image
            src="/images/olas-logo.svg"
            alt="logo"
            width="120"
            height="60"
          />
        </Link>
        <span>The Network for Co-owning AI</span>
        <div className="flex gap-2 mt-6">
          {SOCIALS.map((item) => (
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
              />
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 py-3">
        <span className="block font-medium mb-3">Learn</span>
        {LEARNS.map((item) => <Link href={item.link}>{item.title}</Link>)}
      </div>
      <div className="flex flex-col gap-3 py-3">
        <span className="block font-medium mb-3">Learn</span>
        {LEARNS.map((item) => <Link href={item.link}>{item.title}</Link>)}
      </div>
      <div className="flex flex-col gap-3 py-3">
        <span className="block font-medium mb-3">Learn</span>
        {LEARNS.map((item) => <Link href={item.link}>{item.title}</Link>)}
      </div>
      <div className="flex flex-col gap-3 py-3">
        <span className="block font-medium mb-3">Learn</span>
        {LEARNS.map((item) => <Link href={item.link}>{item.title}</Link>)}
      </div>
    </div>
    {/* <div className="mx-auto max-w-screen-xl text-center">
      <Link
        href="/"
        className="flex justify-center items-center text-2xl font-semibold text-gray-900 "
      >
        <Image
          src="/images/olas-logo.svg"
          alt="Olas logo"
          width="158"
          height="88"
          className="mx-auto"
        />
      </Link>
      <p className="my-6 text-gray-600 ">
        The Network for Co-owning AI
      </p>
      <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 ">
        <li>
          <Link href="/whitepaper" className="mr-4 hover:underline md:mr-6 ">
            Whitepaper
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/contentwillvary/brand-and-press-kit-olas/blob/main/README.md"
            className="mr-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Press Kit ↗
          </Link>
        </li>
        <li>
          <Link
            href="https://autonolas.world"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alter Orbis ↗
          </Link>
        </li>
        <li>
          <a
            href="https://twitter.com/autonolas"
            className="ml-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter ↗
          </a>
        </li>
        <li>
          <a
            href="https://discord.com/invite/z2PT65jKqQ"
            className="ml-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord ↗
          </a>
        </li>
        <li>
          <a
            href="https://www.coingecko.com/en/coins/autonolas"
            className="ml-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Coingecko ↗
          </a>
        </li>
        <li>
          <a
            href="https://contribute.olas.network/roadmap"
            className="ml-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roadmap ↗
          </a>
        </li>
      </ul> */}
    <div className="text-center text-gray-600">
      © Autonolas DAO 2024&nbsp;•&nbsp;
      <Link href="/disclaimer">Disclaimer</Link>
          &nbsp;•&nbsp;
      <a
        href="https://gateway.autonolas.tech/ipfs/bafybeibrhz6hnxsxcbv7dkzerq4chssotexb276pidzwclbytzj7m4t47u"
        target="_blank"
        className="hover:underline"
        rel="noopener noreferrer"
      >
        DAO Constitution
      </a>
    </div>
  </footer>
);

export default Footer;
