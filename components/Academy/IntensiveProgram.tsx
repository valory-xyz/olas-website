import { AcademyTable } from 'components/AcademyTable';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const IntensiveProgram = () => (
  <SectionWrapper
    id="intensive-program"
    customClasses="bg-[url('/images/academy/intensive-program.png')] bg-no-repeat bg-cover text-white"
  >
    <div className="text-lg max-w-[740px] mx-auto py-20 flex flex-col gap-3 max-md:mx-6 max-lg:mx-12">
      <Image
        src="/images/academy/laptop.png"
        alt="Academy"
        width={160}
        height={100}
        className="mb-6"
      />
      <p className="font-medium text-base text-[#ffffff99]">Olas Dev Academy</p>
      <span className="font-bold text-2xl">Intensive Program</span>
      <p className="mb-6">
        Our invite-only 4-week intensive program is designed for experienced Python developers who
        are ready to learn agent creation on the Olas Stack. This full-time program offers hands-on
        training and direct support from the Olas development team, allowing you to gain a
        comprehensive understanding of the Olas Stack.
        <br />
        Participation is by invite only, ensuring a focused and committed group of learners. If you
        meet the requirements and are interested in this opportunity, show your interest by filling
        out the form.
      </p>
      <span className="font-bold text-[#ffffff99]">What you get out of it</span>
      <ul className="list-disc gap-y-2 flex flex-col ml-7 mb-8">
        <li>How to run, build and deploy your own agents.</li>
        <li>
          How to build your own{' '}
          <Link className="text-valory-green font-semibold" href="#learn">
            autonomous service
          </Link>
          .
        </li>
        <li>
          Academy graduates will be matched with external projects looking for builders to build
          agents for them, while receiving personalized, expert coaching from the creators of the
          framework.
        </li>
      </ul>
      <span className="font-bold text-[#ffffff99]">Who this is for</span>
      <ul className="list-disc gap-y-2 flex flex-col ml-7 mb-8">
        <li>Experienced Python developer.</li>
        <li>Able to commit full-time for 4 weeks.</li>
      </ul>
      <span className="font-bold text-[#ffffff99]">A Track Record of Success</span>
      <p>
        Since its inception, the Academy has consistently delivered impactful results. Here&apos;s a
        snapshot of our accomplishments:
      </p>
      <AcademyTable />
      <Button
        variant="default"
        size="xl"
        className="my-6 w-fit rounded-none text-black border-valory-green bg-valory-green hover:border-black hover:bg-black hover:text-white"
      >
        <Link href="https://forms.gle/GnPABVfd9t7URFyZ6">Show your interest</Link>
      </Button>
    </div>
  </SectionWrapper>
);
