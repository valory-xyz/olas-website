import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const transition = 'transition-all duration-300 ease-in-out';

export const Accordion = ({ label, defaultOpen = true, children }) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    setAccordionOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAccordionOpen(!accordionOpen)}
        className={`flex items-center justify-between w-full px-6 py-4 font-medium bg-gray-100 border border-gray-200 text-left lg:text-center hover:bg-gray-100 ${
          accordionOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl '
        }`}
        aria-expanded={accordionOpen ? 'true' : 'false'}
      >
        <span className="text-lg">{label}</span>
        <div>
          <ChevronDown
            className={`transform origin-center transition duration-100 ease-out ${
              accordionOpen && '!rotate-180'
            }`}
            color="#606F85"
          />
        </div>
      </button>

      <div
        className={`grid px-6 bg-white border border-gray-200 overflow-hidden rounded-xl rounded-t-none ${transition} ${
          accordionOpen
            ? 'grid-rows-[1fr] opacity-100 py-4'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

Accordion.propTypes = {
  label: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Accordion.defaultProps = {
  defaultOpen: true,
};
