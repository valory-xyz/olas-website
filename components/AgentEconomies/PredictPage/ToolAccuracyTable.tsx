import { ToolAccuracyData } from 'common-util/api/predict/tool-accuracy';
import { Card } from 'components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import type { Platform } from './PlatformActivitySection';

type ToolAccuracyTableProps = {
  data: ToolAccuracyData | null;
  platform: Platform;
  className?: string;
  id?: string;
};

const PLATFORM_DESCRIPTIONS: Record<Platform, string> = {
  omenstrat:
    'These tools are designed to forecast outcomes on Omen. The leaderboard shows which tools had the strongest historical accuracy.',
  polystrat:
    'These tools are designed to forecast outcomes on Polymarket. The leaderboard shows which tools had the strongest historical accuracy.',
};

const parseIrrelevantTools = (envValue: string | undefined): Set<string> => {
  if (!envValue) return new Set();
  try {
    const parsed = JSON.parse(envValue);
    if (Array.isArray(parsed)) return new Set(parsed.map((t: string) => t.toLowerCase()));
  } catch {
    // ignore malformed env values
  }
  return new Set();
};

const IRRELEVANT_TOOLS: Record<Platform, Set<string>> = {
  omenstrat: parseIrrelevantTools(process.env.NEXT_PUBLIC_OMENSTRAT_IRRELEVANT_TOOLS),
  polystrat: parseIrrelevantTools(process.env.NEXT_PUBLIC_POLYSTRAT_IRRELEVANT_TOOLS),
};

export const ToolAccuracyTable = ({ data, platform, className, id }: ToolAccuracyTableProps) => {
  const rows = data?.[platform] ?? null;

  if (!data || (!data.omenstrat?.length && !data.polystrat?.length)) return null;

  const irrelevant = IRRELEVANT_TOOLS[platform];
  const filteredRows = rows ? rows.filter((r) => !irrelevant.has(r.tool.toLowerCase())) : [];
  const sortedRows = filteredRows.sort((a, b) => b.accuracy - a.accuracy);

  return (
    <Card
      id={id}
      className={`overflow-hidden border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col ${className ?? ''}`}
    >
      <div className="flex flex-col gap-3 px-6 py-4">
        <div className="text-lg font-semibold text-gray-900">Tool accuracy</div>
        <p className="text-base text-slate-500">{PLATFORM_DESCRIPTIONS[platform]}</p>
      </div>

      {sortedRows.length === 0 ? (
        <div className="text-sm text-gray-500 px-8 pb-8">No tool accuracy data available.</div>
      ) : (
        <Table className="text-base">
          <TableHeader>
            <TableRow className="border-t border-b border-slate-200 hover:bg-transparent">
              <TableHead className="px-6 py-3 text-base font-normal text-slate-500">Tool</TableHead>
              <TableHead className="px-6 py-3 text-right text-base font-normal text-slate-500">
                Accuracy
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-base font-normal text-slate-500">
                Total Trades
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-base font-normal text-slate-500">
                Correct Trades
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.tool} className="border-b border-slate-200 hover:bg-transparent">
                <TableCell className="px-6 py-3 text-base font-medium text-gray-900">
                  {row.tool}
                </TableCell>
                <TableCell className="px-6 py-3 text-right text-base text-gray-900">
                  {row.accuracy}%
                </TableCell>
                <TableCell className="px-6 py-3 text-right text-base text-gray-900">
                  {row.totalBets.toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-3 text-right text-base text-gray-900">
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
