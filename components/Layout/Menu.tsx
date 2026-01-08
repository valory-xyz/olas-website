import { MENU_DATA } from 'common-util/constants';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from 'components/ui/navigation-menu';
import { cn } from 'lib/utils';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const triggerStyle = navigationMenuTriggerStyle();

interface ListItemProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  href?: string;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
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

interface MenuProps {
  className?: string;
}

export function Menu({ className }: MenuProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {MENU_DATA.map((item, index) => {
          if (item.link) {
            const menuItem = item as {
              link: string;
              text: string;
              isExternal?: boolean;
            };
            const LinkTag = menuItem.isExternal ? 'a' : NavigationMenuLink;
            return (
              <NavigationMenuItem key={index}>
                <Link href={menuItem.link} legacyBehavior passHref>
                  <LinkTag className={triggerStyle}>
                    {menuItem.text}
                    {menuItem.isExternal && (
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
