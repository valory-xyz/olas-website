import Footer from './Footer';
import Header from './Header';
import PolystratBanner from './PolystratBanner';

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => (
  <>
    <PolystratBanner />
    <Header />

    {children}
    <Footer />
  </>
);

export default PageWrapper;
