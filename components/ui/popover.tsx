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
};

/*
 * On why there is no screen-reader copy of the tooltip here.
 *
 * Radix portals the content and mounts it only while open, so `children` never reach a
 * crawler. Cloning them into an `sr-only` sibling was tried and reverted: it put
 * focusable links inside an invisible box, pulled whole tooltips into the accessible
 * name of any button ancestor, and re-rendered stateful children (a healthy metric
 * served "sources are behind the chain", with a locale-dependent timestamp).
 *
 * The facts those tooltips carry are published instead as one sentence in the page's
 * summary — `ActivitySummary`, the Explorer summary, the metric mirrors — where each is
 * stated once, in context, rather than duplicated everywhere the tooltip is rendered.
 * If a tooltip fact is missing from the text layer, add it to the relevant summary; do
 * not reintroduce a per-tooltip copy.
 */

export const Popover = ({
  children,
  text,
  align = 'center',
  side = 'top',
  className = '',
  contentClassName,
  iconSize,
  onOpenChange,
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
    </Tooltip.Provider>
  );
};
