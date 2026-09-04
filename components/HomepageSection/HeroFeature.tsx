import { HERO_FEATURE } from 'common-util/constants';
import { cn } from 'lib/utils';
import Image from 'next/image';

const CARD_HOVER_SHADOW =
  'group-hover:[box-shadow:0_32px_9px_0_rgba(88,92,101,0.00),0_21px_8px_0_rgba(88,92,101,0.01),0_11px_7px_0_rgba(88,92,101,0.03),0_5px_5px_0_rgba(88,92,101,0.05),0_1px_3px_0_rgba(88,92,101,0.06)]';

const CARD_SPECKLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.63 0 0 0 0 0.68 0 0 0 0 0.78 8 0 0 0 -5.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23d)'/%3E%3C/svg%3E\")";

const Rule = ({ bold }: { bold?: boolean }) => {
  return <div className={cn('w-full bg-[#C2CBDB]', bold ? 'h-[2px] my-[2px]' : 'h-px')} />;
};

const Bar = ({ className }: { className: string }) => (
  <div className={cn('h-[10px] rounded-sm bg-[#C3CCDB]', className)} />
);

export const HeroFeature = ({ className }: { className?: string }) => (
  <a
    href={HERO_FEATURE.url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn('block group', className)}
  >
    <div
      className={cn(
        'w-[140px] lg:w-[180px] mx-auto rounded-2xl',
        'px-2 pt-3.5 lg:pt-2 pb-10 lg:pb-[52px]',
        'shadow-md transition-all duration-300 ease-in-out group-hover:scale-[1.01]',
        CARD_HOVER_SHADOW
      )}
      style={{
        border: '1.8px solid #FFF',
        backgroundImage: `${CARD_SPECKLE}, linear-gradient(180deg, #FFF 0%, #F2F4F9 100%)`,
      }}
    >
      <Rule bold />
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
        <Rule bold />
      </div>

      <div className="mt-3 lg:mt-4 flex items-center gap-2">
        <div className="w-[36px] h-[46px] lg:w-[46px] rounded-[5px] bg-[#C2CBDB]" />
        <div className="flex-1 space-y-2">
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
