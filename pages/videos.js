import PageWrapper from '@/components/Layout/PageWrapper';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import Videos from '@/components/Content/Videos'
import Head from 'next/head';

const VideosPage = () =>
  <PageWrapper>
    {/* <Head>
      <title>Olas | Videos</title>
    </Head> */}
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}><Videos /></SectionWrapper>
  </PageWrapper>
  ;

export default VideosPage;