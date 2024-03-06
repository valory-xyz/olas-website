import { DOCS_BASE_URL } from '@/common-util/constants';
import { Button } from '../ui/button';
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter, DrawerClose,
} from '../ui/drawer';

const menuItems = [
  {
    title: 'Ecosystem',
    description: 'Explore the various parts of the ecosystem',
    url: '/#ecosystem',
  },
  {
    title: 'Video & Podcasts',
    description: 'Watch and listen to the latest content',
    url: '/#video-podcasts',
  },
  {
    title: 'Blog',
    description: 'Read the latest articles',
    url: '/blog',
  },
  {
    title: 'Resources',
    description: 'Find guides, docs, and more',
    url: '/resources',
  },
  {
    title: 'Docs',
    description: 'Dive into the documentation',
    url: DOCS_BASE_URL,
  },
  {
    title: 'Get Involved',
    description: 'Learn how you can participate in the network',
    url: '/#get-involved',
  },
];

export const MenuMobileDrawer = () => (
  <Drawer className="md:hidden">
    <DrawerTrigger>Menu</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <DrawerClose>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>

);
