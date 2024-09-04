import { Button } from 'components/ui/button';
import { BasicSection } from '../ui/section/basic';

const sectionId = 'build-with-olas';
const heading = 'Build with OLAS';
const image = {
  alt: 'OLAS Utility',
  path: '/images/build-page/get-started.png',
  width: 500,
  height: 474,
};

const buttonLinks = {
  exploreBuildPath: 'https://build.olas.network',
  visitTheDocs: 'https://docs.autonolas.network',
};

const pClass = 'text-xl font-light text-gray-600';

const body = (
  <div className="flex flex-col gap-5">
    <p className={pClass}>
      The Olas protocol is designed to reward developers who make useful code
      contributions.
    </p>
    <p className={pClass}>
      You can build full services, individual agents or even just AI tools and
      other code components.
    </p>

    {/* <div className="flex sm:flex-wrap md:flex-wrap justify-center w-full gap-6"> */}
    <div className='flex flex-wrap justify-stretch gap-6'>
      <Button
        variant="default"
        size="xl"
        asChild
        className="grow"
      >
        <a href={buttonLinks.exploreBuildPath}>Explore Build Paths</a>
      </Button>

      <Button
        variant="ghostPrimary"
        size="xl"
        asChild
        className="grow"
      >
        <a
          href={buttonLinks.visitTheDocs}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the Docs
        </a>
      </Button>
    </div>
  </div>
);

export const BuildWithOlas = () => (
  <BasicSection
    sectionId={sectionId}
    heading={heading}
    image={image}
    body={body}
  />
);
