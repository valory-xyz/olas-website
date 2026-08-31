import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import { ExternalLink } from 'components/ui/typography';

type SubgraphLinkProps = {
  children: React.ReactNode;
  /** The subgraph's query endpoint, e.g. a `NEXT_PUBLIC_*_SUBGRAPH_URL` value. */
  apiUrl?: string;
  className?: string;
};

/**
 * Names a subgraph on the data-verification page, linking to its Graph
 * Explorer page when one exists.
 *
 * Subgraphs served from The Graph's gateway have a browsable Explorer entry.
 * Self-hosted ones do not — they only answer POST — so those render as plain
 * text rather than as a link that resolves to a 405.
 */
export const SubgraphLink = ({ children, apiUrl, className = '' }: SubgraphLinkProps) => {
  const explorerUrl = getSubgraphExplorerUrl(apiUrl);

  if (!explorerUrl) {
    return <span className={`text-slate-700 ${className}`}>{children}</span>;
  }

  return (
    <ExternalLink href={explorerUrl} className={className}>
      {children}
    </ExternalLink>
  );
};
