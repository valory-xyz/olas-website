import * as Tooltip from '@radix-ui/react-tooltip';
import { InfoIcon } from 'components/ui/info-icon';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const Popover = ({
  children,
  text,
  align,
  side,
  className,
  contentClassName,
}) => {
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
          className={`p-3 text-sm bg-white border rounded-lg shadow-lg shadow-gray-500/10 mb-1 ${contentClassName}`}
        >
          <p>{children}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
  align: PropTypes.string,
  side: PropTypes.string,
};

Popover.defaultProps = {
  text: undefined,
  className: '',
  align: 'center',
  side: 'top',
};
