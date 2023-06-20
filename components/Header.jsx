import Image from 'next/image';
import React from 'react';

const Header = () => {
  return (
    <header className="p-4 bg-white flex items-center justify-between">
      <div>
        <Image src="/images/olas-logo.svg" alt="logo"  width="158" height="88" />
      </div>
    </header>
  );
}

export default Header;
