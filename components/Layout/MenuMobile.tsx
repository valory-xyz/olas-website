import * as NavigationMenu from '@radix-ui/react-navigation-menu';
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

const useToggle = (): [boolean, () => void] => {
  const [state, setState] = useState(false);

  const toggle = () => {
    setState((prev) => !prev);
  };

  return [state, toggle];
};

type MenuMobileProps = {
  className?: string;
};

export const MenuMobile = ({ className }: MenuMobileProps) => {
  const [isOpened, toggleOpen] = useToggle();
  const [isSubmenuExpanded, toggleSubmenuExpand] = useToggle();

  return (
    <NavigationMenu.Root
      className={className}
      value={isOpened ? 'open' : 'closed'}
    >
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className="flex font-medium items-center group"
            onClick={toggleOpen}
          >
            {isOpened ? 'Close' : 'Menu'}
            {isOpened ? (
              <X size={20} className="ml-3 mr-2" aria-hidden="true" />
            ) : (
              <AlignJustify
                size={20}
                className="ml-3 mr-2"
                aria-hidden="true"
              />
            )}
          </NavigationMenu.Trigger>

          <NavigationMenu.Content>
            <NavigationMenu.Sub
              value={isSubmenuExpanded ? 'group' : null}
              className="relative bg-white z-10"
            >
              <NavigationMenu.List className="max-h-[480px] overflow-scroll">
                {MENU_DATA.map((item, index) => {
                  if (item.link) {
                    const menuItem = item as {
                      link: string;
                      text: string;
                      isExternal?: boolean;
                    };
                    const LinkTag = menuItem.isExternal ? 'a' : Link;
                    return (
                      <NavigationMenu.Item key={index}>
                        <NavigationMenu.Trigger asChild onClick={toggleOpen}>
                          <LinkTag
                            href={menuItem.link}
                            className={linkClassName}
                          >
                            {menuItem.text}
                            {menuItem.isExternal && (
                              <MoveUpRight size={24} aria-hidden="true" />
                            )}
                          </LinkTag>
                        </NavigationMenu.Trigger>
                      </NavigationMenu.Item>
                    );
                  }
                  if (item.submenu) {
                    return (
                      <NavigationMenu.Item value="group" key={index}>
                        <NavigationMenu.Trigger
                          className={cn(linkClassName, 'group')}
                          onClick={toggleSubmenuExpand}
                        >
                          {item.text}
                          <ChevronDown
                            className="transition duration-200 group-data-[state=open]:rotate-180"
                            size={24}
                            aria-hidden="true"
                          />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                          <ul>
                            {item.submenu.map((component) => (
                              <li key={component.title}>
                                <NavigationMenu.Link
                                  asChild
                                  onClick={toggleOpen}
                                >
                                  <Link
                                    href={component.url}
                                    className={subLinkClassName}
                                  >
                                    {component.title}
                                  </Link>
                                </NavigationMenu.Link>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenu.Content>
                      </NavigationMenu.Item>
                    );
                  }

                  return null;
                })}

                <NavigationMenu.Item className="p-6 border">
                  <Button
                    variant="default"
                    size="lg"
                    asChild
                    className="w-full"
                  >
                    <SubsiteLink href={PEARL_YOU_URL} isInButton>
                      Own Your Agent
                    </SubsiteLink>
                  </Button>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Sub>

            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div className="absolute top-full left-0 w-full">
        <NavigationMenu.Viewport className="relative w-full h-screen" />
      </div>
    </NavigationMenu.Root>
  );
};

MenuMobile.propTypes = {
  className: PropTypes.string,
};
MenuMobile.defaultProps = {
  className: null,
};
