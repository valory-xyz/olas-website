import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import addresses from 'data/tokens.json';
import Link from 'next/link';

const { ChevronDown, Copy } = require('lucide-react');
const { default: Image } = require('next/image');
const { useState, useRef, useEffect, useCallback } = require('react');

// For mobile view
const TokenDropdown = ({ activeTab, setActiveTab, setCurrentAddress }) => {
  const activeItem = addresses.find((item) => item.name === activeTab);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="flex md:hidden text-left w-full mb-4 relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full h-12 flex items-center justify-between gap-3 bg-white rounded-lg p-3 border border-[#D7DDEA]"
        onClick={() => setOpenDropdown((prevValue) => !prevValue)}
        aria-expanded={openDropdown}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          {activeItem && (
            <Image
              src={`/images/homepage/addresses/${activeItem.activeSrc}`}
              alt={activeItem.name}
              width={20}
              height={20}
            />
          )}
          <span>{activeTab}</span>
        </div>
        <ChevronDown size={24} />
      </button>

      {openDropdown && (
        <div
          className="absolute w-full z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {addresses.map((address, index) => (
              <button
                key={index}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex flex-row gap-2"
                role="menuitem"
                onClick={() => {
                  setOpenDropdown(false);
                  setActiveTab(address.name);
                  setCurrentAddress(address.address);
                }}
              >
                <Image
                  src={`/images/homepage/addresses/${address.src}`}
                  alt={address.name}
                  width={20}
                  height={20}
                />
                {address.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// For desktop view
const TokenTabs = ({ activeTab, setActiveTab, setCurrentAddress }) => (
  <div className="hidden md:flex flex-row mb-6">
    {addresses.map((address) => {
      const activeClass =
        activeTab === address.name ? 'border-purple-700 selected-button' : 'border-transparent';
      const imageSrc = activeTab === address.name ? address.activeSrc : address.src;
      return (
        <button
          key={address.name}
          onClick={() => {
            setActiveTab(address.name);
            setCurrentAddress(address.address);
          }}
          className={`opaque-button max-sm:text-sm font-medium transition-colors w-full w-[66px] h-[44px] border-b-4 hover:border-slate-500 ${activeClass}`}
        >
          <Image
            src={`/images/homepage/addresses/${imageSrc}`}
            alt={address.name}
            width={20}
            height={20}
            className="mx-auto aspect-square min-w-[20px]"
          />
        </button>
      );
    })}
  </div>
);

export const TokenAddress = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(addresses[0].name);
  const [currentAddress, setCurrentAddress] = useState(addresses[0].address);

  const getTokenAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy to clipboard: ', error);
    }
  }, [currentAddress]);

  return (
    <div className="place-items-center mt-20">
      <Card
        className="card-opaque w-[90%] md:w-[648px] mx-auto pt-4 p-6 flex flex-col"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(24px)',
          boxShadow: [
            '0px 6px 12px 0px rgba(151, 164, 186, 0.11)',
            '0px 22px 22px 0px rgba(151, 164, 186, 0.1)',
            '0px 50px 30px 0px rgba(151, 164, 186, 0.06)',
            '0px 88px 35px 0px rgba(151, 164, 186, 0.02)',
            '0px 138px 39px 0px rgba(151, 164, 186, 0)',
          ].join(', '),
        }}
      >
        <TokenDropdown
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentAddress={setCurrentAddress}
        />
        <TokenTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentAddress={setCurrentAddress}
        />
        <div className="text-left flex flex-col gap-4">
          <p className="text-slate-600 text-medium">Token address on {activeTab}</p>
          <div className="text-lg flex flex-row gap-3 place-items-center">
            <Image src="/images/olas-token-logo.png" alt="olas-token" width={28} height={32} />
            <p className="break-all">{currentAddress}</p>
            <button
              onClick={getTokenAddress}
              className="p-1 place-items-center w-8 h-8 border rounded-md border-slate-300"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </Card>
      {copied && (
        <Card className="fixed bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 z-50 bg-white shadow-lg">
          Copied to clipboard
        </Card>
      )}
      {/* No z-index here: the Card's backdrop-filter forms a stacking context,
          and elevated buttons would show through its expanded dropdown. */}
      <div className="flex flex-row gap-4 mt-14 w-fit mx-auto">
        <Button variant="default" size="lg" asChild>
          <Link href="/olas-token#token-details">Get OLAS</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/olas-token">Tokenomics</Link>
        </Button>
      </div>
    </div>
  );
};
