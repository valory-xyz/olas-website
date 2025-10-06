import {
  getActiveVeOlasHolders,
  getVeOlasLockedBalance,
} from 'common-util/api/tokenomics';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics } from 'components/MetricsCard';
import { Card } from 'components/ui/card';
import { ExternalLink, Link } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';

export const GovernMetrics = () => {
  const { data: metrics } = usePersistentSWR('governMetrics', () =>
    fetchMetrics([getVeOlasLockedBalance, getActiveVeOlasHolders]),
  );

  if (!metrics) {
    return null;
  }

  const items = [
    {
      key: 'lockedOlas',
      image: 'locked-olas.png',
      label: 'OLAS locked in veOLAS',
      value: Number(metrics[0]) || 0,
      href: '/data#govern-veolas',
      isExternal: false,
    },
    {
      key: 'veOlasHolders',
      image: 'veolas-holders.png',
      label: 'Total veOLAS holders',
      value: metrics[1],
      href: '/data#govern-veolas',
      isExternal: false,
    },
  ];

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      <Card className="lg:flex lg:flex-row grid grid-cols-1 mx-auto border border-purple-200 rounded-full text-xl rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center w-fit md:min-w-[440px]">
        {items.map((item, index) => (
          <div
            key={item.key}
            className={`mx-auto p-3 pb-5 md:p-8 md:pb-10 gap-6 flex flex-col items-center ${
              items.length > 1 && index === 0
                ? 'max-lg:border-b-1.5 lg:border-r-1.5 border-purple-200'
                : ''
            }`}
          >
            <div className="flex items-center">
              <Image
                alt={item.label}
                src={`/images/govern-page/${item.image}`}
                width={35}
                height={35}
                className="mr-4"
              />
              {item.label}
            </div>
            {renderValue(item)}
          </div>
        ))}
      </Card>
    </SectionWrapper>
  );
};

const renderValue = ({ value, href, isExternal }) => {
  if (!Number.isFinite(Number(value))) {
    return <span className="text-purple-600 text-6xl">--</span>;
  }

  const formatted = Number(value).toLocaleString();

  if (!href) {
    return (
      <span className="font-extrabold max-sm:text-4xl text-6xl">
        {formatted}
      </span>
    );
  }

  const linkProps = {
    className: 'font-extrabold max-sm:text-4xl text-6xl',
  };

  return isExternal ? (
    <ExternalLink {...linkProps} href={href} target="_blank" hideArrow>
      {formatted}
    </ExternalLink>
  ) : (
    <Link {...linkProps} href={href} hideArrow>
      {formatted}
    </Link>
  );
};
