import { MENU_DATA, PEARL_YOU_URL } from 'common-util/constants';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';
import { cn } from 'lib/utils';
import { AlignJustify, ChevronDown, MoveUpRight, X } from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';

const linkClassName =
  'flex w-full items-center justify-between text-xl font-medium border-t px-6 py-4 text-black focus:bg-accent focus:outline-none';
const subLinkClassName =
  'flex w-full pl-14 pr-6 py-3 focus:bg-accent border-t text-slate-700 focus:text-black focus:outline-none';

type MenuMobileProps = {
  className?: string;
};

export const MenuMobile = ({ className }: MenuMobileProps) => {
  const [isOpened, setOpened] = useState(false);
  const [isSubmenuExpanded, setSubmenuExpanded] = useState(false);

  const close = () => setOpened(false);
  const toggleSubmenu = () => setSubmenuExpanded((prev) => !prev);

  return (
    <div className={className}>
      <button
        type="button"
        className="flex font-medium items-center group"
        onClick={() => setOpened((prev) => !prev)}
        aria-expanded={isOpened}
        aria-controls="mobile-menu-panel"
        id="mobile-menu-trigger"
      >
        {isOpened ? 'Close' : 'Menu'}
        {isOpened ? (
          <X size={20} className="ml-3 mr-2" aria-hidden="true" />
        ) : (
          <AlignJustify size={20} className="ml-3 mr-2" aria-hidden="true" />
        )}
      </button>

      {isOpened && (
        <div
          id="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-trigger"
          className="fixed inset-0 z-40"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden onClick={close} />
          <div className="pointer-events-none absolute inset-0 overflow-auto">
            <nav className="pointer-events-auto max-h-[480px] overflow-auto bg-white">
              {MENU_DATA.map((item, index) => {
                if (item.link) {
                  const menuItem = item as {
                    link: string;
                    text: string;
                    isExternal?: boolean;
                  };
                  const LinkTag = menuItem.isExternal ? 'a' : Link;
                  return (
                    <LinkTag
                      key={index}
                      href={menuItem.link}
                      className={linkClassName}
                      onClick={close}
                    >
                      {menuItem.text}
                      {menuItem.isExternal && <MoveUpRight size={24} aria-hidden="true" />}
                    </LinkTag>
                  );
                }
                if (item.submenu) {
                  return (
                    <div key={index}>
                      <button
                        type="button"
                        className={cn(linkClassName, 'group')}
                        onClick={toggleSubmenu}
                        aria-expanded={isSubmenuExpanded}
                      >
                        {item.text}
                        <ChevronDown
                          className={cn(
                            'transition duration-200',
                            isSubmenuExpanded && 'rotate-180'
                          )}
                          size={24}
                          aria-hidden="true"
                        />
                      </button>
                      {isSubmenuExpanded && (
                        <ul>
                          {item.submenu.map((component) => (
                            <li key={component.title}>
                              <Link
                                href={component.url}
                                className={subLinkClassName}
                                onClick={close}
                              >
                                {component.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
                return null;
              })}

              <div className="p-6 border" onClick={close}>
                <Button variant="default" size="lg" asChild className="w-full">
                  <SubsiteLink href={PEARL_YOU_URL} isInButton>
                    Own Your Agent
                  </SubsiteLink>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

MenuMobile.propTypes = {
  className: PropTypes.string,
};
MenuMobile.defaultProps = {
  className: null,
};
