import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { Card, CardTitle } from 'components/ui/card';
import Link from 'next/link';

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
    <div className="mt-6 max-w-screen-xl mx-auto">
      <SectionHeading>Govern</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {GOVERN_CARDS.map((card) => (
          <Card key={card.slug} className="p-6 bg-white flex flex-col justify-between text-center">
            <CardTitle>{card.title}</CardTitle>
            <Button variant="outline" size="lg" asChild className="mt-6">
              <Link href={`${card.url}`}>View</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  </>
);

export default Govern;
