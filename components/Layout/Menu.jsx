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
  ({ className, title, children, ...props }, ref) => (
    <li>
      <NavigationMenuLink asChild>
        <a
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
ListItem.defaultProps = {
  className: null,
};

export function Menu({ className }) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {MENU_DATA.map((item, index) => {
          if (item.link) {
            const LinkTag = item.isExternal ? 'a' : NavigationMenuLink;
            return (
              <NavigationMenuItem key={index}>
                <Link href={item.link} legacyBehavior passHref>
                  <LinkTag className={triggerStyle}>
                    {item.text}
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
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {item.submenu.map((component) => (
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
