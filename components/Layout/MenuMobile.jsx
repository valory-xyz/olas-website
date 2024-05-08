import PropTypes from 'prop-types';
import { useState } from 'react';
import Link from 'next/link';
import {
  AlignJustify, ChevronDown, MoveUpRight, X,
} from 'lucide-react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import resources from 'data/resources.json';
import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';

const linkClassName = 'flex w-full items-center justify-between text-xl font-medium border-t px-6 py-4 text-black focus:bg-accent focus:outline-none';
const subLinkClassName = 'flex w-full pl-14 pr-6 py-3 focus:bg-accent border-t text-slate-700 focus:text-black focus:outline-none';

export const MenuMobile = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <NavigationMenu.Root className={className}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="flex font-medium items-center group">
            <span className="group-data-[state=open]:hidden">Menu</span>
            <span className="group-data-[state=closed]:hidden">Close</span>
            {' '}
            <AlignJustify size={20} className="ml-3 mr-2 group-data-[state=open]:hidden" aria-hidden="true" />
            <X size={20} className="ml-3 mr-2 group-data-[state=closed]:hidden" aria-hidden="true" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Sub
              value={isExpanded ? 'group' : null}
              className="relative bg-white z-10"
            >
              <NavigationMenu.List className="max-h-[480px] overflow-scroll">
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger asChild>
                    <Link href="/learn" className={linkClassName}>
                      Learn
                    </Link>
                  </NavigationMenu.Trigger>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                  <NavigationMenu.Trigger asChild>
                    <Link href="/explore" className={linkClassName}>
                      Explore
                    </Link>
                  </NavigationMenu.Trigger>
                </NavigationMenu.Item>

                <NavigationMenu.Item value="group">
                  <NavigationMenu.Trigger
                    className={cn(linkClassName, 'group')}
                    onClick={() => setIsExpanded((prev) => (!prev))}
                  >
                    Resources
                    {' '}
                    <ChevronDown
                      className="transition duration-200 group-data-[state=open]:rotate-180"
                      size={24}
                      aria-hidden="true"
                    />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <ul>
                      {resources.map((component) => (
                        <li key={component.title}>
                          <NavigationMenu.Link asChild>
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

                <NavigationMenu.Item>
                  <NavigationMenu.Trigger asChild>
                    <a href="https://contribute.olas.network/roadmap" className={linkClassName}>
                      Roadmap
                      {' '}
                      <MoveUpRight size={24} aria-hidden="true" />
                    </a>
                  </NavigationMenu.Trigger>
                </NavigationMenu.Item>

                <NavigationMenu.Item className="p-6 border">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="w-full"
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
