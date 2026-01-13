import { DOCS_BASE_URL, PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

const list = [
  {
    title: 'Pearl',
    url: PEARL_YOU_URL,
    description: 'AI Agent App Store for consumers to own AI agents.',
    imgUrl: 'pearl-icon.png',
  },
  {
    title: 'Mech Marketplace',
    url: '/mech-marketplace',
    description: 'AI Agent Bazaar for businesses to monetize or hire agents on Olas.',
    imgUrl: 'mm-icon.png',
  },
  {
    title: 'Agent Frameworks',
    url: '/agents',
    description: 'Open-source tools for developers to build and deploy AI agents on Olas.',
    imgUrl: 'agent-icon.png',
  },
  {
    title: 'Olas Protocol',
    url: '/olas-token#protocol',
    description:
      'On-chain protocol that defines the core platform features and coordinates agent economies.',
    imgUrl: 'protocol-icon.png',
  },
];

export const StackKeyFeatures = () => (
  <SectionWrapper customClasses="xl:p-24 px-4 py-12 border-y" id="key-features">
    <div className="max-w-[872px] mx-auto flex flex-col gap-5">
      <p>
        The Olas Stack is the technical foundation of Olas. It consists of four core innovations:
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((item) => (
          <Link key={item.title} href={item.url}>
            <Card className="p-4 flex gap-4 w-full h-full lg:h-[100px] hover:bg-slate-100 duration-100 ease-in">
              <Image
                src={`/images/stack-page/${item.imgUrl}`}
                alt={item.title}
                height={48}
                width={48}
                className="w-[48px] h-[48px]"
              />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-[#4D596A]">{item.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <p>
        To learn more about each part of the stack, visit their relevant pages or the{' '}
        <SubsiteLink href={DOCS_BASE_URL}>technical documentation.</SubsiteLink>
      </p>
    </div>
  </SectionWrapper>
);
