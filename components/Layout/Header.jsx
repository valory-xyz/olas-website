import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from 'components/ui/button';
import { Menu } from './Menu';
// import { MenuMobileDrawer } from './MenuMobileDrawer';

const Header = () => (
  <header className="sticky top-0 z-50 border-b">
    <nav className="bg-white px-4 lg:px-6 py-2.5 ">
      <div className="grid grid-cols-2 sm:flex justify-start items-center mx-auto max-w-screen-xl gap-x-2 gap-y-4 sm:gap-10">
        <Link href="/" className="justify-self-start col-span-2">
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
        <Button variant="outline" size="lg" asChild className="ml-auto">
          <Link href="/#get-involved">Get involved</Link>
        </Button>
      </div>
    </nav>
  </header>
);

export default Header;
