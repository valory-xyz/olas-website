import PropTypes from 'prop-types';
import Image from 'next/image';
import Header from './Header';
import Footer from './Footer';

const PageWrapper = ({ children }) => (
  <>
    <div className="bg-purple-900 text-white p-2 flex justify-center items-center">
      <h2 className="flex items-center text-xl">
        <Image
          src="/images/operate-page/operate-app-icon.png"
          alt="logo"
          width="48"
          height="48"
          className="mr-2"
        />
        NEW Olas Pearl: A simple desktop app for running an agent and staking
        OLAS.
        <a
          href="https://operate.olas.network"
          rel="noopener noreferrer"
          target="_blank"
          className="underline ml-2"
        >
          Learn more
        </a>
      </h2>
    </div>
    <Header />

    {children}
    <Footer />
  </>
);

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageWrapper;
