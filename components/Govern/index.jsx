import Meta from 'components/Meta';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import Link from 'next/link';
import { H1 } from 'components/ui/typography';
import SectionWrapper from 'components/Layout/SectionWrapper';

const GOVERN_CARDS = [
  {
    slug: 'snapshot',
    title: 'Snapshot',
    url: 'https://snapshot.org/#/autonolas.eth',
  },
  {
    slug: 'boardroom',
    title: 'Boardroom',
    url: 'https://boardroom.io/autonolas/',
  },
  {
    slug: 'vote-escrow',
    title: 'Get veOLAS',
    url: 'https://member.olas.network/',
  },
];

const Govern = () => (
  <>
    <Meta pageTitle="Olas Govern" />
    <SectionWrapper backgroundType="NONE">
      <div className="max-w-screen-xl mx-auto">
        <H1>Govern</H1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {GOVERN_CARDS.map((card) => (
            <Card key={card.slug} className="p-6 bg-white flex flex-col justify-between text-center">
              <h3 className="font-bold text-xl">{card.title}</h3>
              <Button variant="outline" size="lg" asChild className="mt-6">
                <Link href={`${card.url}`}>View</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  </>
);

export default Govern;
