import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Tag } from 'components/ui/tag';
import Image from 'next/image';
import Link from 'next/link';

const cards = [
  {
    image: '/images/about/pearl.png',
    title: (
      <>
        Own Your Agent <br /> with Pearl
      </>
    ),
    link: '/pearl',
  },
  {
    image: '/images/about/mech-marketplace.png',
    title: (
      <>
        Hire or Monetize AI Agents <br />
        with Mech Marketplace
      </>
    ),
    link: '/mech-marketplace',
  },
  {
    image: '/images/about/olas-dao.png',
    title: 'Explore DAO Roles',
    link: '/olas-token#choose-your-role',
  },
  {
    image: '/images/about/olas-token.png',
    title: 'Get OLAS Token',
    link: '/olas-token',
  },
];

export const GetInvolved = () => (
  <SectionWrapper id="get-involved" backgroundType="GRAY_GRADIENT">
    <div className="max-w-[872px] mx-auto flex flex-col gap-10 md:gap-14">
      <Tag variant="primary" className="w-max self-center">
        Get Involved with Olas
      </Tag>

      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.link}>
            <Card className="relative activity-card-opaque flex items-center hover:bg-white duration-150 hover:cursor-pointer py-4 px-6 h-[136px] md:max-w-md w-full">
              <span className="text-lg font-medium">{card.title}</span>
              <Image
                src={card.image}
                alt={card.title}
                height={120}
                width={120}
                className="absolute bottom-0 right-0"
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
