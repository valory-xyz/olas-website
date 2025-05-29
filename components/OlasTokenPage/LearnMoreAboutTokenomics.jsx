import {
  CORE_TECHNICAL_DOCUMENT,
  WHITEPAPER_SUMMARY,
} from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';

const list = [
  {
    title: 'Tokenomics Dev Documentation',
    urlName: 'Learn more',
    url: 'https://docs.autonolas.network/protocol/tokenomics/',
    isExternal: true,
  },
  {
    title: 'Olas Whitepaper',
    urlName: 'Learn more',
    url: WHITEPAPER_SUMMARY,
    isExternal: true,
  },
  {
    title: 'Tokenomics Whitepaper',
    urlName: 'Learn more',
    url: CORE_TECHNICAL_DOCUMENT,
    isExternal: true,
  },
];

export const LearnMoreAboutTokenomics = () => (
  <GetInvolvedCards title="Learn more about tokenomics" list={list} />
);
