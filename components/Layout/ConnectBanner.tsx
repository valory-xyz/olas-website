import { PEARL_YOU_URL, UTM_SOURCE_OLAS_SITE } from 'common-util/constants';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import NewBadgeIcon from './NewBadgeIcon';

const BANNER_HREF = `${PEARL_YOU_URL}connect?${UTM_SOURCE_OLAS_SITE}&utm_campaign=connect-banner&utm_content=connect-banner-link`;

// Robinhood brand: flat signature lime with black on top.
const ROBINHOOD_GREEN = '#CCFF00';

const ConnectBanner = () => (
  <Link
    href={BANNER_HREF}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full items-center justify-center gap-3 px-6 py-3 text-center text-lg text-black transition-opacity hover:opacity-90"
    style={{ background: ROBINHOOD_GREEN }}
  >
    <NewBadgeIcon color="#000000" className="shrink-0 max-md:hidden" />
    <Image
      src="/images/agents/connect.png"
      alt="Connect"
      width={40}
      height={40}
      className="shrink-0 md:hidden"
    />
    <span className="max-md:text-base max-md:text-left">
      Get Connect on <span className="font-semibold">Robinhood Chain</span>: trade Stock Tokens and
      memecoins from your coding agent
    </span>
    <Image
      src="/images/agents/connect.png"
      alt="Connect"
      width={40}
      height={40}
      className="shrink-0 max-md:hidden"
    />
    <ChevronRight size={20} className="shrink-0" aria-hidden />
  </Link>
);

export default ConnectBanner;
