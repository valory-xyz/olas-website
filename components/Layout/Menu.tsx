import PropTypes from 'prop-types';
import Link from 'next/link';
import React from 'react';
import { cn } from 'lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from 'components/ui/navigation-menu';
import { MoveUpRight } from 'lucide-react';
import { MENU_DATA } from 'common-util/constants';

const triggerStyle = navigationMenuTriggerStyle();

const ListItem = React.forwardRef(
  // @ts-expect-error TS(2339) FIXME: Property 'className' does not exist on type '{}'.
  ({ className, title, children, ...props }, ref) => (
    <li>
      <NavigationMenuLink asChild>
        <a
          // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<unknown>' is not assignable to ... Remove this comment to see the full error message
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  ),
);

ListItem.displayName = 'ListItem';
ListItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
};

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
ListItem.defaultProps = {
  className: null,
};

export function Menu({ className }) {
  return (
    <NavigationMenu className={className}>
      {/* @ts-expect-error TS(2559) FIXME: Type '{ children: Element[]; }' has no properties ... Remove this comment to see the full error message */}
      <NavigationMenuList>
        {MENU_DATA.map((item, index) => {
          if (item.link) {
            // @ts-expect-error TS(2339) FIXME: Property 'isExternal' does not exist on type '{ li... Remove this comment to see the full error message
            const LinkTag = item.isExternal ? 'a' : NavigationMenuLink;
            return (
              <NavigationMenuItem key={index}>
                <Link href={item.link} legacyBehavior passHref>
                  <LinkTag className={triggerStyle}>
                    {item.text}
                    {/* @ts-expect-error TS(2339) FIXME: Property 'isExternal' does not exist on type '{ li... Remove this comment to see the full error message */}
                    {item.isExternal && (
                      <MoveUpRight
                        size={12}
                        className="ml-1"
                        aria-hidden="true"
                      />
                    )}
                  </LinkTag>
                </Link>
              </NavigationMenuItem>
            );
          }
          if (item.submenu) {
            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>{item.text}</NavigationMenuTrigger>
                {/* @ts-expect-error TS(2559) FIXME: Type '{ children: Element; }' has no properties in... Remove this comment to see the full error message */}
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {item.submenu.map((component) => (
                      // @ts-expect-error TS(2322) FIXME: Type '{ children: string; key: string; title: stri... Remove this comment to see the full error message
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.url}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return null;
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

Menu.propTypes = {
  className: PropTypes.string,
};
Menu.defaultProps = {
  className: null,
};
