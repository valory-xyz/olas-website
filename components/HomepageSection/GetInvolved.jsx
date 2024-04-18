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
      'Benefit from the Olas protocol, no matter what you bring to the table.',
    colSpan: 2,
  },
  {
    id: 2,
    imageSrc: '/images/homepage/olas-token.svg',
    title: 'Get OLAS, use it across the network',
    buttonText: 'Get OLAS',
    buttonUrl: '/olas-token#get-olas',
  },
  {
    id: 3,
    imageSrc: '/images/homepage/olas-contribute.png',
    title: 'Grow awareness about Olas, earn points',
    buttonText: 'Contribute',
    buttonUrl: 'https://contribute.olas.network',
  },
  {
    id: 4,
    imageSrc: '/images/homepage/olas-launch.svg',
    title: 'Define use cases, attract agent labor',
    buttonText: 'Launch',
    buttonUrl: 'https://olas.network/launch',
  },
  {
    id: 5,
    imageSrc: '/images/homepage/olas-dev-rewards.png',
    title: 'Write agent code, get rewards',
    buttonText: 'Build',
    buttonUrl: 'https://build.olas.network',
  },
  {
    id: 6,
    imageSrc: '/images/homepage/olas-govern.png',
    title: 'Guide Olas',
    buttonText: 'Govern',
    disabled: true,
  },
  {
    id: 7,
    imageSrc: '/images/homepage/olas-bonds.svg',
    title: 'Provide capital, get discounted OLAS',
    buttonText: 'Bond',
    buttonUrl: 'https://bond.olas.network',
  },
  {
    id: 8,
    imageSrc: '/images/homepage/olas-operate.svg',
    title: 'Run agents, get rewards',
    buttonText: 'Operate',
    buttonUrl: 'https://operate.olas.network',
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
          disabled,
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
            disabled={disabled}
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
  buttonUrl = '#',
  disabled = false,
  colSpan = 1,
}) => {
  const imageSizes = {
    width: colSpan === 1 ? 400 : 364,
    height: colSpan === 1 ? 200 : 364,
  };

  if (colSpan === 1) {
    return (
      <Card className="border rounded-sm p-8 flex flex-col justify-center gap-10">
        <Image
          src={imageSrc}
          alt={title}
          width={imageSizes.width}
          height={imageSizes.height}
        />
        <h3 className="text-2xl font-bold">{title}</h3>
        {buttonUrl && buttonText && (
        <Button variant="outline" size="xl" asChild disabled={disabled} className="mt-auto">
          <Link href={buttonUrl} disabled>{buttonText}</Link>
        </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="border rounded-sm p-8 col-span-1 md:col-span-2 flex flex-col md:flex-row gap-10">
      <div className="div flex flex-col justify-center order-2 md:order-1">
        <h3 className="text-2xl font-bold">{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <Image
        src={imageSrc}
        alt={title}
        width={imageSizes.width}
        height={imageSizes.height}
        className="order-1 md:order-2"
      />
    </Card>
  );
};

export default GetInvolved;
