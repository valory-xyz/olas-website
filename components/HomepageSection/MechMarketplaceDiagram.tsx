import { useEffect, useRef } from 'react';

import { initMechMarketplaceDiagram } from 'common-util/mech-marketplace-diagram';

import { MECH_MARKETPLACE_SVG } from './mechMarketplaceSvg';

// Module-level so its identity never changes: React 19 re-applies innerHTML whenever this
// object changes, which would wipe the elements and inline styles the motion script adds.
const SVG_HTML = { __html: MECH_MARKETPLACE_SVG };

/**
 * Animated Mech Marketplace diagram. The static SVG (the first deal highlighted) renders on the
 * server; the motion takes over after mount and is torn down on unmount. The markup is static
 * and ours, so injecting it is safe. Single instance per page — the SVG ids are fixed.
 */
export const MechMarketplaceDiagram = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const { dispose } = initMechMarketplaceDiagram(ref.current);
    return dispose;
  }, []);

  return (
    <div ref={ref} className="mm-root" data-running="false" dangerouslySetInnerHTML={SVG_HTML} />
  );
};
