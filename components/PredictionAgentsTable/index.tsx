import { Table, TableBody, TableCell, TableRow } from 'components/ui/table';
import Image from 'next/image';

const PredictionAgentsTable = () => (
  <div className="max-w-6xl mx-auto">
    <Table className="text-lg">
      <TableBody>
        <TableRow>
          <TableCell>1. Agent watches for new prediction markets</TableCell>
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
          <TableCell className="text-center">
            <span className="text-6xl">→</span>
            <br />
            Sees new market
          </TableCell>
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
        <TableRow>
          <TableCell>2. Agent uses AI tools to get probability</TableCell>
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
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
        <TableRow>
          <TableCell>3. Agent bets on prediction market</TableCell>
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
          <TableCell className="text-center">
            $
            <br />
            <span className="text-6xl">→</span>
          </TableCell>
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
        <TableRow>
          <TableCell>4. Agent potentially receives winnings</TableCell>
          <TableCell className="text-center">
            <span className="text-6xl">🤖</span>
            <br />
            Your agent
          </TableCell>
          <TableCell className="text-center">
            <span className="text-6xl">←</span>
            <br />? $ $
          </TableCell>
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
