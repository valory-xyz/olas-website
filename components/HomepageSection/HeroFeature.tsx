import { HERO_FEATURE } from 'common-util/constants';
import { cn } from 'lib/utils';
import Image from 'next/image';

const CARD_HOVER_SHADOW =
  'group-hover:[box-shadow:0_32px_9px_0_rgba(88,92,101,0.00),0_21px_8px_0_rgba(88,92,101,0.01),0_11px_7px_0_rgba(88,92,101,0.03),0_5px_5px_0_rgba(88,92,101,0.05),0_1px_3px_0_rgba(88,92,101,0.06)]';

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
        'w-[140px] lg:w-[180px] mx-auto rounded-2xl bg-white px-4 py-4 lg:px-4 lg:py-5',
        'shadow-md transition-all duration-300 ease-in-out group-hover:scale-[1.01]',
        CARD_HOVER_SHADOW
      )}
    >
      <div className="text-[10px] lg:text-[11px] leading-none text-gray-500 text-center">
        Spotted on
      </div>
      <Image
        src={HERO_FEATURE.logoSrc}
        alt={HERO_FEATURE.outlet}
        width={112}
        height={29}
        className="mx-auto mt-1.5 w-[86px] lg:w-[112px] h-auto"
      />

      {/* Stand-in for the article itself: a thumbnail and its opening lines. */}
      <div className="mt-3 lg:mt-4 border-t border-gray-200 pt-3 lg:pt-4">
        <div className="flex items-start gap-2">
          <div className="size-10 lg:size-12 shrink-0 rounded bg-gray-200" />
          <div className="flex-1 space-y-1.5 lg:space-y-2 pt-0.5">
            <div className="h-1.5 rounded-full bg-gray-200" />
            <div className="h-1.5 w-4/5 rounded-full bg-gray-200" />
            <div className="h-1.5 w-3/5 rounded-full bg-gray-200" />
          </div>
        </div>
        <div className="mt-2.5 lg:mt-3 space-y-1.5 lg:space-y-2">
          <div className="h-1.5 rounded-full bg-gray-200" />
          <div className="h-1.5 w-2/3 rounded-full bg-gray-200" />
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
