import PropTypes from 'prop-types';
import Link from 'next/link';
import React from 'react';
import resources from 'data/resources.json';
import ecosystemItems from 'data/ecosystemItems.json';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { DOCS_BASE_URL } from '@/common-util/constants';

const triggerStyle = navigationMenuTriggerStyle();

const ListItem = React.forwardRef(({
  className, title, children, ...props
}, ref) => (
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
));

ListItem.displayName = 'ListItem';
ListItem.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
};
ListItem.defaultProps = {
  className: null,
};

// const NormalListItem = ({ className, title, children }) => {
//   <Link
//     className={cn(
//       `block select-none space-y-1 rounded-md p-3 leading-none no-underline
//       outline-none transition-colors hover:bg-accent hover:text-accent-foreground
//       focus:bg-accent focus:text-accent-foreground`,
//       className,
//     )}
//   >
//     <div className="text-sm font-medium leading-none">{title}</div>
//     <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//       {children}
//     </p>
//   </Link>;
// };

export function Menu({ className }) {
  // const [isMenuVisible, setIsMenuVisible] = useState(false);

  // const handleMenuClick = () => {
  //   setIsMenuVisible((prevState) => !prevState);
  // };

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={(event) => event.preventDefault()}>
            Ecosystem
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {ecosystemItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.url}
                >
                  {component.description}
                </ListItem>
              ))}
              <ListItem key="see-all-ecosystem-items" title="See all →" href="/#ecosystem">
                Browse all parts of the ecosystem
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={(event) => event.preventDefault()}>
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {resources.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.url}
                >
                  {component.description}
                </ListItem>
              ))}
              <ListItem key="see-all-resources" title="See all →" href="/#resources">
                Browse all resources
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link href="/videos" legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Videos & Podcasts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="md:pr-8 hidden md:block">
          <Link href={DOCS_BASE_URL} legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Docs ↗
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="border rounded-lg">
          <Link href="/#get-involved" legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Get involved
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
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
