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
