import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from './Menu';
import { MenuMobile } from './MenuMobile';

const Header = () => (
  <header className="sticky top-0 z-50 border-b">
    <nav className="bg-white px-4 lg:px-6 md:py-2.5 ">
      <div className="flex justify-between md:justify-start items-center mx-auto max-w-screen-xl gap-x-2 gap-y-4 sm:gap-10">
        <Link href="/" className="justify-self-start col-span-2">
          <Image
            src="/images/olas-logo.svg"
            alt="logo"
            width="120"
            height="60"
            className="mx-auto"
          />
        </Link>
        <Menu className="hidden md:block" />
        <MenuMobile className="md:hidden" />
        {/* @ts-expect-error TS(2304) FIXME: Cannot find name 'children'. */}{' '}
        {/* @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message */}{' '}
        {/* @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message */}{' '}
        <Button
          variant="default"
          size="lg"
          asChild
          className="hidden md:inline-flex ml-auto"
        >
          <Link href="/#pearl">Own Your Agent</Link>
        </Button>
      </div>
    </nav>
  </header>
);

export default Header;
