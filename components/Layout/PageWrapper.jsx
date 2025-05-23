import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const PageWrapper = ({ children }) => (
  <>
    <div className="bg-purple-700 text-white p-2 flex justify-center items-center">
      <h2 className="flex items-center text-xl">
        <Image
          src="/images/pearl-page/operate-app-icon.png"
          alt="logo"
          width="48"
          height="48"
          className="mr-2"
        />

        <Link href="/pearl#download" className="hover:underline ml-2">
          Live Now: Pearl, the &quot;Agent App Store&quot;
          <ChevronRight className="ml-2 inline" size={20} />
        </Link>
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
