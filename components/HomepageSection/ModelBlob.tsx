import { useEffect, useId, useMemo, useRef } from 'react';

import { initModelBlobMotion } from 'common-util/model-blob-motion';
import { cn } from 'lib/utils';

import { modelBlobSvg } from './modelBlobSvg';

/**
 * The animated model shape on the hero card. The static Figma frame renders on the server; the
 * motion takes over after mount and is torn down on unmount. The markup is static and ours, so
 * injecting it is safe. Ids carry a per-instance suffix: the desktop and phone cards share a page.
 */
export const ModelBlob = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const suffix = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  // Stable identity: React re-applies innerHTML whenever this object changes.
  const html = useMemo(() => ({ __html: modelBlobSvg(suffix) }), [suffix]);

  useEffect(() => {
    if (!ref.current) return undefined;
    const { dispose } = initModelBlobMotion(ref.current);
    return dispose;
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        '[&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:overflow-visible',
        className
      )}
      dangerouslySetInnerHTML={html}
    />
  );
};
