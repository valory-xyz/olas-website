import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Menu } from './Menu';
// import { MenuMobileDrawer } from './MenuMobileDrawer';

const Header = () => (
  <header className="sticky top-0 z-50 border-b">
    <nav className="bg-white px-4 lg:px-6 py-2.5 ">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl ">
        <Link href="/">
          <Image
            src="/images/olas-logo.svg"
            alt="logo"
            width="120"
            height="60"
            className="mx-auto"
          />
        </Link>
        <Menu />
        {/* <MenuMobileDrawer /> */}
      </div>
    </nav>
  </header>
);

export default Header;
