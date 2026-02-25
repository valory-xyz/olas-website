import { PEARL_YOU_URL } from 'common-util/constants';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BANNER_HREF = `${PEARL_YOU_URL}polystrat`;

const PolystratBanner = () => (
  <Link
    href={BANNER_HREF}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full items-center justify-center gap-3 bg-gradient-to-r from-[#5744D6] to-[#C20EAA] px-6 py-3 text-center text-lg text-white transition-opacity hover:opacity-95"
  >
    <Image
      src="/images/homepage/new.svg"
      alt="New"
      width={40}
      height={40}
      className="shrink-0 max-md:hidden"
    />
    <span className="max-md:hidden">
      Get Polystrat: trade Polymarket on autopilot around the clock while you do something else
    </span>
    <span className="md:hidden text-base text-left">
      New Polystrat agent: trades Polymarket on autopilot while you do something else
    </span>
    <Image
      src="/images/homepage/polystrat.png"
      alt="Polystrat"
      width={40}
      height={40}
      className="shrink-0"
    />
    <ChevronRight size={20} className="shrink-0" aria-hidden />
  </Link>
);

export default PolystratBanner;
