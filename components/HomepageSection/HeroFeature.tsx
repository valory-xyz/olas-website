import { HERO_FEATURE } from 'common-util/constants';
import { cn } from 'lib/utils';
import Image from 'next/image';

const CARD_HOVER_SHADOW =
  'group-hover:[box-shadow:0_32px_9px_0_rgba(88,92,101,0.00),0_21px_8px_0_rgba(88,92,101,0.01),0_11px_7px_0_rgba(88,92,101,0.03),0_5px_5px_0_rgba(88,92,101,0.05),0_1px_3px_0_rgba(88,92,101,0.06)]';

// Paper speckle. feTurbulence alone lays down continuous grain, which greys the
// whole card down; the colour matrix instead keeps a fixed slate and drives only
// alpha off the noise, so anything below the threshold stays fully transparent
// and what is left reads as scattered flecks.
const CARD_SPECKLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.63 0 0 0 0 0.68 0 0 0 0 0.78 8 0 0 0 -5.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23d)'/%3E%3C/svg%3E\")";

const Rule = () => <div className="h-px w-full bg-[#B7C1D2]" />;

const Bar = ({ className }: { className: string }) => (
  <div className={cn('h-2 lg:h-2.5 rounded bg-[#C3CCDB]', className)} />
);

// Temporary press feature on the hero. Gated by isHeroFeatureActive.
export const HeroFeature = ({ className }: { className?: string }) => (
  <a
    href={HERO_FEATURE.url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn('block group', className)}
  >
    <div
      className={cn(
        'w-[140px] lg:w-[180px] mx-auto rounded-[20px] lg:rounded-3xl',
        'px-2.5 lg:px-3 pt-3.5 lg:pt-[18px] pb-10 lg:pb-[52px]',
        'shadow-md transition-all duration-300 ease-in-out group-hover:scale-[1.01]',
        CARD_HOVER_SHADOW
      )}
      style={{ backgroundColor: '#F9FAFD', backgroundImage: CARD_SPECKLE }}
    >
      <Rule />
      <div className="mt-2 text-[12px] lg:text-[15px] leading-none text-center text-[#7B8698]">
        Spotted on
      </div>
      <Image
        src={HERO_FEATURE.logoSrc}
        alt={HERO_FEATURE.outlet}
        width={108}
        height={28}
        className="mx-auto mt-1.5 w-[84px] lg:w-[108px] h-auto"
      />
      <div className="mt-2.5 lg:mt-3">
        <Rule />
      </div>

      {/* Stand-in for the article: a thumbnail and its opening lines. */}
      <div className="mt-3 lg:mt-4 flex items-start gap-2 pl-2 lg:pl-[10px]">
        <div className="w-[38px] h-[33px] lg:w-12 lg:h-[42px] shrink-0 rounded-lg bg-[#C3CCDB]" />
        <div className="flex-1 pt-[3px] lg:pt-1 space-y-[5px] lg:space-y-1.5">
          <Bar className="w-full" />
          <Bar className="w-[72%]" />
          <Bar className="w-[47%]" />
        </div>
      </div>
    </div>

    <div className="mx-auto mt-3 w-[150px] lg:w-[190px] text-center text-xs lg:text-sm font-medium leading-snug text-gray-900">
      {HERO_FEATURE.headline}
      <svg
        width="11"
        height="11"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        className="ml-1 inline"
      >
        <path
          d="M3 9L9 3M9 3H4M9 3V8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </a>
);
