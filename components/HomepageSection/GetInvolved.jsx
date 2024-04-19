/* eslint-disable react/prop-types */
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const GET_INVOLVED_DATA = [
  {
    id: 1,
    imageSrc: '/images/homepage/get-involved.svg',
    title: 'Get involved',
    description:
      'Benefit from the Olas protocol, \nno matter what you bring to the table.',
    colSpan: 2,
  },
  {
    id: 2,
    imageSrc: '/images/homepage/olas-token.svg',
    title: 'Get OLAS, \nuse it across the network',
    buttonText: 'Get OLAS',
    buttonUrl: '/olas-token#get-olas',
  },
  {
    id: 3,
    imageSrc: '/images/homepage/olas-contribute.png',
    title: 'Grow awareness, \nget points',
    buttonText: 'Contribute',
    buttonUrl: 'https://contribute.olas.network',
  },
  {
    id: 4,
    imageSrc: '/images/homepage/olas-launch.svg',
    title: 'Define use cases, \nattract agent labor',
    buttonText: 'Launch',
    buttonUrl: '/launch',
  },
  {
    id: 5,
    imageSrc: '/images/homepage/olas-dev-rewards.png',
    title: 'Write agent code, \nget rewards',
    buttonText: 'Build',
    buttonUrl: '/build',
  },
  {
    id: 6,
    imageSrc: '/images/homepage/olas-govern.png',
    title: 'Guide Olas',
    buttonText: 'Govern',
    buttonUrl: '/govern',
  },
  {
    id: 7,
    imageSrc: '/images/homepage/olas-bonds.svg',
    title: 'Provide capital, \nget discounted OLAS',
    buttonText: 'Bond',
    buttonUrl: '/bond',
  },
  {
    id: 8,
    imageSrc: '/images/homepage/olas-operate.svg',
    title: 'Run agents, \nget rewards',
    buttonText: 'Operate',
    buttonUrl: '/operate',
  },
];

const GetInvolved = () => (
  <SectionWrapper id="get-involved">
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {GET_INVOLVED_DATA.map((datum) => {
        const {
          imageSrc,
          title,
          description,
          buttonText,
          buttonUrl,
          colSpan,
        } = datum;
        return (
          <GetInvolvedCard
            key={datum.id}
            imageSrc={imageSrc}
            title={title}
            description={description}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
            colSpan={colSpan}
          />
        );
      })}
    </div>
  </SectionWrapper>
);

const GetInvolvedCard = ({
  imageSrc,
  title,
  description,
  buttonText,
  buttonUrl,
  colSpan = 1,
}) => {
  const imageSizes = {
    width: colSpan === 1 ? 400 : 364,
    height: colSpan === 1 ? 200 : 364,
  };

  if (colSpan === 1) {
    return (
      <Card className="border rounded-sm p-8 flex flex-col justify-center gap-10">
        {imageSrc && title && (
        <Image
          src={imageSrc}
          alt={title}
          width={imageSizes.width}
          height={imageSizes.height}
        />
        )}
        {title && <h3 className="text-2xl font-bold whitespace-pre">{title}</h3>}
        {buttonUrl && buttonText && (
        <Button variant="outline" size="xl" asChild className="mt-auto">
          <Link href={buttonUrl}>{buttonText}</Link>
        </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="border rounded-sm p-8 col-span-1 md:col-span-2 flex flex-col md:flex-row gap-10">
      <div className="div flex flex-col justify-center order-2 md:order-1">
        <h3 className="text-2xl font-bold whitespace-pre mb-4">{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {imageSrc && title && (
      <Image
        src={imageSrc}
        alt={title}
        width={imageSizes.width}
        height={imageSizes.height}
        className="order-1 md:order-2"
      />
      )}
    </Card>
  );
};

export default GetInvolved;
