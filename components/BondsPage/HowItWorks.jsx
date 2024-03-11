import { HowToSection } from '../ui/section/how-to';
import { ExternalLink, Link } from '../ui/typography';
import { CTA } from './utils';

const HowItWorks = () => {
  const sectionId = 'how-it-works';
  const heading = 'How it Works';
  const image = {
    alt: 'OLAS Utility',
    path: '/images/bonds-page/how-it-works.png',
    width: '500',
    height: '474',
  };
  const body = {
    steps: [
      <span>
        <ExternalLink href={CTA}>Browse</ExternalLink>
        {' '}
        for bonding products
      </span>,
      <span>
        Get LP tokens on the relevant exchange & if applicable
        <Link href="#bonding-details">bridge</Link>
        {' '}
        to Ethereum
      </span>,
      <span>
        Bond LP tokens via
        <ExternalLink href={CTA}>Tokenomics app</ExternalLink>
      </span>,
      'Wait for bond to mature, then claim discounted OLAS',
    ],
  };

  return (
    <HowToSection sectionId={sectionId} heading={heading} image={image} body={body} />
  );
};

export default HowItWorks;
