type TabItem = {
  key: string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

type TabsProps = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export const Tabs = ({ items, activeKey, onChange }: TabsProps) => (
  <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-lg p-1">
    {items.map(({ key, label, disabled, tooltip }) => {
      const isActive = activeKey === key;
      const stateClasses = disabled
        ? 'text-gray-300 cursor-not-allowed'
        : isActive
          ? 'bg-slate-100 text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700';
      const button = (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) onChange(key);
          }}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${stateClasses}`}
        >
          {label}
        </button>
      );
      // `title` on a disabled <button> is suppressed by the browser, so wrap
      // in a span that owns the tooltip and lets pointer events through.
      return disabled && tooltip ? (
        <span key={key} title={tooltip} className="inline-flex">
          {button}
        </span>
      ) : (
        button
      );
    })}
  </div>
);
