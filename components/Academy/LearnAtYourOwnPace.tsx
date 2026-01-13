import { DISCORD_INVITE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const LearnAtYourOwnPace = () => (
  <SectionWrapper
    id="learn"
    customClasses="bg-[url('/images/academy/learn-at-your-own-pace.png')] bg-no-repeat bg-cover text-white"
  >
    <div className="text-lg max-w-[740px] mx-auto py-20 flex flex-col gap-3 max-md:mx-6 max-lg:mx-12">
      <Image
        src="/images/academy/youtube.png"
        alt="Academy"
        width={160}
        height={100}
        className="mb-6"
      />
      <p className="font-medium text-base text-[#ffffff99]">Olas Dev Academy</p>
      <span className="font-bold text-2xl">Learn at Your Own Pace</span>
      <p className="mb-6">
        Prefer a flexible approach? Our self-paced course on YouTube covers everything you need to
        know about building agents on the Olas Stack. Complete the course at your own speed, and
        join our active Discord community for support, questions, and feedback along the way.
        <br />
        This option is ideal for developers who want to explore the Olas Stack without committing to
        a full-time schedule.
      </p>
      <span className="font-bold text-[#ffffff99]">What you get out of it</span>
      <ul className="list-disc gap-y-2 flex flex-col ml-7 mb-8">
        <li>How to run, build and deploy your own agents.</li>
        <li>How to build your own autonomous service.</li>
      </ul>
      <span className="font-bold text-[#ffffff99]">Who this is for</span>
      <ul className="list-disc gap-y-2 flex flex-col ml-7 mb-8">
        <li>Experienced Python developer.</li>
        <li>Prefer a self-paced study approach.</li>
      </ul>
      <div className="flex gap-6 max-md:flex-col max-md:text-center">
        <Button
          variant="valory"
          size="xl"
          className="my-6 w-fit rounded-none border-valory-green text-valory-green"
        >
          <Link href="https://www.youtube.com/playlist?list=PLXztsZv11CTfXiQK9OJhMwBkfgf4ETZkl">
            Start course on Youtube
          </Link>
        </Button>
        <Button variant="valory" size="xl" className="my-6 w-fit rounded-none">
          <Link href={DISCORD_INVITE_URL}>Join Discord for support</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
