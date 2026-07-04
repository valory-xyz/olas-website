import Link from 'next/link';
import { useRouter } from 'next/router';

/** Pages whose primary content promotes acquiring, staking, bonding, or earning OLAS. */
const QUALIFYING_PATHS = new Set(['/olas-token', '/bond', '/staking', '/operate', '/build']);

export const InfoNotice = () => {
  const { pathname } = useRouter();

  if (!QUALIFYING_PATHS.has(pathname)) return null;

  return (
    <div className="max-w-[880px] mx-auto mt-6 px-6 text-center text-xs text-slate-400">
      This page has not been reviewed or approved by any competent authority in any Member State of
      the European Union. Site content is set by the Olas DAO and hosted on its behalf by the site
      operator — see the{' '}
      <Link href="/disclaimer" className="underline hover:text-slate-600">
        Disclaimer
      </Link>
      . OLAS is a crypto-asset: its value can go down as well as up and you may lose the entire
      amount invested.
    </div>
  );
};

export default InfoNotice;
