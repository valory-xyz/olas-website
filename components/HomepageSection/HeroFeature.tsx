import { HERO_FEATURE } from 'common-util/constants';
import { cn } from 'lib/utils';
import Image from 'next/image';

// Temporary press feature under the hero subheading. Gated by isHeroFeatureActive.
export const HeroFeature = ({ className }: { className?: string }) => (
  <div className={cn('flex flex-col items-center gap-2 pointer-events-auto', className)}>
    <a
      href={HERO_FEATURE.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hero-feature-stack max-w-[92vw]"
    >
      <span className="hero-feature-ring" aria-hidden="true">
        <span className="hero-feature-ring-spin" />
      </span>
      <span className="hero-feature-pill">
        {HERO_FEATURE.headline}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
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
    </a>

    <div className="hero-feature-credit">
      <span>by</span>
      <Image
        src={HERO_FEATURE.logoSrc}
        alt={HERO_FEATURE.outlet}
        width={50}
        height={13}
        className="h-[13px] w-auto"
      />
    </div>
  </div>
);
