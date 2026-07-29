import Footer from './Footer';
import Header from './Header';
import ConnectBanner from './ConnectBanner';

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => (
  <>
    <ConnectBanner />
    <Header />

    {children}
    <Footer />
  </>
);

export default PageWrapper;
