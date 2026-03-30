import type { OgImage } from './load-public-image';
import type { OgMetricLine, OgTemplateMode } from './registry';

export type OgImageTemplateProps = {
  title: string;
  description: string;
  template: OgTemplateMode;
  metrics: OgMetricLine[];
  backgroundSrc: string;
  illustration: OgImage | null;
  /** 'inline' renders above the title; 'side' renders in a right column (default). */
  illustrationPosition?: 'inline' | 'side';
};

const OLAS_TEXT_PATH =
  'M68.6151 38.9189C64.8789 38.9189 61.653 38.1058 58.9374 36.48C56.2392 34.8542 54.1545 32.5794 52.6844 29.6563C51.2314 26.7331 50.5049 23.3341 50.5049 19.4596C50.5049 15.585 51.2314 12.186 52.6844 9.26255C54.1545 6.33945 56.2392 4.06488 58.9374 2.43893C61.653 0.812977 64.8789 0 68.6151 0C72.3516 0 75.5689 0.812977 78.2671 2.43893C80.9827 4.06488 83.0673 6.33945 84.52 9.26255C85.9905 12.186 86.7257 15.585 86.7257 19.4596C86.7257 23.3341 85.9905 26.7331 84.52 29.6563C83.0673 32.5794 80.9827 34.8542 78.2671 36.48C75.5689 38.1058 72.3516 38.9189 68.6151 38.9189ZM68.6151 32.277C70.9852 32.3114 72.9569 31.8011 74.5309 30.7461C76.1049 29.6907 77.2812 28.1945 78.0596 26.2573C78.8553 24.32 79.2533 22.0542 79.2533 19.4596C79.2533 16.865 78.8553 14.6162 78.0596 12.7137C77.2812 10.8108 76.1049 9.33206 74.5309 8.27676C72.9569 7.22164 70.9852 6.67675 68.6151 6.64216C66.2454 6.60757 64.2737 7.11784 62.6997 8.17296C61.1257 9.22812 59.9406 10.7243 59.1449 12.6616C58.3666 14.5988 57.9773 16.865 57.9773 19.4596C57.9773 22.0542 58.3666 24.3026 59.1449 26.2055C59.9406 28.108 61.1257 29.5871 62.6997 30.6421C64.2737 31.6975 66.2454 32.2422 68.6151 32.277ZM90.3483 38.1406V0H97.4056V38.1406H90.3483ZM110.892 38.9189C108.886 38.9189 107.182 38.5383 105.781 37.7773C104.397 36.999 103.342 35.9697 102.616 34.6898C101.906 33.3925 101.552 31.9655 101.552 30.4085C101.552 29.1116 101.751 27.9265 102.148 26.8541C102.546 25.7817 103.186 24.839 104.068 24.0259C104.968 23.1958 106.17 22.5037 107.675 21.9503C108.713 21.5696 109.95 21.2324 111.385 20.9384C112.821 20.6443 114.447 20.3676 116.263 20.1082C118.079 19.8315 120.077 19.5288 122.257 19.1999L119.714 20.6012C119.714 18.9406 119.316 17.7211 118.521 16.9428C117.725 16.1645 116.393 15.7752 114.525 15.7752C113.487 15.7752 112.406 16.0258 111.281 16.5274C110.157 17.0294 109.37 17.92 108.92 19.1999L102.538 17.1761C103.247 14.8585 104.579 12.973 106.533 11.52C108.488 10.0669 111.152 9.34041 114.525 9.34041C116.998 9.34041 119.195 9.72105 121.115 10.4823C123.035 11.2433 124.488 12.558 125.474 14.4261C126.027 15.4637 126.356 16.5017 126.46 17.5393C126.564 18.5773 126.616 19.7363 126.616 21.0162V38.1406H120.44V32.3806L121.323 33.5739C119.956 35.4594 118.477 36.8259 116.886 37.6734C115.312 38.5039 113.314 38.9189 110.892 38.9189ZM112.397 33.3664C113.695 33.3664 114.784 33.1418 115.666 32.692C116.566 32.2248 117.275 31.6975 117.794 31.1093C118.33 30.5212 118.693 30.0282 118.883 29.6302C119.247 28.8693 119.455 27.987 119.506 26.9838C119.576 25.9632 119.61 25.1157 119.61 24.441L121.686 24.96C119.593 25.3058 117.898 25.5999 116.6 25.8422C115.303 26.0671 114.257 26.2746 113.461 26.4648C112.665 26.6553 111.965 26.8628 111.359 27.0877C110.667 27.3644 110.105 27.6672 109.673 27.9957C109.258 28.3072 108.946 28.653 108.739 29.0337C108.548 29.414 108.453 29.8377 108.453 30.3049C108.453 30.9449 108.609 31.4983 108.92 31.9655C109.249 32.4153 109.707 32.7612 110.296 33.0032C110.884 33.2454 111.584 33.3664 112.397 33.3664ZM142.235 38.9189C138.707 38.9189 135.853 38.1232 133.673 36.5318C131.511 34.9234 130.196 32.6573 129.729 29.7341L136.943 28.6444C137.237 29.959 137.885 30.988 138.889 31.7319C139.909 32.4758 141.197 32.8478 142.754 32.8478C144.034 32.8478 145.02 32.6055 145.712 32.1212C146.404 31.6196 146.75 30.9275 146.75 30.0456C146.75 29.4919 146.612 29.0507 146.335 28.7222C146.058 28.3763 145.436 28.0388 144.467 27.7103C143.515 27.3818 142.028 26.9494 140.004 26.413C137.721 25.8248 135.896 25.1675 134.529 24.441C133.163 23.7148 132.177 22.8499 131.571 21.8467C130.966 20.8261 130.664 19.5979 130.664 18.1623C130.664 16.3633 131.122 14.8064 132.039 13.492C132.955 12.1599 134.244 11.1393 135.905 10.4302C137.583 9.70367 139.554 9.34041 141.82 9.34041C144.017 9.34041 145.963 9.67794 147.658 10.3523C149.353 11.0271 150.72 11.9872 151.758 13.2323C152.813 14.4779 153.461 15.9483 153.704 17.6433L146.491 18.9406C146.37 17.9026 145.92 17.0812 145.141 16.4756C144.363 15.8704 143.308 15.5158 141.976 15.4119C140.679 15.3254 139.632 15.4985 138.836 15.9309C138.058 16.3633 137.669 16.9859 137.669 17.799C137.669 18.2832 137.833 18.6896 138.162 19.0185C138.508 19.347 139.208 19.6845 140.263 20.0304C141.336 20.3763 142.962 20.8261 145.141 21.3795C147.269 21.9329 148.973 22.5815 150.253 23.3254C151.55 24.052 152.493 24.9342 153.081 25.9719C153.669 26.9925 153.963 28.2293 153.963 29.6823C153.963 32.5537 152.925 34.8108 150.849 36.454C148.774 38.0975 145.902 38.9189 142.235 38.9189Z';

