import { useEffect, useRef } from 'react';

import { initPearlWindow } from 'common-util/pearl-window';

const ASSET_BASE = '/images/homepage/pearl-window/';

/**
 * Animated Pearl app window. The motion script builds the window inside `.pw-window` after
 * mount, so React must never render children into it; the stage keeps the window's aspect
 * ratio in CSS so nothing shifts while it builds.
 */
export const PearlWindow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const { dispose } = initPearlWindow(ref.current, { assetBase: ASSET_BASE });
    return dispose;
  }, []);

  return (
    <div className="pw-root" ref={ref}>
      <div className="pw-stage">
        <div
          className="pw-window"
          role="img"
          aria-label="Pearl app: agents start, work and earn rewards"
        />
      </div>
    </div>
  );
};
