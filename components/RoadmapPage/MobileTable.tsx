import { CheckCheck } from 'lucide-react';
import { OlasToken } from './OlasToken';

interface TableCellProps {
  children: React.ReactNode;
  column: 'pearl' | 'marketplace';
  showCheckmark?: boolean;
}

const TableCell = ({
  children,
  column,
  showCheckmark = false,
}: TableCellProps) => {
  const colorClass =
    column === 'pearl' ? 'roadmap-cell-pearl' : 'roadmap-cell-marketplace';
  return (
    <td className={`border border-slate-200 p-3 ${colorClass}`}>
      {showCheckmark && <CheckCheck className="inline mr-2" />}
      {children}
    </td>
  );
};

interface SpanningTableCellProps {
  children: React.ReactNode;
  className?: string;
}

const SpanningTableCell = ({
  children,
  className = '',
}: SpanningTableCellProps) => (
  <td
    colSpan={2}
    className={`text-center text-slate-600 font-medium p-3 border border-slate-200 ${className}`}
  >
    {children}
  </td>
);

type RoadmapItem =
  | { type: 'section'; label: string; className?: string }
  | {
      type: 'row';
      pearl: string;
      marketplace: string;
      showCheckmark?: boolean;
    };

const roadmapData: RoadmapItem[] = [
  { type: 'section', label: 'Now' },
  {
    type: 'row',
    pearl: 'AI Agent Ownership',
    marketplace: 'A2A Collaboration',
    showCheckmark: true,
  },
  {
    type: 'row',
    pearl: 'Simplified UX',
    marketplace: 'Monetize Your Agent',
    showCheckmark: true,
  },
  {
    type: 'row',
    pearl: 'Human-like Utility',
    marketplace: 'x402',
    showCheckmark: true,
  },
  {
    type: 'row',
    pearl: 'Web2 UX',
    marketplace: 'Simplified Onboarding',
    showCheckmark: true,
  },
  {
    type: 'row',
    pearl: 'More Agents',
    marketplace: 'Seamless Data Storage',
    showCheckmark: true,
  },
  {
    type: 'row',
    pearl: 'Multiple AI Agents',
    marketplace: 'ERC-8004',
    showCheckmark: true,
  },
  {
    type: 'row',
    pearl: 'Open-source',
    marketplace: 'Hire Mech Agents',
    showCheckmark: true,
  },
  {
    type: 'row',
    pearl: 'No-code Experience',
    marketplace: '',
    showCheckmark: true,
  },
  { type: 'section', label: 'Short-Term', className: 'pt-10' },
  { type: 'row', pearl: 'Even More Agents', marketplace: 'Dynamic Fees' },
  {
    type: 'row',
    pearl: 'State-of-the-art UX',
    marketplace: 'Native x402',
  },
  { type: 'section', label: 'Mid-Term', className: 'pt-10' },
  {
    type: 'row',
    pearl: 'Cutting-edge Utility',
    marketplace: 'Access any Service with just a Signature',
  },
  { type: 'row', pearl: ' ', marketplace: 'MCP' },
];

export const MobileTable = () => (
  <div className="md:hidden w-full h-[1420px] border border-t-1.5 mobile-roadmap-container relative">
    <table className="table-fixed w-full border border-slate-200 mobile-roadmap-table">
      <thead className="bg-slate-100 text-center text-lg text-black">
        <tr>
          <th className="w-1/2 font-medium border border-slate-200 p-3">
            Pearl
          </th>
          <th className="w-1/2 font-medium border border-slate-200 p-3">
            Marketplace
          </th>
        </tr>
      </thead>
      <tbody>
        {roadmapData.map((item, index) => {
          if (item.type === 'section') {
            return (
              <tr key={index}>
                <SpanningTableCell className={item.className || ''}>
                  {item.label}
                </SpanningTableCell>
              </tr>
            );
          }
          return (
            <tr key={index}>
              <TableCell column="pearl" showCheckmark={item.showCheckmark}>
                {item.pearl}
              </TableCell>
              <TableCell
                column="marketplace"
                showCheckmark={item.showCheckmark}
              >
                {item.marketplace}
              </TableCell>
            </tr>
          );
        })}
      </tbody>
    </table>
    <div className="mb-12 mx-auto w-fit bottom-28 mt-16">
      <OlasToken />
    </div>
  </div>
);
