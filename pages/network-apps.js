import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import NetworkApps from '@/components/Content/NetworkApps'
import PageWrapper from '@/components/Layout/PageWrapper';

const NetworkAppsPage = () => <PageWrapper>
  <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}><NetworkApps /></SectionWrapper>
</PageWrapper>;

export default NetworkAppsPage;