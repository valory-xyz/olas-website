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

    // @ts-expect-error TS(2322) FIXME: Type 'boolean | (() => void)' is not assignable to... Remove this comment to see the full error message
    <NavigationMenu.Root className={className} value={isOpened}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className="flex font-medium items-center group"

            // @ts-expect-error TS(2322) FIXME: Type 'boolean | (() => void)' is not assignable to... Remove this comment to see the full error message
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

          // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
          // @ts-expect-error TS(2322): Type '{ children: Element[]; value: boolean | (() ... Remove this comment to see the full error message
          // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; value: boolean | (() ... Remove this comment to see the full error message
          <NavigationMenu.Content value={isOpened}>
            <NavigationMenu.Sub
              value={isSubmenuExpanded ? 'group' : null}
              className="relative bg-white z-10"
            >
              <NavigationMenu.List className="max-h-[480px] overflow-scroll">
                {MENU_DATA.map((item, index) => {
                  if (item.link) {

                    // @ts-expect-error TS(2339) FIXME: Property 'isExternal' does not exist on type '{ li... Remove this comment to see the full error message
                    const LinkTag = item.isExternal ? 'a' : Link;
                    return (
                      <NavigationMenu.Item key={index}>
                        // @ts-expect-error TS(2322): Type 'boolean | (() => void)' is not assignable to... Remove this comment to see the full error message
                        // @ts-expect-error TS(2322) FIXME: Type 'boolean | (() => void)' is not assignable to... Remove this comment to see the full error message
                        <NavigationMenu.Trigger asChild onClick={toggleOpen}>
                          <LinkTag href={item.link} className={linkClassName}>
                            {item.text}
                            // @ts-expect-error TS(2304) FIXME: Cannot find name 'li'.
                            // @ts-expect-error TS(2339): Property 'isExternal' does not exist on type '{ li... Remove this comment to see the full error message
                            // @ts-expect-error TS(2339) FIXME: Property 'isExternal' does not exist on type '{ li... Remove this comment to see the full error message
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

                          // @ts-expect-error TS(2322) FIXME: Type 'boolean | (() => void)' is not assignable to... Remove this comment to see the full error message
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

                                  // @ts-expect-error TS(2322) FIXME: Type 'boolean | (() => void)' is not assignable to... Remove this comment to see the full error message
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
                  // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
                  // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
                  // @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message
                  <Button
                    variant="default"
                    size="lg"
                    asChild
                    className="w-full"
                    onClick={toggleOpen}
                  >
                    // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
                    // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
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
