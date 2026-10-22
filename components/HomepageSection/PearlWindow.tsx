import { useEffect, useRef } from 'react';

import { initPearlWindow } from 'common-util/pearl-window';

const ASSET_BASE = '/images/homepage/pearl-window/';

/**
 * Animated Pearl app window with the agent chat. The motion script builds the window inside
 * `.pc-window` after mount, so React must never render children into it; the stage keeps the
 * window's aspect ratio in CSS so nothing shifts while it builds, and the script sets the stage's
 * height and transform, so React must not set a `style` on it either.
 */
export const PearlWindow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const { dispose } = initPearlWindow(ref.current, { assetBase: ASSET_BASE });
    return dispose;
  }, []);

  return (
    <div className="pc-root" ref={ref}>
      <div className="pc-stage">
        <div
          className="pc-window"
          role="img"
          aria-label="Pearl app: agents report their work in a feed and answer questions in a chat"
        />
      </div>
    </div>
  );
};
