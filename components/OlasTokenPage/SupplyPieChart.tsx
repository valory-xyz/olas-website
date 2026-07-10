import { ArcElement, Chart } from 'chart.js';
import {
  COINGECKO_URL,
  ETHERSCAN_URL,
  OLAS_SUPPLY_DISTRIBUTION_ADDRESSES,
} from 'common-util/constants';
import { MetricWithStatus } from 'common-util/graphql/types';
import { olasAddress } from 'common-util/web3';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { ExternalLink } from 'components/ui/typography';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import Verify from '../Verify';

// manually register arc element – required due to chart.js tree shaking
Chart.register(ArcElement);

const DATA = [
  {
    id: 'veOlas',
    label: 'veOLAS (vote escrow)',
    address: OLAS_SUPPLY_DISTRIBUTION_ADDRESSES.veOlas,
    weiKey: 'veOlasWei',
    tailwindColor: 'bg-purple-500',
    rgbColor: '#A755F7',
  },
  {
    id: 'dao',
    label: 'DAO Treasury',
    address: OLAS_SUPPLY_DISTRIBUTION_ADDRESSES.dao,
    weiKey: 'daoWei',
    tailwindColor: 'bg-pink-500',
    rgbColor: '#E964C4',
  },
  {
    id: 'valory',
    label: 'Valory (core contributor)',
    address: OLAS_SUPPLY_DISTRIBUTION_ADDRESSES.valory,
    weiKey: 'valoryWei',
    tailwindColor: 'bg-green-400',
    rgbColor: '#3FE681',
  },
  {
    id: 'circulatingSupply',
    label: 'Circulating supply',
    weiKey: 'circulatingSupplyWei',
    tailwindColor: 'bg-cyan-500',
    rgbColor: '#09B4D7',
  },
];

const LABELS = DATA.map((item) => item.label);
const RGB_COLORS = DATA.map((item) => item.rgbColor);

function getAddressPrefix(address) {
  return address.slice(0, 6);
}

const LegendItem = ({ label, color, address = null, value }) => (
  <div className="flex gap-2 items-center w-full">
    <div className={`${color} px-3 py-1 rounded-sm`} />
    <span className="text-gray-500">{label}</span>
    {address && (
      <span className="ml-1 font-medium">
        <a
          href={`${ETHERSCAN_URL}/token/${olasAddress}?a=${address}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {getAddressPrefix(address)}
        </a>
      </span>
    )}
    <span className="flex-auto border-b border-dotted border-gray-300" />
    <span>{value}</span>
  </div>
);

LegendItem.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  address: PropTypes.string,
  value: PropTypes.string.isRequired,
};

const TotalSupplyInfo = () => (
  <div className="flex flex-col gap-2 text-base max-w-md">
    <span className="font-semibold mb-2">How is the Total Supply calculated?</span>
    <span className="italic">
      <span className="font-semibold">Total Supply = On-chain</span> value -{' '}
      <span className="font-semibold">buOLAS</span> value
    </span>
    <ExternalLink
      href={`${ETHERSCAN_URL}/address/0x0001A500A6B18995B03f44bb040A5fFc28E45CB0#readContract#F16`}
    >
      Verify on-chain value
    </ExternalLink>
    <p>
      <span className="font-semibold">buOLAS</span> is a portion of tokens that have been burned
      following the{' '}
      <ExternalLink href="https://gateway.autonolas.tech/ipfs/bafybeibw3wq7kpodccpsf2cdpnypbr56gjofbxv7cjy6k4h4ychhccnqwm">
        Olas DAO proposal
      </ExternalLink>
      . Verify:
    </p>
    <ExternalLink
      href={`${ETHERSCAN_URL}/tx/0xa9e1dae6a5b43b06180034ed670864ec82204d8479398a5282e13fb1a327cf4d#eventlog`}
    >
      Revoke buOLAS execution 1
    </ExternalLink>
    <ExternalLink
      href={`${ETHERSCAN_URL}/tx/0x4e5126b56e3acac1d80278602c72933f538ab8d069ec267a6d61ca17ae0b0a08#eventlog`}
    >
      Revoke buOLAS execution 2
    </ExternalLink>
    <ExternalLink
      href={`${ETHERSCAN_URL}/tx/0x0132ac743f3da1a3eb1fb8e5bc853e254b47ddbf4e1f6a699e21cbc787d44a26#eventlog`}
    >
      Revoke buOLAS execution 3
    </ExternalLink>
  </div>
);

function formatNumber(number) {
  return number.toLocaleString();
}

function formatEthers(value: bigint) {
  const divisor = 1000000000000000000n;
  return Number(value / divisor);
}

type SupplyDistributionValue = {
  totalSupplyWei: string;
  veOlasWei: string;
  daoWei: string;
  valoryWei: string;
  circulatingSupplyWei: string;
};

type SupplyPieChartProps = {
  supplyDistribution?: MetricWithStatus<SupplyDistributionValue | null>;
};

export const SupplyPieChart = ({ supplyDistribution }: SupplyPieChartProps) => {
  const distribution = supplyDistribution?.value;
  const status = supplyDistribution?.status;
  const loading = isNil(distribution);

  const data = loading
    ? []
    : DATA.map((item) => ({
        ...item,
        color: item.tailwindColor,
        value: formatEthers(BigInt(distribution[item.weiKey] ?? 0)),
      }));

  const totalSupply = loading ? undefined : formatEthers(BigInt(distribution.totalSupplyWei));

  return (
    <>
      <div className="flex flex-wrap gap-x-8 p-4 border-b">
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Total Supply
          </h2>
          <div className="flex items-center gap-2">
            <div className="text-gradient text-4xl font-extrabold">
              {loading ? '--' : formatNumber(totalSupply)}
            </div>
            <StaleIndicator status={status} />
          </div>
          <div className="mb-4">
            <Popover
              text="Verify"
              align="start"
              side="bottom"
              className="flex items-center gap-1 text-slate-400 border-b border-slate-400"
            >
              <TotalSupplyInfo />
            </Popover>
          </div>
        </div>
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Circulating Supply
          </h2>
          <div className="flex items-center gap-2">
            <div className="text-gradient text-4xl font-extrabold">
              {loading
                ? '--'
                : formatNumber(formatEthers(BigInt(distribution.circulatingSupplyWei)))}
            </div>
            <StaleIndicator status={status} />
          </div>
          <div className="mb-4">
            <Verify url={`${COINGECKO_URL}/en/coins/autonolas`} />
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
          Total Supply Distribution
        </h2>
        <div className="flex flex-col items-center gap-8">
          <div>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <Pie
                data={{
                  labels: LABELS,
                  datasets: [
                    {
                      data: data.map((item) => item.value),
                      backgroundColor: RGB_COLORS,
                      hoverBackgroundColor: RGB_COLORS,
                    },
                  ],
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-2 self-center w-full">
            {data.map((item) => (
              <LegendItem
                key={item.id}
                label={item.label}
                address={item.address}
                color={item.color}
                value={formatNumber(item.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
