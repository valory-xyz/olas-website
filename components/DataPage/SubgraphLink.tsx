import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import { ExternalLink } from 'components/ui/typography';

type SubgraphLinkProps = {
  children: React.ReactNode;
  /** The subgraph's query endpoint, e.g. a `NEXT_PUBLIC_*_SUBGRAPH_URL` value. */
  apiUrl?: string;
  className?: string;
};

/**
 * Names a subgraph on the data-verification page.
 *
 * Links to it when there is something to open — a Graph Explorer page, or our
 * proxy, which redirects GET to a playground. Legacy direct hosts only answer
 * POST, so linking those sends the reader to a blank 405; those render as the
 * chain name followed by the endpoint itself, which is what someone verifying a
 * metric needs in order to run the query below.
 */
export const SubgraphLink = ({ children, apiUrl, className = '' }: SubgraphLinkProps) => {
  const explorerUrl = getSubgraphExplorerUrl(apiUrl);

  if (explorerUrl) {
    return (
      <ExternalLink href={explorerUrl} className={className}>
        {children}
      </ExternalLink>
    );
  }

  return (
    <span className={`text-slate-700 ${className}`}>
      {children}
      {apiUrl ? (
        <>
          {' '}
          <code className="bg-gray-100 rounded px-1 py-0.5 text-sm break-all">{apiUrl}</code>
        </>
      ) : null}
    </span>
  );
};