function olasWordmark(w: number, h: number) {
  return (
    <svg width={w} height={h} viewBox="0 0 154 39" fill="none">
      <path d={OLAS_TEXT_PATH} fill="#7E22CE" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 12.57V3.35059H42.067V12.57H0Z"
        fill="#7E22CE"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 24.4016V15.182H42.067V24.4016H0Z"
        fill="#7E22CE"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 36.2328V27.0132H18.8195V36.2328H0Z"
        fill="#7E22CE"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.2476 36.2328V27.0132H42.067V36.2328H23.2476Z"
        fill="#7E22CE"
      />
    </svg>
  );
}

/**
 * Layout for @vercel/og / Satori — keep CSS minimal (no complex gradients or filters)
 * to avoid runtime failures across platforms.
 */
export function OgImageTemplate({
  title,
  description,
  template,
  metrics,
  backgroundSrc,
  illustration,
  illustrationPosition,
}: OgImageTemplateProps) {
  let content: React.JSX.Element;

  if (template === 'home') {
    content = (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 64,
        }}
      >
        {olasWordmark(462, 117)}
        <div
          style={{
            fontSize: 45,
            fontFamily: 'Inter',
            fontWeight: 500,
            color: '#574C67',
            textAlign: 'center',
          }}
        >
          {description}
        </div>
      </div>
    );
  } else if (template === 'simple') {
    content = (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '48px 56px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 18,
            fontWeight: 500,
            fontFamily: 'Inter',
            color: '#574C67',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {olasWordmark(190, 48)}
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontFamily: 'Inter',
              fontWeight: 600,
              color: '#000',
              lineHeight: 1.2,
              letterSpacing: '-2.4px',
              textAlign: 'center',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    );
  } else {
    const hasMetrics = metrics.length > 0;
    const pos = illustrationPosition ?? 'side';
    const sideIllustration = illustration && pos === 'side';
    const inlineIllustration = illustration && pos === 'inline';
    content = (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          padding: '48px 64px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            bottom: 30,
            flex: sideIllustration ? '1 1 55%' : '1 1 100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: 600,
          }}
        >
          {inlineIllustration ? (
            <div style={{ display: 'flex', position: 'relative', top: 45, right: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={title}
                src={illustration.src}
                width={illustration.width}
                height={illustration.height}
              />
            </div>
          ) : null}
          <div
            style={{
              fontSize: 98,
              fontFamily: 'Inter',
              fontWeight: 600,
              color: '#000',
              lineHeight: 1.2,
              letterSpacing: '-1.96px',
              marginBottom: 32,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 32,
              fontWeight: 500,
              fontFamily: 'Inter',
              color: '#574C67',
            }}
          >
            <span style={{ marginRight: 16 }}>Powered by</span>
            {olasWordmark(120, 30)}
          </div>
        </div>
        {/* Right side: illustration or metric cards */}
        {sideIllustration ? (
          <div
            style={{
              flex: '0 0 40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 24,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={title}
              src={illustration.src}
              width={illustration.width}
              height={illustration.height}
            />
          </div>
        ) : null}
        {hasMetrics ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: 24,
            }}
          >
            {metrics.slice(0, 2).map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  width: 476,
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(255, 255, 255, 0.20)',
                  borderRadius: 56,
                  padding: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 48,
                    padding: '36px 48px',
                    boxShadow:
                      '0 72px 43px 0 rgba(147, 121, 160, 0.05), 0 32px 32px 0 rgba(147, 121, 160, 0.09), 0 8px 18px 0 rgba(147, 121, 160, 0.10)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 104,
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      color: '#7E22CE',
                      lineHeight: 1.2,
                    }}
                  >
                    {row.value}
                  </span>
                  <span
                    style={{
                      fontSize: 32,
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      color: '#574C67',
                      marginTop: 16,
                    }}
                  >
                    {row.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={backgroundSrc}
        width={1200}
        height={630}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1200px',
          height: '630px',
          backgroundColor: '#7E22CE',
          objectFit: 'cover',
        }}
      />
      {content}
    </div>
  );
}
