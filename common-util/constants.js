import resources from 'data/resources.json';

export const DOCS_BASE_URL = 'https://docs.autonolas.network';
export const LAUNCH_CONTACT_URL = 'https://t.me/pahlmeyer';

export const MENU_DATA = [
  { link: '/learn', text: 'Learn' },
  { link: '/explore', text: 'Explore' },
  { text: 'Resources', submenu: resources },
  { link: 'https://contribute.olas.network/roadmap', text: 'Roadmap', isExternal: true },
];
