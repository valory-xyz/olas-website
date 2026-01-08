import { CheckCheck } from 'lucide-react';
import { OlasToken } from './OlasToken';

const TableCell = ({ children, column, showCheckmark = false }) => {
  const colorClass =
    column === 'pearl' ? 'roadmap-cell-pearl' : 'roadmap-cell-marketplace';
  return (
    <td className={`border border-slate-200 p-3 ${colorClass}`}>
      {showCheckmark && <CheckCheck className="inline mr-2" />}
      {children}
    </td>
  );
};

const SpanningTableCell = ({ children, className = '' }) => (
  <td
    colSpan={2}
    className={`text-center text-slate-600 font-medium p-3 border border-slate-200 ${className}`}
  >
    {children}
  </td>
);

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
        <tr>
          <SpanningTableCell>Now</SpanningTableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            AI Agent Ownership
          </TableCell>
          <TableCell column="marketplace" showCheckmark>
            A2A Collaboration
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            Simplified UX
          </TableCell>
          <TableCell column="marketplace" showCheckmark>
            Monetize Your Agent
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            Human-like Utility
          </TableCell>
          <TableCell column="marketplace" showCheckmark>
            x402
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            Web2 UX
          </TableCell>
          <TableCell column="marketplace" showCheckmark>
            Simplified Onboarding
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            More Agents
          </TableCell>
          <TableCell column="marketplace" showCheckmark>
            Seamless Data Storage
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            Multiple AI Agents
          </TableCell>
          <TableCell column="marketplace" showCheckmark>
            ERC-8004
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            Open-source
          </TableCell>
          <TableCell column="marketplace" showCheckmark>
            Hire Mech Agents
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl" showCheckmark>
            No-code Experience
          </TableCell>
        </tr>
        <tr>
          <SpanningTableCell className="pt-10">Short-Term</SpanningTableCell>
        </tr>
        <tr>
          <TableCell column="pearl">Even More Agents</TableCell>
          <TableCell column="marketplace">Dynamic Fees</TableCell>
        </tr>
        <tr>
          <TableCell column="pearl">State-of-the-art UX</TableCell>
          <TableCell column="marketplace">Native x402</TableCell>
        </tr>
        <tr>
          <SpanningTableCell className="pt-10">Mid-Term</SpanningTableCell>
        </tr>
        <tr>
          <TableCell column="pearl">Cutting-edge Utility</TableCell>
          <TableCell column="marketplace">
            Access any Service with just a Signature
          </TableCell>
        </tr>
        <tr>
          <TableCell column="pearl"> </TableCell>
          <TableCell column="marketplace">MCP</TableCell>
        </tr>
      </tbody>
    </table>
    <div className="mb-12 mx-auto w-fit bottom-28 mt-16">
      <OlasToken />
    </div>
  </div>
);
