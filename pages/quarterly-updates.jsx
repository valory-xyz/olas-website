import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { Updates } from 'components/Content/Updates';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const BackButton = () => (
  <div className='w-fit mb-4 gap-2 text-purple-800'>
    <Link href='/blog' className='flex'>
      <ChevronLeft color='#7E22CE' /> Blog
    </Link>
  </div>
);

const UpdatesPage = () => (
  <PageWrapper>
    <Meta
      pageTitle='Quarterly Updates'
      description='Stay informed with our latest quarterly updates, featuring key insights, progress reports, and upcoming developments.'
    />
    <SectionWrapper>
      <BackButton />
      <Updates />
    </SectionWrapper>
  </PageWrapper>
);

export default UpdatesPage;
