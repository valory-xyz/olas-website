import { ArcElement, Chart } from 'chart.js';
import { ETHERSCAN_URL } from 'common-util/constants';
import Link from 'next/link';
import { Pie } from 'react-chartjs-2';
import Verify from '../Verify';

const READ_PROXY_ETHERSCAN_URL = `${ETHERSCAN_URL}/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#`;

// manually register arc element – required due to chart.js tree shaking
Chart.register(ArcElement);

const verifyLinks = [
  `${READ_PROXY_ETHERSCAN_URL}F29`,
  `${READ_PROXY_ETHERSCAN_URL}F32`,
  `${READ_PROXY_ETHERSCAN_URL}F33`,
];

interface UsagePieChartProps {
  epoch?: unknown;
  loading: boolean;
  split: {
    bonders?: number;
    developers?: number;
    staking?: number;
  };
}

export const UsagePieChart = ({
  epoch,
  split,
  loading,
}: UsagePieChartProps) => (
  <div>
    <div>
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
        Current Epoch
      </h2>
      <div className="text-4xl font-extrabold">
        <span className="text-gradient">
          {loading ? '--' : epoch?.toString()}
        </span>
      </div>
      <div className="mb-4">
        <Verify url={`${READ_PROXY_ETHERSCAN_URL}F19`} />
      </div>
      <p className="mb-8 text-slate-500">
        Tokens are distributed to builders, operators and bonders each epoch.
        Epochs run roughly once a month.
      </p>
    </div>
    <div className="flex flex-col">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
        Per Epoch Distribution
      </h2>
      <div className="flex flex-col gap-2 mx-auto mb-4">
        <div>
          <span className="text-cyan-500 font-bold">
            {loading ? '--' : split?.developers}%
          </span>{' '}
          of the new tokens are earmarked for{' '}
          <Link href="/build" className="text-cyan-500 font-bold">
            Builders
          </Link>
        </div>
        <div>
          <span className="text-purple-600 font-bold">
            {loading ? '--' : split?.bonders}%
          </span>{' '}
          of the new tokens are earmarked for{' '}
          <Link href="/bond" className="text-purple-600 font-bold">
            Bonders
          </Link>
        </div>
        <div>
          <span className="text-yellow-600 font-bold">
            {loading ? '--' : split?.staking}%
          </span>{' '}
          of the new tokens are earmarked for{' '}
          <Link
            href="/staking"
            className="text-yellow-600 hover:text-yellow-600 font-bold"
          >
            Operators
          </Link>
        </div>
      </div>
      <div className="mb-4 max-w-[300px] mx-auto">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Pie
            data={{
              labels: ['Builders', 'Bonders', 'Operators'],
              datasets: [
                {
                  data: [
                    split?.developers ?? 0,
                    split?.bonders ?? 0,
                    split?.staking ?? 0,
                  ],
                  backgroundColor: ['#06b6d4', '#a855f7', '#ffb347'],
                  hoverBackgroundColor: ['#06b6d4', '#a855f7', '#ffb347'],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        )}
      </div>
      <div className="flex flex-row gap-3 text-slate-400 mb-4">
        <p>Verify: </p>
        {verifyLinks.map((link, index) => (
          // @ts-expect-error TS(2322) FIXME: Type '{ key: string; url: string; text: number; }'... Remove this comment to see the full error message
          <Verify key={`Verify ${index}`} url={link} text={index + 1} />
        ))}
      </div>
      <p className="text-slate-500">
        DAO members can vote to update how newly minted tokens are distributed.
      </p>
    </div>
  </div>
);

UsagePieChart.defaultProps = {
  epoch: null,
};
