import Image from 'next/image';
import Link from 'next/link';

/* eslint-disable react/prop-types */
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Card } from 'components/ui/card';

const GET_INVOLVED_DATA = [
  {
    id: 1,
    imageSrc: '/images/homepage/olas-contribute.png',
    title: 'Grow awareness about Olas',
    description: 'Promote Olas on X and earn points while doing so.',
    ctaText: 'Contribute',
    href: '/contribute',
  },
  {
    id: 2,
    imageSrc: '/images/homepage/olas-launch.png',
    title: 'Launch your own agent economy, boost DAAs',
    description:
      'Everything you need to launch an AI agent economy on your chain/protocol.',
    ctaText: 'Launch',
    href: '/launch',
  },
  {
    id: 3,
    imageSrc: '/images/homepage/olas-build.png',
    title: 'Build agents, get rewarded',
    description:
      'A permissionless developer rewards mechanism incentivises useful code contributions.',
    ctaText: 'Build',
    href: '/build',
  },
  {
    id: 4,
    imageSrc: '/images/homepage/olas-govern.png',
    title: 'Direct the future of Olas',
    description:
      'Join the decision-making process that drives growth in the Olas ecosystem.',
    ctaText: 'Govern',
    href: '/govern',
  },
  {
    id: 5,
    imageSrc: '/images/homepage/olas-bond.png',
    title: 'Provide liquidity, get discounted OLAS',
    description:
      'A bonding mechanism rewards providers of liquidity with discounted OLAS.',
    ctaText: 'Bond',
    href: '/bond',
  },
  {
    id: 6,
    imageSrc: '/images/homepage/olas-operate.png',
    title: 'Run agents, stake & earn rewards',
    description:
      'A unique staking mechanism rewards active agents for their useful contributions.',
    ctaText: 'Operate',
    href: '/operate',
  },
];

const GetInvolvedCard = ({
  id,
  imageSrc,
  imageWidth = 300,
  imageHeight = 124,
  title,
  description,
  ctaText,
  href,
}) => {
  return (
    <Link href={href}>
      <Card
        className="activity-card-opaque p-6 grid-flow-row min-h-[278px] h-full hover:bg-white duration-150"
        id={`get-involved-${id}`}
      >
        {imageSrc && title && (
          <div className="w-full min-h-[85px] md:max-h-[56px] lg:max-h-[96px] md:mb-3 xl:mb-10">
            <Image
              src={imageSrc}
              alt=""
              width={imageWidth}
              height={imageHeight}
              className="top-2 object-cover self-center w-full my-2"
            />
          </div>
        )}
        {ctaText && (
          <span className="text-purple-600 text-lg mt-auto">{ctaText}</span>
        )}
        {title && <h3 className="text-2xl font-semibold my-3">{title}</h3>}
        {description && <p className="text-[#4D596A]">{description}</p>}
      </Card>
    </Link>
  );
};

export const GetInvolved = () => (
  <div className="relative">
    <div className="activity-bg h-full bg-slate-100" />

    <SectionWrapper
      id="choose-your-role"
      customClasses="py-12 px-4 md:px-8 lg:p-24 relative z-10"
      backgroundType="NONE"
    >
      <div className="text-center max-w-[640px] mx-auto">
        <SectionHeading
          size="max-sm:text-5xl"
          color="text-gray-900"
          weight="font-bold"
          other="mb-12"
        >
          Get Involved in Growing Olas
        </SectionHeading>
        <p className="text-xl text-[#4D596A] mb-12">
          Choose a role and benefit from the Olas protocol, no matter what you
          bring to the table.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="md:p-6 flex flex-row col-span-1 md:col-span-2 lg:col-span-3 h-full">
          <Image
            src="/images/get-involved.png"
            alt="Get involved"
            width={920}
            height={595}
            className="mx-auto m-2"
          />
        </div>

        {GET_INVOLVED_DATA.map((datum) => {
          const {
            imageSrc,
            imageHeight,
            imageWidth,
            title,
            description,
            ctaText,
            href,
          } = datum;
          return (
            <GetInvolvedCard
              key={datum.id}
              id={datum.id}
              imageSrc={imageSrc}
              imageHeight={imageHeight}
              imageWidth={imageWidth}
              title={title}
              description={description}
              ctaText={ctaText}
              href={href}
            />
          );
        })}
      </div>
    </SectionWrapper>
  </div>
);
