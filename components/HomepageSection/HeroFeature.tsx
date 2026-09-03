import { HERO_FEATURE } from 'common-util/constants';
import { cn } from 'lib/utils';
import Image from 'next/image';

/**
 * Temporary press feature under the hero subheading — a pill linking to the
 * article, with the outlet credited beneath it. Self-expires: see
 * `isHeroFeatureActive`, resolved in `getStaticProps` so the date boundary
 * cannot cause a hydration mismatch.
 *
 * The animated rim is the same two-layer masked ring used by the 20M milestone
 * card, so the shimmer reads as the site's own accent rather than a new one.
 */
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
      {/* Sized to sit level with the 16px "by" beside it — the reel's own logos
          are far larger, so the shared asset needs its own scale here. */}
      <Image
        src={`/images/featured-in/${HERO_FEATURE.logoFilename}`}
        alt={HERO_FEATURE.outlet}
        width={104}
        height={13}
        className="h-[13px] w-auto"
      />
    </div>
  </div>
);
