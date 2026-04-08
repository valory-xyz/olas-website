import { useState } from 'react';
import { ToolAccuracyData } from 'common-util/api/predict/tool-accuracy';
import { Card } from 'components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Tabs } from 'components/ui/tabs';

type AgentBlueprint = 'omenstrat' | 'polystrat';

type ToolAccuracyTableProps = {
  data: ToolAccuracyData | null;
  className?: string;
  id?: string;
};

const AGENT_BLUEPRINTS = [
  { key: 'omenstrat', label: 'Omenstrat' },
  { key: 'polystrat', label: 'Polystrat' },
];

const BLUEPRINT_LABELS: Record<AgentBlueprint, string> = {
  omenstrat: 'Omenstrat',
  polystrat: 'Polystrat',
};

export const ToolAccuracyTable = ({ data, className, id }: ToolAccuracyTableProps) => {
  const [activeBlueprint, setActiveBlueprint] = useState<AgentBlueprint>('polystrat');

  const rows = data?.[activeBlueprint] ?? null;

  if (!data || (!data.omenstrat?.length && !data.polystrat?.length)) return null;

  const sortedRows = rows ? [...rows].sort((a, b) => b.accuracy - a.accuracy) : [];

  return (
    <Card
      id={id}
      className={`p-8 overflow-hidden border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col ${className ?? ''}`}
    >
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="text-lg font-semibold">
          Tool Accuracy
        </div>
        <Tabs
          items={AGENT_BLUEPRINTS}
          activeKey={activeBlueprint}
          onChange={(key) => setActiveBlueprint(key as AgentBlueprint)}
        />
      </div>

      {sortedRows.length === 0 ? (
        <div className="text-sm text-gray-500 py-4">No tool accuracy data available.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base">Tool</TableHead>
              <TableHead className="text-right text-base">Accuracy %</TableHead>
              <TableHead className="text-right text-base">Total Bets</TableHead>
              <TableHead className="text-right text-base">Correct</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.tool}>
                <TableCell className="text-sm font-medium">{row.tool}</TableCell>
                <TableCell className="text-sm text-right">{row.accuracy}%</TableCell>
                <TableCell className="text-sm text-right">
                  {row.totalBets.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-right">
                  {row.correctBets.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};
