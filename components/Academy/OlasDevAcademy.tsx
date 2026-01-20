import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';

export const OlasDevAcademy = () => (
  <SectionWrapper customClasses="bg-[url('/images/academy/olas-dev-academy.png')] bg-no-repeat bg-cover text-white">
    <div className="text-lg max-w-[740px] mx-auto py-20 flex flex-col gap-3 max-md:mx-6 max-lg:mx-12">
      <h4 className="font-machina mb-6 max-md:text-3xl text-4xl">Olas Dev Academy</h4>
      <p>
        The Olas Dev Academy is your gateway to learning how to build with the{' '}
        <Link className="text-valory-green font-semibold" href="#stack">
          Olas Stack
        </Link>
        . Whether you are an experienced Python developer looking for an intensive learning
        experience, or someone who prefers to learn at your own pace, we have the right path for
        you. Choose between our invite-only intensive program or self-paced YouTube training, and
        start building autonomous AI agents today.
      </p>
    </div>
  </SectionWrapper>
);
