import * as Tooltip from '@radix-ui/react-tooltip';
import { InfoIcon } from 'components/ui/info-icon';
import { useState } from 'react';

type PopoverProps = {
  children: React.ReactNode;
  text?: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  contentClassName?: string;
  iconSize?: number;
  onOpenChange?: (open: boolean) => void;
  /**
   * Plain-text version of the tooltip, emitted into the served HTML.
   *
   * Radix portals the content and only mounts it while open, so `children` never reach
   * a crawler. Opt in with a *string* rather than cloning `children`: duplicating
   * arbitrary nodes put focusable links inside an invisible box, pulled whole tooltips
   * into the accessible name of any `role="tab"`/button ancestor, and re-rendered
   * stateful children (a healthy metric served "sources are behind the chain", with a
   * locale-dependent timestamp). Leave unset where a `MetricContext` sentence nearby
   * already says the same thing.
   */
  srText?: string;
};

export const Popover = ({
  children,
  text,
  align = 'center',
  side = 'top',
  className = '',
  contentClassName,
  iconSize,
  onOpenChange,
  srText,
}: PopoverProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    handleOpenChange(true);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0} open={open} onOpenChange={handleOpenChange}>
        <Tooltip.Trigger
          onClick={handleOpen}
          className={`text-gray-500 ${className}`}
          aria-label="Open information tooltip"
        >
          {text}
          <InfoIcon size={iconSize} />
        </Tooltip.Trigger>
        {/* Portaled so content escapes stacking contexts (cards, overlays)
            and always paints on top. */}
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            align={align}
            className={`z-50 p-3 text-sm bg-white border rounded-lg shadow-lg shadow-gray-500/10 mb-1 ${contentClassName || ''}`}
          >
            {children}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      {/* Plain text only — never a clone of `children`. Leading space so extraction
          does not glue it to the preceding content. */}
      {srText && <span className="sr-only">{` ${srText}`}</span>}
    </Tooltip.Provider>
  );
};
