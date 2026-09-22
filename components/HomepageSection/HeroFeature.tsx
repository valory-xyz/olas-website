import { HERO_FEATURE } from 'common-util/constants';
import { cn } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const CARD_HOVER_SHADOW =
  'group-hover:[box-shadow:0_32px_9px_0_rgba(88,92,101,0.00),0_21px_8px_0_rgba(88,92,101,0.01),0_11px_7px_0_rgba(88,92,101,0.03),0_5px_5px_0_rgba(88,92,101,0.05),0_1px_3px_0_rgba(88,92,101,0.06)]';

const CARD_SPECKLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.63 0 0 0 0 0.68 0 0 0 0 0.78 8 0 0 0 -5.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23d)'/%3E%3C/svg%3E\")";

const PURPLE = 'text-[#7A2ADB]';
const MUTED = 'text-[#7B8698]';

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className={cn('text-[11px] lg:text-[16px] leading-none text-center', MUTED)}>{children}</div>
);

const ModelName = () => (
  <div
    className={cn('mt-1 text-[11px] lg:text-[13px] font-semibold leading-none text-center', PURPLE)}
  >
    {HERO_FEATURE.model}
  </div>
);

const CARD_FRAME = {
  border: '1.8px solid #FFF',
  backgroundImage: `${CARD_SPECKLE}, linear-gradient(180deg, #FFF 0%, #F2F4F9 100%)`,
};

export const HeroFeature = ({ className }: { className?: string }) => {
  const words = HERO_FEATURE.headline.split(' ');
  const lastWord = words[words.length - 1];
  const headlineStart = words.slice(0, -1).join(' ');

  return (
    <Link href={HERO_FEATURE.url} className={cn('block group', className)}>
      <div
        className={cn(
          'w-[140px] lg:w-[180px] mx-auto rounded-2xl',
          'px-2.5 pt-3 pb-3 lg:px-3 lg:pt-3.5 lg:pb-3.5',
          'shadow-md transition-all duration-300 ease-in-out group-hover:scale-[1.01]',
          CARD_HOVER_SHADOW
        )}
        style={CARD_FRAME}
      >
        <Eyebrow>New model</Eyebrow>
        <Image
          src={HERO_FEATURE.imageSrc}
          alt=""
          width={600}
          height={465}
          className="mx-auto mt-6 mb-4 w-[88px] lg:w-[110px] h-auto saturate-[.55] opacity-80"
        />
        <ModelName />
      </div>

      {/* The arrow is glued to the last word so it never wraps on its own. */}
      <div className="mx-auto mt-3 w-[180px] lg:w-[230px] text-center text-xs lg:text-sm font-medium leading-snug text-gray-900">
        {headlineStart}{' '}
        <span className="whitespace-nowrap">
          {lastWord}
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
        </span>
      </div>
    </Link>
  );
};
