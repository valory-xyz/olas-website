import { ToolAccuracyStat } from 'common-util/api/predict/tool-accuracy';
import { Card } from 'components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';

type ToolAccuracyTableProps = {
  data: ToolAccuracyStat[] | null;
  className?: string;
};

export const ToolAccuracyTable = ({ data, className }: ToolAccuracyTableProps) => {
  if (!data || data.length === 0) return null;

  return (
    <Card
      className={`p-8 border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col ${className ?? ''}`}
    >
      <div className="text-lg font-semibold mb-6">Omenstrat Tool Accuracy</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tool</TableHead>
            <TableHead className="text-right">Total Bets</TableHead>
            <TableHead className="text-right">Correct</TableHead>
            <TableHead className="text-right">Accuracy %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.tool}>
              <TableCell className="font-medium">{row.tool}</TableCell>
              <TableCell className="text-right">{row.totalBets.toLocaleString()}</TableCell>
              <TableCell className="text-right">{row.correctBets.toLocaleString()}</TableCell>
              <TableCell className="text-right">{row.accuracy}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
