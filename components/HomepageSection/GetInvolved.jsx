/* eslint-disable react/prop-types */
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const GET_INVOLVED_DATA = [
  {
    id: 1,
    imageSrc: '/images/homepage/get-involved.svg',
    title: 'Get involved',
    description:
      'Benefit from the Olas protocol, no \nmatter what you bring to the table.',
    colSpan: 2,
  },
  {
    id: 2,
    imageSrc: '/images/homepage/olas-token.svg',
    imageWidth: 277,
    imageHeight: 172,
    title: 'Get OLAS, use it across the \nnetwork',
    ctaText: 'Get OLAS',
    href: '/olas-token#get-olas',
  },
  {
    id: 3,
    imageSrc: '/images/homepage/olas-contribute.png',
    title: 'Grow awareness about \nOlas, earn points',
    ctaText: 'Contribute',
    href: '/contribute',
  },
  {
    id: 4,
    imageSrc: '/images/homepage/olas-launch.png',
    title: 'Define use cases, attract \nagent labor',
    ctaText: 'Launch',
    href: '/launch',
  },
  {
    id: 5,
    imageSrc: '/images/homepage/olas-build.png',
    title: 'Write agent code, \nget rewards',
    ctaText: 'Build',
    href: '/build',
  },
  {
    id: 6,
    imageSrc: '/images/homepage/olas-govern.png',
    title: 'Guide Olas',
    ctaText: 'Govern',
    href: '/govern',
  },
  {
    id: 7,
    imageSrc: '/images/homepage/olas-bond.png',
    title: 'Provide capital, get \ndiscounted OLAS',
    ctaText: 'Bond',
    href: '/bond',
  },
  {
    id: 8,
    imageSrc: '/images/homepage/olas-operate.png',
    title: 'Run agents, get rewards',
    ctaText: 'Operate',
    href: '/operate',
  },
];

const GetInvolved = () => (
  <SectionWrapper id="get-involved">
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {GET_INVOLVED_DATA.map((datum) => {
        const {
          imageSrc,
          imageHeight,
          imageWidth,
          title,
          description,
          ctaText,
          href,
          colSpan,
        } = datum;
        return (
          <GetInvolvedCard
            key={datum.id}
            imageSrc={imageSrc}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            title={title}
            description={description}
            ctaText={ctaText}
            href={href}
            colSpan={colSpan}
          />
        );
      })}
    </div>
  </SectionWrapper>
);

const GetInvolvedCard = ({
  imageSrc,
  imageWidth,
  imageHeight,
  title,
  description,
  ctaText,
  href,
  colSpan = 1,
}) => {
  const imageSizes = {
    width: colSpan === 1 ? imageWidth ?? 295 : 317,
    height: colSpan === 1 ? imageHeight ?? 110 : 276,
  };

  if (colSpan === 1 && href) {
    return (
      <Link href={href}>
        <Card className="border-1.5 border-gray-200 rounded-2xl p-6 flex flex-col justify-center hover:bg-gray-100 min-h-[278px]">
          {imageSrc && title && (
          <Image
            src={imageSrc}
            alt={title}
            width={imageSizes.width}
            height={imageSizes.height}
            className={`self-center object-contain max-h-[${imageSizes.height}px] mb-2`}
          />
          )}
          {title && <h3 className="text-2xl font-semibold whitespace-pre mb-2">{title}</h3>}
          {ctaText && (<span className="text-purple-600 text-lg mt-auto">{ctaText}</span>)}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="border-1.5 border-gray-200 rounded-2xl p-8 col-span-1 md:col-span-2 flex flex-col md:flex-row gap-10 justify-between">
      <div className="div flex flex-col justify-center order-2 md:order-1">
        <h3 className="text-3xl font-bold whitespace-pre mb-6">{title}</h3>
        {description && <p className="text-slate-700 whitespace-pre text-xl">{description}</p>}
      </div>
      {imageSrc && title && (
      <Image
        src={imageSrc}
        alt={title}
        width={imageSizes.width}
        height={imageSizes.height}
        className="order-1 md:order-2 self-center"
      />
      )}
    </Card>
  );
};

export default GetInvolved;
