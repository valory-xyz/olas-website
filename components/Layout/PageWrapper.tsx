import Footer from './Footer';
import Header from './Header';

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => (
  <>
    <Header />

    {children}
    <Footer />
  </>
);

export default PageWrapper;
