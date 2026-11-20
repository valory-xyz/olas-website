import { UTM_SOURCE_OLAS_SITE } from 'common-util/constants';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import NewBadgeIcon from './NewBadgeIcon';

const BANNER_HREF = `/blog/ocb?${UTM_SOURCE_OLAS_SITE}&utm_campaign=ocb-agent-banner&utm_content=ocb-agent-banner-link`;

// Badge letters in the banner's colour: Tailwind purple-700 (bg-purple-700 on the link below).
const BANNER_PURPLE = '#7E22CE';

const OcbAgentBanner = () => (
  <Link
    href={BANNER_HREF}
    className="flex w-full items-center justify-center gap-3 bg-purple-700 px-6 py-3 text-center text-lg text-white transition-opacity hover:opacity-90"
  >
    <NewBadgeIcon color="#FFFFFF" lettersColor={BANNER_PURPLE} className="shrink-0 max-md:hidden" />
    <span className="max-md:text-base max-md:text-left">
      Introducing <span className="font-semibold">olas-ocb-agent</span> (beta): one AI agent to pay,
      swap and lend onchain
    </span>
    <ChevronRight size={20} className="shrink-0" aria-hidden />
  </Link>
);

export default OcbAgentBanner;
