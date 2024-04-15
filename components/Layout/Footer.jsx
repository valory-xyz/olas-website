import Image from 'next/image';
import Link from 'next/link';

const Footer = () => (
  <footer className="p-4 bg-white md:p-8 lg:p-10 ">
    <div className="mx-auto max-w-screen-xl text-center">
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
        The unified network for off-chain services
      </p>
      <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 ">
        <li>
          <Link href="/#ecosystem" className="mr-4 hover:underline md:mr-6 ">
            Ecosystem
          </Link>
        </li>
        <li>
          <Link href="/whitepaper" className="mr-4 hover:underline md:mr-6 ">
            Whitepaper
          </Link>
        </li>
        <li>
          <Link href="/#resources" className="mr-4 hover:underline">
            Resources
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
      </ul>
      <div className="text-gray-600">
        © Autonolas DAO 2023&nbsp;•&nbsp;
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
    </div>
  </footer>
);

export default Footer;
