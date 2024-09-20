import PropTypes from 'prop-types';
import { useState } from 'react';
import Link from 'next/link';
import { AlignJustify, ChevronDown, MoveUpRight, X } from 'lucide-react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';
import { MENU_DATA } from 'common-util/constants';

const linkClassName =
  'flex w-full items-center justify-between text-xl font-medium border-t px-6 py-4 text-black focus:bg-accent focus:outline-none';
const subLinkClassName =
  'flex w-full pl-14 pr-6 py-3 focus:bg-accent border-t text-slate-700 focus:text-black focus:outline-none';

const useToggle = () => {
  const [state, setState] = useState(false);

  const toggle = () => {
    setState((prev) => !prev);
  };

  return [state, toggle];
};

export const MenuMobile = ({ className }) => {
  const [isOpened, toggleOpen] = useToggle();
  const [isSubmenuExpanded, toggleSubmenuExpand] = useToggle();

  return (
    <NavigationMenu.Root className={className} value={isOpened}>
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

          <NavigationMenu.Content value={isOpened}>
            <NavigationMenu.Sub
              value={isSubmenuExpanded ? 'group' : null}
              className="relative bg-white z-10"
            >
              <NavigationMenu.List className="max-h-[480px] overflow-scroll">
                {MENU_DATA.map((item, index) => {
                  if (item.link) {
                    const LinkTag = item.isExternal ? 'a' : Link;
                    return (
                      <NavigationMenu.Item key={index}>
                        <NavigationMenu.Trigger asChild onClick={toggleOpen}>
                          <LinkTag href={item.link} className={linkClassName}>
                            {item.text}
                            {item.isExternal && (
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
                    variant="outline"
                    size="lg"
                    asChild
                    className="w-full"
                    onClick={toggleOpen}
                  >
                    <Link href="/#get-involved">Get involved</Link>
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
