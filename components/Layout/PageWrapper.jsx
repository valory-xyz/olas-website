import Header from './Header'
import Footer from './Footer'

const PageWrapper = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default PageWrapper;