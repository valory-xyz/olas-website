import Image from 'next/image';

import { cn } from 'lib/utils';

type Economy = {
  key: string;
  label: string;
  icon: string;
  /** Only Predict has data in the POC; the rest are present but not selectable yet. */
  disabled?: boolean;
};

const ECONOMIES: Economy[] = [
  { key: 'predict', label: 'Predict', icon: '/images/explorer/predict.png' },
  {
    key: 'babydegen',
    label: 'Babydegen',
    icon: '/images/explorer/babydegen-economy.png',
    disabled: true,
  },
  { key: 'mech', label: 'Mech', icon: '/images/explorer/mech.png', disabled: true },
];

type EconomySelectorProps = {
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
};

/**
 * Economy segmented control (Figma node 20629:5216). White container, #d7ddea
 * border, rounded-10; active item gets a #dfe5ee fill, inactive labels are
 * #606f85. Each item carries its economy icon. Babydegen/Mech are disabled until
 * their data pipelines land.
 */
export const EconomySelector = ({ activeKey, onChange, className }: EconomySelectorProps) => (
  <div
    role="tablist"
    aria-label="Agent economy"
    className={cn(
      'inline-flex items-center gap-0.5 rounded-[10px] border border-[#d7ddea] bg-white p-0.5',
      className
    )}
  >
    {ECONOMIES.map(({ key, label, icon, disabled }) => {
      const isActive = key === activeKey;
      return (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-disabled={disabled || undefined}
          title={disabled ? 'Coming soon' : undefined}
          onClick={() => !disabled && onChange(key)}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg px-10 py-1.5 text-base transition-colors',
            isActive ? 'bg-[#dfe5ee] text-black' : 'text-[#606f85]',
            disabled ? 'cursor-not-allowed' : !isActive && 'hover:bg-slate-50'
          )}
        >
          <span className="relative size-7 shrink-0 overflow-hidden rounded-md">
            <Image src={icon} alt="" fill sizes="28px" className="object-cover" />
          </span>
          {label}
        </button>
      );
    })}
  </div>
);
