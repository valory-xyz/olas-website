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
};

export const Popover = ({
  children,
  text,
  align,
  side,
  className,
  contentClassName,
}: PopoverProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0} open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger
          onClick={handleOpen}
          className={`text-gray-500 ${className}`}
          aria-label="Open information tooltip"
        >
          {text}
          <InfoIcon />
        </Tooltip.Trigger>
        <Tooltip.Content
          side={side}
          align={align}
          className={`p-3 text-sm bg-white border rounded-lg shadow-lg shadow-gray-500/10 mb-1 ${contentClassName || ''}`}
        >
          <p>{children}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

Popover.defaultProps = {
  text: undefined,
  className: '',
  align: 'center',
  side: 'top',
};
