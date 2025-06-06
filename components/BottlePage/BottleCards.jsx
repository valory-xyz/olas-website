import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

const cards = [
  {
    title: 'Build the Future of Crypto x AI',
    imgSrc: 'valory-hiring.png',
    description:
      'Valory creates open-source infrastructure for co-owned AI and is a core contributor to Olas.',
    buttonText: 'View Open Roles',
    isExternal: true,
    buttonUrl: 'https://wellfound.com/company/valory-3',
  },
  {
    title: 'Listen to the Latest Crypto x AI News',
    imgSrc: 'au-podcast.png',
    description:
      'Dive into the updates from the Olas ecosystem, with insights from builders and devs.',
    buttonText: 'Listen Now',
    buttonUrl: '/agents-unleashed#podcasts',
  },
];

export const BottleCards = () => (
  <SectionWrapper
    id="cards"
    backgroundType="NONE"
    customClasses={`${SECTION_BOX_CLASS} border-b bg-slate-100`}
  >
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit mx-auto">
        {cards.map(
          ({
            title,
            imgSrc,
            description,
            buttonText,
            isExternal = false,
            buttonUrl,
          }) => (
            <Card key={title} className="bg-white p-8 rounded-2xl lg:w-[424px]">
              <div className="flex flex-col gap-8 h-full">
                <div className="text-3xl text-center font-bold">{title}</div>
                <Image
                  src={`/images/bottle/${imgSrc}`}
                  alt={title}
                  width={360}
                  height={200}
                />
                <p>{description}</p>
                <Button
                  variant="outline"
                  asChild
                  className="px-4 py-1 mt-auto text-base w-fit mx-auto"
                >
                  {isExternal ? (
                    <ExternalLink href={buttonUrl} hideArrow>
                      <p className="text-black">{buttonText}</p>
                    </ExternalLink>
                  ) : (
                    <Link href={buttonUrl}>{buttonText}</Link>
                  )}
                </Button>
              </div>
            </Card>
          ),
        )}
      </div>
    </div>
  </SectionWrapper>
);
