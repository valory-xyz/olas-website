import { useRouter } from 'next/router';
import Footer from './Footer';
import Header from './Header';
import PolystratBanner from './PolystratBanner';

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  const router = useRouter();
  const isHomepage = router.pathname === '/';

  return (
    <>
      {isHomepage && <PolystratBanner />}
      <Header />

      {children}
      <Footer />
    </>
  );
};

export default PageWrapper;
