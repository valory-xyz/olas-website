import Link from 'next/link';
import { BasicSection } from '../ui/section/basic';
import { Button } from '../ui/button';

const sectionId = 'build-with-olas';
const heading = 'Build with OLAS';
const image = {
  alt: 'OLAS Utility',
  path: '/images/dev-rewards-page/get-started.png',
  width: '500',
  height: '474',
};
const links = {
  exploreBuildPath: 'https://build.olas.network',
  visitTheDocs: '#',
};

const body = (
  <div className="flex flex-col gap-5">
    <p>The Olas protocol is designed to reward developers who make useful code contributions.</p>
    <p>You can build full services, individual agents or even just AI tools and other code components.</p>
    <div className="flex gap-5">
      <Button href={links.exploreBuildPath}>Explore Build Paths</Button>
      <Link href={links.visitTheDocs}>Visit the Docs</Link>
    </div>
  </div>
);

const BuildWithOlas = () => <BasicSection sectionId={sectionId} heading={heading} image={image} body={body} />;
export default BuildWithOlas;
