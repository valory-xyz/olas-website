import Footer from './Footer';
import Header from './Header';
import OcbAgentBanner from './OcbAgentBanner';

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => (
  <>
    <OcbAgentBanner />
    <Header />

    {children}
    <Footer />
  </>
);

export default PageWrapper;
