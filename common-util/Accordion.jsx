import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const transition = 'transition-all duration-300 ease-in-out';

export const Accordion = ({ label, children }) => {
  const [accordionOpen, setAccordionOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAccordionOpen(!accordionOpen)}
        className={`flex items-center justify-between w-full px-6 py-4 font-medium text-gray-900 bg-gray-100 border border-gray-200 hover:bg-gray-100 ${
          accordionOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl '
        }`}
        aria-expanded="true"
      >
        <span>{label}</span>
        <div>
          <ChevronDown
            className={`transform origin-center transition duration-100 ease-out ${
              accordionOpen && '!rotate-180'
            }`}
          />
        </div>
      </button>

      <div
        className={`grid px-6 bg-white border border-gray-200 overflow-hidden text-slate-600 rounded-xl rounded-t-none ${transition} ${
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
  children: PropTypes.node.isRequired,
};
