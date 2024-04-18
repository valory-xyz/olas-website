import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import { Button } from 'components/ui/button';
import { ExternalLink, Link, Upcase } from 'components/ui/typography';
import { Card, CardTitle } from 'components/ui/card';
import SectionHeading from '../SectionHeading';

const innovations = [
  {
    title: 'Olas Protocol',
    image: '/images/olas-protocol.png',
    description:
      ' The on-chain protocol coordinates, incentivizes and guides different actors towards Olas’ goals.',
    link: {
      text: 'Learn about roles & incentives',
      href: 'https://docs.autonolas.network/protocol/',
      isExternal: true,
    },
  },
  {
    title: 'Olas Stack',
    image: '/images/olas-stack.png',
    description:
      'Open-source framework that enables developers to build autonomous agents that:',
    descriptionItems: [
      'run off-chain',
      'can be co-owned',
      'are highly robust and transparent',
      'benefit from modularity',
    ],
    link: {
      text: 'Learn more',
      href: 'https://docs.autonolas.network/open-autonomy/',
      isExternal: true,
    },
  },
];

const TheTech = () => (
  <SectionWrapper
    customClasses="text-center py-24 px-4 border-b"
    backgroundType="SUBTLE_GRADIENT"
  >
    <Upcase><span>The Tech</span></Upcase>
    <SectionHeading color="text-gray-900">
      Enabled by two core innovations
    </SectionHeading>
    <div className="grid md:grid-cols-2 gap-4 max-w-screen-xl mx-auto mb-16">
      {innovations.map((item) => (
        <Card
          className="grid grid-cols-5 gap-6 p-6 bg-white items-center"
          key={item.title}
        >
          <Image
            alt={item.title}
            src={item.image}
            width={275}
            height={200}
            className="object-contain col-span-2"
          />
          <div className="col-span-3 text-start">
            <CardTitle className="mb-4 lg:text-3xl"><span>{item.title}</span></CardTitle>
            <p className="mb-4">
              {item.description}              
            </p>
            {item.descriptionItems && item.descriptionItems.length > 0 && (
                <ul className="list-disc pl-5 mb-4">
                  {item.descriptionItems.map((descriptionItem) => (
                    <li key={descriptionItem}>{descriptionItem}</li>
                  ))}
                </ul>
              )}
            {item.link.isExternal ? (
              <ExternalLink href={item.link.href}>
                {item.link.text}
              </ExternalLink>
            ) : (
              <Link href={item.link.href}>{item.link.text}</Link>
            )}
          </div>
        </Card>
      ))}
    </div>
    <Button variant="outline" size="xl" asChild>
      <Link href="/learn">See more use cases</Link>
    </Button>
  </SectionWrapper>
);

export default TheTech;
