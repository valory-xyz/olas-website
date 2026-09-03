import { HERO_FEATURE } from 'common-util/constants';
import { cn } from 'lib/utils';
import Image from 'next/image';

const CARD_HOVER_SHADOW =
  'group-hover:[box-shadow:0_32px_9px_0_rgba(88,92,101,0.00),0_21px_8px_0_rgba(88,92,101,0.01),0_11px_7px_0_rgba(88,92,101,0.03),0_5px_5px_0_rgba(88,92,101,0.05),0_1px_3px_0_rgba(88,92,101,0.06)]';

// Paper grain, desaturated so it reads as speckle rather than colour noise.
const CARD_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const Rule = () => <div className="h-px w-full bg-[#CBD3E1]" />;

const Bar = ({ className }: { className: string }) => (
  <div className={cn('h-[7px] lg:h-2 rounded bg-[#C7CFDD]', className)} />
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
        'px-2.5 lg:px-3 pt-3 lg:pt-4 pb-11 lg:pb-14',
        'shadow-md transition-all duration-300 ease-in-out group-hover:scale-[1.01]',
        CARD_HOVER_SHADOW
      )}
      style={{ backgroundColor: '#EDF0F5', backgroundImage: CARD_GRAIN }}
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
      <div className="mt-3 lg:mt-4 flex items-start gap-2 lg:gap-2.5">
        <div className="size-[38px] lg:size-[46px] shrink-0 rounded-lg bg-[#C7CFDD]" />
        <div className="flex-1 space-y-[7px] lg:space-y-2">
          <Bar className="w-full" />
          <Bar className="w-4/5" />
          <Bar className="w-3/5" />
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
