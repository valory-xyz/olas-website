import { DOCS_BASE_URL } from "@/common-util/constants"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";
import Link from "next/link"
import React from 'react';
import resources from 'data/resources.json';
import ecosystemItems from 'data/ecosystemItems.json';

const triggerStyle = navigationMenuTriggerStyle();

const menuItems = [
  {
    title: "Ecosystem",
    description: "Explore the various parts of the ecosystem",
    url: "/#ecosystem",
  },
  {
    title: "Video & Podcasts",
    description: "Watch and listen to the latest content",
    url: "/#video-podcasts",
  },
  {
    title: "Blog",
    description: "Read the latest articles",
    url: "/blog",
  },
  {
    title: "Resources",
    description: "Find guides, docs, and more",
    url: "/resources",
  },
  {
    title: "Docs",
    description: "Dive into the documentation",
    url: DOCS_BASE_URL,
  },
  {
    title: "Get Involved",
    description: "Learn how you can participate in the network",
    url: '/#get-involved',
  },
]

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
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
  )
});
ListItem.displayName = 'ListItem';

export function Menu({ className }) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>Ecosystem</NavigationMenuTrigger>
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
              <ListItem key='see-all-ecosystem-items' title="See all →" href="/#ecosystem">
                Browse all parts of the ecosystem
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link href='/videos' legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Videos & Podcasts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link href='/blog' legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
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
              <ListItem key='see-all-resources' title="See all →" href="/#resources">
                Browse all resources
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block md:pr-8">
          <Link href={DOCS_BASE_URL} legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Docs ↗
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block border rounded-lg">
          <Link href={'/#get-involved'} legacyBehavior passHref>
            <NavigationMenuLink className={triggerStyle}>
              Get involved
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="md:hidden">
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {menuItems.map((component) => (
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}