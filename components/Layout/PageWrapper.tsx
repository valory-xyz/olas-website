import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const PageWrapper = ({ children }) => (
  <>
    <Header />

    {children}
    <Footer />
  </>
);

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageWrapper;
