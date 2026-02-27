type TabItem = {
  key: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export const Tabs = ({ items, activeKey, onChange }: TabsProps) => (
  <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-lg p-1">
    {items.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          activeKey === key
            ? 'bg-slate-100 text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
