import { Table, TableBody, TableCell, TableRow } from 'components/ui/table';
import Image from 'next/image';

const PredictionAgentsTable = () => (
  <div className="max-w-6xl mx-auto">
    {/* @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; className: string; }' is ... Remove this comment to see the full error message */}{' '}
    <Table className="text-lg">
      {/* @ts-expect-error TS(2559) FIXME: Type '{ children: any[]; }' has no properties in c... Remove this comment to see the full error message */}{' '}
      <TableBody>
        {/* @ts-expect-error TS(2559) FIXME: Type '{ children: any[]; }' has no properties in c... Remove this comment to see the full error message */}{' '}
        <TableRow>
          {/* @ts-expect-error TS(2559) FIXME: Type '{ children: string; }' has no properties in ... Remove this comment to see the full error message */}{' '}
          <TableCell>1. Agent watches for new prediction markets</TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <span className="text-6xl">→</span>
            <br />
            Sees new market
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <Image
              src="/images/prediction-agents-table/omen.svg"
              alt="Omen prediction market"
              width={70}
              height={70}
              className="mx-auto"
            />
            Prediction market
          </TableCell>
        </TableRow>
        {/* @ts-expect-error TS(2559) FIXME: Type '{ children: any[]; }' has no properties in c... Remove this comment to see the full error message */}{' '}
        <TableRow>
          {/* @ts-expect-error TS(2559) FIXME: Type '{ children: string; }' has no properties in ... Remove this comment to see the full error message */}{' '}
          <TableCell>2. Agent uses AI tools to get probability</TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: Element; className: string; }' i... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <div className="flex justify-between">
              <div>
                <span className="text-6xl">←</span>
                <br />
                <span>Probability</span>
              </div>
              <div>
                <span className="text-6xl">→</span>
                <br />
                <span>$</span>
              </div>
            </div>
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <Image
              src="/images/prediction-agents-table/mechs.svg"
              alt="Omen prediction market"
              width={200}
              height={100}
              className="mx-auto"
            />
            AI Tools Marketplace
          </TableCell>
        </TableRow>
        {/* @ts-expect-error TS(2559) FIXME: Type '{ children: any[]; }' has no properties in c... Remove this comment to see the full error message */}{' '}
        <TableRow>
          {/* @ts-expect-error TS(2559) FIXME: Type '{ children: string; }' has no properties in ... Remove this comment to see the full error message */}{' '}
          <TableCell>3. Agent bets on prediction market</TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            $
            <br />
            <span className="text-6xl">→</span>
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <Image
              src="/images/prediction-agents-table/omen.svg"
              alt="Omen prediction market"
              width={70}
              height={70}
              className="mx-auto"
            />
            AI Tools Marketplace
          </TableCell>
        </TableRow>
        {/* @ts-expect-error TS(2559) FIXME: Type '{ children: any[]; }' has no properties in c... Remove this comment to see the full error message */}{' '}
        <TableRow>
          {/* @ts-expect-error TS(2559) FIXME: Type '{ children: string; }' has no properties in ... Remove this comment to see the full error message */}{' '}
          <TableCell>4. Agent potentially receives winnings</TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <span className="text-6xl">←</span>
            <br />? $ $
          </TableCell>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message */}{' '}
          <TableCell className="text-center">
            <Image
              src="/images/prediction-agents-table/omen.svg"
              alt="Omen prediction market"
              width={70}
              height={70}
              className="mx-auto"
            />
            AI Tools Marketplace
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

export default PredictionAgentsTable;
