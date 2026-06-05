import * as Tooltip from '@radix-ui/react-tooltip';
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
 * their data pipelines land — hovering them shows a "Coming soon" tooltip.
 */
export const EconomySelector = ({ activeKey, onChange, className }: EconomySelectorProps) => (
  <Tooltip.Provider delayDuration={150}>
    <div
      role="tablist"
      aria-label="Agent economy"
      className={cn(
        // Mobile: full-width, equal thirds so 3 economies always fit (no overflow).
        // sm+: revert to the auto-width centered pill from Figma.
        'flex w-full items-center gap-0.5 rounded-[10px] border border-[#d7ddea] bg-white p-0.5 sm:inline-flex sm:w-auto',
        className
      )}
    >
      {ECONOMIES.map(({ key, label, icon, disabled }) => {
        const isActive = key === activeKey;
        const button = (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled || undefined}
            onClick={() => !disabled && onChange(key)}
            className={cn(
              // flex-1 + min-w-0 + truncated label = thirds can never overflow on mobile;
              // tight padding + a smaller icon keep the full "Babydegen" label visible.
              // min-h-[44px] gives a proper mobile touch target; reset at sm: (pointer).
              'flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-sm transition-colors sm:min-h-0 sm:flex-initial sm:gap-2 sm:px-10 sm:text-base',
              isActive ? 'bg-[#dfe5ee] text-black' : 'text-[#606f85]',
              disabled ? 'cursor-not-allowed' : !isActive && 'hover:bg-slate-50'
            )}
          >
            <span className="relative size-5 shrink-0 overflow-hidden rounded-md sm:size-7">
              <Image
                src={icon}
                alt=""
                fill
                sizes="(min-width: 640px) 28px, 20px"
                className="object-cover"
              />
            </span>
            <span className="truncate">{label}</span>
          </button>
        );

        // Disabled economies get a "Coming soon" tooltip. aria-disabled (not the
        // disabled attr) keeps the trigger hover/focus-able so the tooltip shows.
        return disabled ? (
          <Tooltip.Root key={key}>
            <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="mb-1 rounded-md border bg-white px-2 py-1 text-xs text-[#475569] shadow-sm shadow-gray-500/10"
            >
              Coming soon
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          button
        );
      })}
    </div>
  </Tooltip.Provider>
);
