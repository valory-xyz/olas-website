import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const transition = 'transition-all duration-300 ease-in-out';

interface AccordionProps {
  label: string | React.ReactNode;
  defaultOpen?: boolean;
  titleClass?: string;
  dropdownClass?: string;
  customClass?: string;
  children: React.ReactNode;
}

export const Accordion = ({
  label,
  defaultOpen = true,
  titleClass,
  dropdownClass,
  customClass,
  children,
}: AccordionProps) => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const buttonClass =
    titleClass ||
    customClass ||
    'flex gap-3 items-center justify-between w-full px-6 py-4 font-medium bg-gray-100 border border-gray-200 hover:bg-gray-100';
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
        {typeof label === 'string' ? (
          <span className="text-lg">{label}</span>
        ) : (
          <div className="text-lg">{label}</div>
        )}
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

Accordion.defaultProps = {
  defaultOpen: true,
};
