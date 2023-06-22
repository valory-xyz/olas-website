import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="p-2 bg-white">
      <Link href="/">
        <Image src="/images/olas-logo.svg" alt="logo"  width="158" height="88" className='mx-auto' />
      </Link>
    </header>
  );
}

export default Header;
