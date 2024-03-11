import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

const PageWrapper = ({ children }) => (
  <>
    <div className="bg-purple-900 text-white p-4 flex justify-center items-center">
      <h2 className="text-xl">
        Olas Staking: The Engine for the Autonomous Agent Economy. Powered by PoAA 💥🦾💥.
        {' '}
        <a href="https://staking.olas.network" rel="noopener noreferrer" target="_blank" className="underline">Learn more</a>
      </h2>
    </div>
    <Header />
    {children}
    <Footer />
  </>
);

PageWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PageWrapper;
