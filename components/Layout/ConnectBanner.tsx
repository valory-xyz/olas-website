import { PEARL_YOU_URL, UTM_SOURCE_OLAS_SITE } from 'common-util/constants';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import NewBadgeIcon from './NewBadgeIcon';

const BANNER_HREF = `${PEARL_YOU_URL}connect?${UTM_SOURCE_OLAS_SITE}&utm_campaign=connect-banner&utm_content=connect-banner-link`;

const BANNER_BACKGROUND =
  'radial-gradient(77.51% 202.82% at 77.51% 55.57%, #644DFF 0%, #7875FF 50%, #57E3FF 84.62%), linear-gradient(0deg, #FFFFFF, #FFFFFF)';

const ConnectBanner = () => (
  <Link
    href={BANNER_HREF}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full items-center justify-center gap-3 px-6 py-3 text-center text-lg text-white transition-opacity hover:opacity-95"
    style={{ background: BANNER_BACKGROUND }}
  >
    <NewBadgeIcon color="#FF33DD" className="shrink-0 max-md:hidden" />
    <Image
      src="/images/agents/connect.png"
      alt="Connect"
      width={40}
      height={40}
      className="shrink-0 md:hidden"
    />
    <span className="max-md:text-base max-md:text-left">
      Get Connect: Bring on-chain to your coding agent, starting with prediction markets
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
