import { TEXT_MEDIUM_LIGHT_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card, CardTitle } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const programs = [
  {
    title: 'Olas Dev Academy – Intensive Program',
    image: '/images/build-page/academy-program.jpg',
    description:
      'Invite-only 4-week intensive program designed for experienced Python developers who are ready to learn agent creation on the Olas Stack. Full-time commitment required.',
  },
  {
    title: 'Olas Dev Academy – Self-Paced Study',
    image: '/images/build-page/academy-study.png',
    description:
      'Self-paced course on YouTube that covers everything you need to know about building agents on the Olas Stack. Complete the course at your own speed.',
  },
  {
    title: 'Olas Dev Kickstart',
    image: '/images/build-page/dev-kickstart.jpg',
    description: (
      <>
        Get exposure and hands-on experience to Olas Stack by building{' '}
        <Link href="/agents/ai-mechs" target="_blank" rel="noreferrer" className="text-purple-600">
          Mech tools
        </Link>{' '}
        with our Dev Kickstart workshop.
      </>
    ),
  },
];

export const NewToOlas = () => (
  <SectionWrapper
    backgroundType="NONE"
    customClasses="bg-gradient-to-t from-[#E7EAF4] to-[#F8F9FC] py-16 md:py-24 px-4 border-b"
    id="learn"
  >
    <div className="w-auto lg:max-w-[700px] mx-auto">
      <p className={`${TEXT_MEDIUM_LIGHT_CLASS} text-center mb-3`}>NEW TO OLAS STACK?</p>
      <h2 className="font-extrabold text-4xl lg:mb-6 xl:mb-8 my-6 lg:my-auto text-center">
        Learn with Valory structured programs
      </h2>
      <p className="text-gray-600 text-center mx-auto mb-12">
        If you&apos;re new to the Olas Stack and seeking a guided learning experience, check our
        Olas Academy Website and choose the right program for you:
      </p>
    </div>

    <div className="grid md:grid-cols-3 md:gap-x-4 gap-y-4 max-w-5xl max-w-full xl:mx-auto xl:w-[1200px]">
      {programs.map((item) => (
        <Card
          className="bg-[#F8F9FC] flex flex-col overflow-hidden w-full border-t border-white rounded-2xl"
          key={item.title}
        >
          <Image
            src={item.image}
            alt={item.title}
            width={495}
            height={260}
            className="rounded-lg p-2 object-cover w-full"
          />
          <div className="p-6">
            <CardTitle className="mb-4 md:max-w-[230px]  mx-auto text-center">
              <span>{item.title}</span>
            </CardTitle>
            <div className="text-start">{item.description}</div>
          </div>
        </Card>
      ))}

      {/* <div className="mx-auto md:col-span-3 justify-center mt-8">
        <Button
          variant="default"
          size="xl"
          asChild
          className="whitespace-normal max-sm:max-w-auto text-center max-sm:h-auto max-sm:py-2"
        >
          <a href={`${VALORY_URL}/academy`}>
            Explore Valory&apos;s structured programs
          </a>
        </Button>
      </div> */}
    </div>
  </SectionWrapper>
);
