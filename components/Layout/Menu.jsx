import { DOCS_BASE_URL } from "@/common-util/constants"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

const triggerStyle = navigationMenuTriggerStyle();

export function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
          <NavigationMenuItem>
              <Link href="/#ecosystem" legacyBehavior passHref>
                <NavigationMenuLink  className={triggerStyle}>
                  Ecosystem
                </NavigationMenuLink>
              </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/#resources" legacyBehavior passHref>
              <NavigationMenuLink className={triggerStyle}>
                Resources
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/whitepaper" legacyBehavior passHref>
              <NavigationMenuLink className={triggerStyle}>
                Whitepaper
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="https://contribute.olas.network/roadmap" legacyBehavior passHref>
              <NavigationMenuLink className={triggerStyle}>
                Roadmap ↗
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={DOCS_BASE_URL} legacyBehavior passHref>
              <NavigationMenuLink className={triggerStyle}>
                Docs ↗
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}