import Image from 'next/image';
import Link from 'next/link';

/* eslint-disable react/prop-types */
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import SectionHeading from 'components/SectionHeading';

const GET_INVOLVED_DATA = [
  {
    id: 1,
    imageSrc: '/images/homepage/olas-contribute.png',
    title: 'Grow awareness about Olas',
    description:
    'Promote Olas on X and earn points while doing so.',
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
  {
    id: 7,
    imageSrc: '/images/homepage/olas-token.svg',
    title: 'Get OLAS, use it across the network',
    description: 'Olas provides access to the core functions of the network.',
    ctaText: 'Get OLAS',
    href: '/olas-token',
    colSpan: 3,
  },
];

const CARD_BG = 'border-1.5 border-gray-200 rounded-2xl p-6 bg-gradient-to-t from-[#EEF0F7] to-[#FCFCFD] hover:from-[#F1DBFF] hover:to-[#FDFAFF] hover:border-[#EFCFFF] hover:-translate-y-2 ease-in-out transition duration-150';

const GetInvolved = () => (
  <SectionWrapper id="get-involved" customClasses="py-12 px-4 md:px-8 lg:p-24">
    <div className="text-center">
      <SectionHeading 
        size="max-sm:text-5xl"
        color="text-gray-900" 
        weight="font-bold" 
        other="mb-12"
      >
        Choose your role & get involved
      </SectionHeading>
      <p className="text-xl text-[#4D596A] mb-12">Benefit from Olas protocol, no matter what you bring to the table.</p>
    </div>

    <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <Card className="max-sm:border-none max-sm:shadow-none border-1.5 border-gray-200 rounded-2xl md:p-6 flex flex-row col-span-1 md:col-span-2 lg:col-span-3 h-full">
        <Image
          src="/images/homepage/get-involved-diagram.png"
          width={920}
          height={595}
          className="mx-auto m-2"
        />
      </Card>

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
  imageWidth = 300,
  imageHeight = 124,
  title,
  description,
  ctaText,
  href,
  colSpan = 1,
}) => {
  if (colSpan === 1 && href) {
    return (
      <Link href={href}>
        <Card className={`${CARD_BG} grid-flow-row justify-items-center min-h-[278px] h-full`}>
          {imageSrc && title && (
            <div className="w-full min-h-[85px] md:max-h-[56px] lg:max-h-[96px] md:mb-3 xl:mb-10">
              <Image
                src={imageSrc}
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
  }

  return (
    <Link className="col-span-1 md:col-span-2 lg:col-span-3" href={href}>
      <Card className={`${CARD_BG} h-full flex `}>

        <div className="justify-center md:grid md:grid-flow-col flex-col">
          <Image
            src={imageSrc}
            alt={title}
            width={130}
            height={130}
            className="max-sm:mx-auto max-sm:max-h-[110px] md:pr-4 max-sm:mb-2"
          />
          <div className="pl-2 flex flex-col gap-3">
            {title && (<h3 className="text-2xl font-semibold">{title}</h3>)}
            {description && <p className="text-[#4D596A]">{description}</p>}
            {ctaText && (
            <span className="text-purple-600 text-lg max-sm:order-first">{ctaText}</span>
            )}
          </div>
        </div>

      </Card>
    </Link>
  );
};

export default GetInvolved;
