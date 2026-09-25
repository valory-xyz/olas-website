import type { IndexerUrls } from 'common-util/indexers';
import { SubgraphLink } from './SubgraphLink';

type IndexerLinksProps = {
  /** A `common-util/indexers` map. */
  urls: IndexerUrls;
  /** Only these chains; all of the map when omitted. */
  chains?: string[];
};

/** One link per chain of an indexer URL map, named after the chain. */
export const IndexerLinks = ({ urls, chains }: IndexerLinksProps) => (
  <>
    {Object.entries(urls)
      .filter(([chain]) => !chains || chains.includes(chain))
      .map(([chain, url]) => (
        <SubgraphLink key={chain} apiUrl={url} className="mr-2">
          {chain.charAt(0).toUpperCase() + chain.slice(1)}
        </SubgraphLink>
      ))}
  </>
);
