import Updates from 'components/Content/Updates';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const BackButton = () => (
  <div className="w-fit mb-4 gap-2 text-purple-800">
    <Link href="/blog" className="flex">
      <ChevronLeft color="#7E22CE" /> Blog
    </Link>
  </div>
);

const UpdatesPage = () => (
  <PageWrapper>
    <Meta pageTitle="Quarterly Reviews" />
    <SectionWrapper>
      <BackButton />
      <Updates />
    </SectionWrapper>
  </PageWrapper>
);

export default UpdatesPage;
