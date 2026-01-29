import { Card } from 'components/ui/card';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { ExternalLink, Link } from 'components/ui/typography';
import Image from 'next/image';

type MetricsBubbleProps = {
  isUnderConstruction?: boolean;
  metrics?: {
    id: string;
    subText: string | React.ReactNode;
    value?: string | null;
    source?: {
      link: string;
      isExternal?: boolean;
    };
    status?: {
      stale: boolean;
      lastValidAt: number | null;
      indexingErrors: string[];
      fetchErrors: string[];
      laggingSubgraphs: string[];
    };
  }[];
  image?: string;
  title: string;
};

export const MetricsBubble = ({
  isUnderConstruction,
  metrics,
  image,
  title,
}: MetricsBubbleProps) => {
  return (
    <Card className="p-8 border border-slate-200 rounded-full text-xl w-full rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col">
      {isUnderConstruction && (
        <Image
          src="/images/under-construction.svg"
          alt="Under Construction"
          width={163}
          height={28}
          className="mb-4"
        />
      )}
      <div className="mt-auto">
        {image && <Image alt={title} src={image} width="48" height="48" className="mb-4" />}

        <div className="text-lg font-medium mb-6">{title}</div>

        <div className="flex flex-col gap-8">
          {metrics.map((item) => {
            const value = !metrics || item.value === null ? '--' : item.value;
            const source =
              item.source && value !== '--' ? (
                item.source.isExternal ? (
                  <ExternalLink href={item.source.link} hideArrow>
                    <span className={`${item.status?.stale ? 'text-gray-400' : ''}`}>{value}</span>
                    <span className="text-2xl">↗</span>
                  </ExternalLink>
                ) : (
                  <Link href={item.source.link}>
                    <span className={`${item.status?.stale ? 'text-gray-400' : ''}`}>{value}</span>
                  </Link>
                )
              ) : (
                value
              );

            return (
              <div key={item.id} className="flex flex-col gap-3">
                <span className="block text-base text-slate-700">{item.subText}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`block text-2xl font-semibold ${item.status?.stale ? 'text-gray-400' : 'text-purple-600'}`}
                  >
                    {source}
                  </span>
                  <StaleIndicator status={item.status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

MetricsBubble.defaultProps = {
  isUnderConstruction: false,
  metrics: undefined,
  image: undefined,
};
