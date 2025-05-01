import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const transition = 'transition-all duration-300 ease-in-out';

export const Accordion = ({
  label,
  defaultOpen = true,
  titleClass,
  dropdownClass,
  children,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const buttonClass =
    titleClass ||
    'flex items-center justify-between w-full px-6 py-4 font-medium bg-gray-100 border border-gray-200 lg:text-center hover:bg-gray-100';
  const divClass =
    dropdownClass ||
    'px-6 bg-white border border-gray-200 rounded-xl rounded-t-none';

  useEffect(() => {
    setAccordionOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAccordionOpen(!accordionOpen)}
        className={`${buttonClass} text-left ${accordionOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl '}
        `}
        aria-expanded={accordionOpen ? 'true' : 'false'}
      >
        <span className="text-lg">{label}</span>
        <div>
          <ChevronDown
            className={`transform origin-center transition duration-100 ease-out ${accordionOpen && '!rotate-180'}`}
            color="#606F85"
          />
        </div>
      </button>

      <div
        className={`${divClass} grid overflow-hidden ${transition} ${accordionOpen ? 'grid-rows-[1fr] opacity-100 py-4' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

Accordion.propTypes = {
  label: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool,
  titleClass: PropTypes.string,
  dropdownClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Accordion.defaultProps = {
  defaultOpen: true,
};
