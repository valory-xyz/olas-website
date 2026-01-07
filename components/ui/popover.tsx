import * as Tooltip from '@radix-ui/react-tooltip';
import { InfoIcon } from 'components/ui/info-icon';
import { useState } from 'react';

interface PopoverProps {
  children: React.ReactNode;
  text?: string;
  className?: string;
  align?: string;
  side?: string;
}

export const Popover = ({
  children,
  text,
  align,
  side,
  className,
  // @ts-expect-error TS(2339) FIXME: Property 'contentClassName' does not exist on type... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type '"top" | "... Remove this comment to see the full error message
          side={side}
          // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type '"center" ... Remove this comment to see the full error message
          align={align}
          className={`p-3 text-sm bg-white border rounded-lg shadow-lg shadow-gray-500/10 mb-1 ${contentClassName}`}
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
