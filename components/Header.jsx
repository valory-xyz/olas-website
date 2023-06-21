import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="p-4 bg-white flex items-center justify-between border-b border-primary">
      <Link href="/">
        <Image src="/images/olas-logo.svg" alt="logo"  width="158" height="88" />
      </Link>
    </header>
  );
}

export default Header;
