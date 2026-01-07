interface LegendItemProps {
  color: string;
  label: string;
}

export const LegendItem = ({
  color,
  label
}: LegendItemProps) => (
  <div className="flex gap-2 items-center">
    <div className={`${color} px-3 py-1 rounded-sm`} />
    <span className="text-sm">{label}</span>
  </div>
);
