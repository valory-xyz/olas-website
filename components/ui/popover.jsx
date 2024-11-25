import PropTypes from 'prop-types';
import { useState } from 'react';
import { InfoIcon } from 'components/ui/info-icon';
import * as Tooltip from '@radix-ui/react-tooltip';

export const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0} open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger onClick={handleOpen} className="text-gray-500">
          <InfoIcon />
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          align="center"
          className="p-3 text-sm bg-white border rounded-lg shadow-lg shadow-gray-500/10 mb-1"
        >
          <p>{children}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

Popover.propTypes = {
  children: PropTypes.string.isRequired,
};
