import { BasicSection } from '../ui/section/basic';
import { Button } from '../Button';

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
    <div className="flex gap-5">
      <Button href={buttonLinks.exploreBuildPath} isExternal>
        Explore Build Paths
      </Button>
      <Button href={buttonLinks.visitTheDocs} type="secondary" isExternal>
        Visit the Docs
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
