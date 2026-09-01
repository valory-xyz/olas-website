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
   * Skip the screen-reader-only copy of `children`.
   *
   * Radix portals the tooltip and only mounts it while open, so its content never
   * reaches the served HTML — by default we emit a hidden duplicate so crawlers and
   * assistive tech can read it. Set this where the surrounding `MetricContext`
   * sentence already states the same thing, to avoid saying it twice.
   */
  omitSrText?: boolean;
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
  omitSrText = false,
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
      {/* The same content, always in the DOM and visually hidden. Purely
          presentational in every current call site, so rendering it twice is safe;
          where children contain a link this does add a second focusable copy. */}
      {!omitSrText && <span className="sr-only">{children}</span>}
    </Tooltip.Provider>
  );
};
