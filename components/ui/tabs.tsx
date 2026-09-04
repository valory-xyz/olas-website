import * as Tooltip from '@radix-ui/react-tooltip';
import Image from 'next/image';

type TabItem = {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  tooltip?: string;
};

type TabsProps = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  // When set, the bar stretches to fill its container and tabs share the width equally.
  fullWidth?: boolean;
  /** Names the toggle group; without it the buttons read as unlabelled 7D/30D/90D/Max. */
  ariaLabel?: string;
};

export const Tabs = ({ items, activeKey, onChange, fullWidth = false, ariaLabel }: TabsProps) => (
  <Tooltip.Provider delayDuration={150}>
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex items-center gap-1 bg-white border border-slate-100 rounded-lg p-1 ${fullWidth ? 'w-full' : ''}`}
    >
      {items.map(({ key, label, icon, disabled, tooltip }) => {
        const isActive = activeKey === key;
        const stateClasses = disabled
          ? 'text-gray-300 cursor-not-allowed'
          : isActive
            ? 'bg-slate-100 text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700';
        // Use `aria-disabled` rather than `disabled` so the button stays
        // keyboard-focusable and the Radix tooltip is reachable on focus
        // and touch — not just mouse hover.
        const button = (
          <button
            key={key}
            type="button"
            // Toggle-button semantics rather than role="tab": only some consumers swap a
            // panel, so tab semantics would need an aria-controls/tabpanel pair they
            // cannot honestly provide. Without this the selected tab is expressed only
            // as a background colour, which no crawler or screen reader can read.
            aria-pressed={isActive}
            aria-disabled={disabled || undefined}
            onClick={() => {
              if (!disabled) onChange(key);
            }}
            className={`flex items-center justify-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${fullWidth ? 'flex-1' : ''} ${stateClasses}`}
          >
            {icon && <Image src={icon} alt="" width={18} height={18} />}
            {label}
          </button>
        );
        return disabled && tooltip ? (
          <Tooltip.Root key={key}>
            <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="px-2 py-1 text-xs bg-white border rounded-md shadow-sm shadow-gray-500/10 mb-1"
            >
              {tooltip}
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          button
        );
      })}
    </div>
  </Tooltip.Provider>
);
