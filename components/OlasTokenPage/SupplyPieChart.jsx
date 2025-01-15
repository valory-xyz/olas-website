import { ArcElement, Chart } from 'chart.js';
import { getOlasContract, olasAddress } from 'common-util/web3';
import { Popover } from 'components/ui/popover';
import { ExternalLink } from 'components/ui/typography';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Verify from '../Verify';

// manually register arc element – required due to chart.js tree shaking
Chart.register(ArcElement);

const olasContract = getOlasContract();

const daoAddress = '0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE';
const veOlasAddress = '0x7e01A500805f8A52Fad229b3015AD130A332B7b3';
const valoryAddress = '0x87cc0d34f6111c8A7A4Bdf758a9a715A3675f941';

const DATA = [
  {
    id: 'veOlas',
    label: 'veOLAS (vote escrow)',
    address: veOlasAddress,
    tailwindColor: 'bg-purple-500',
    rgbColor: '#A755F7',
  },
  {
    id: 'dao',
    label: 'DAO Treasury',
    address: daoAddress,
    tailwindColor: 'bg-pink-500',
    rgbColor: '#E964C4',
  },
  {
    id: 'valory',
    label: 'Valory (core contributor)',
    address: valoryAddress,
    tailwindColor: 'bg-green-400',
    rgbColor: '#3FE681',
  },
  {
    id: 'circulatingSupply',
    label: 'Circulating supply',
    tailwindColor: 'bg-cyan-500',
    rgbColor: '#09B4D7',
  },
];

const IDS = DATA.map((item) => item.id);
const LABELS = DATA.map((item) => item.label);
const ADDRESSES = DATA.map((item) => item.address).filter(Boolean);
const TAILWIND_COLORS = DATA.map((item) => item.tailwindColor);
const RGB_COLORS = DATA.map((item) => item.rgbColor);

const CIRCULATING_SUPPLY_INDEX = DATA.findIndex(
  (item) => item.id === 'circulatingSupply',
);

function getAddressPrefix(address) {
  return address.slice(0, 6);
}

const LegendItem = ({ label, color, address, value }) => (
  <div className="flex gap-2 items-center w-full">
    <div className={`${color} px-3 py-1 rounded-sm`} />
    <span className="text-gray-500">{label}</span>
    {address && (
      <span className="ml-1 font-medium">
        <a
          href={`https://etherscan.io/token/${olasAddress}?a=${address}`}
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
LegendItem.defaultProps = { address: null };

const TotalSupplyInfo = () => (
  <div class="flex flex-col gap-2 text-base max-w-md">
    <span class="font-semibold mb-2">How is the Total Supply calculated?</span>
    <span class="italic">
      <span className="font-semibold">Total Supply = On-chain</span> value -{' '}
      <span className="font-semibold">buOLAS</span> value
    </span>
    <ExternalLink href="https://etherscan.io/address/0x0001A500A6B18995B03f44bb040A5fFc28E45CB0#readContract#F16">
      Verify on-chain value
    </ExternalLink>
    <p>
      <span className="font-semibold">buOLAS</span> is a portion of tokens that
      have been burned following the{' '}
      <ExternalLink href="https://gateway.autonolas.tech/ipfs/bafybeibw3wq7kpodccpsf2cdpnypbr56gjofbxv7cjy6k4h4ychhccnqwm">
        Olas DAO proposal
      </ExternalLink>
      . Verify:
    </p>
    <ExternalLink href="https://etherscan.io/tx/0xa9e1dae6a5b43b06180034ed670864ec82204d8479398a5282e13fb1a327cf4d#eventlog">
      Revoke buOLAS execution 1
    </ExternalLink>
    <ExternalLink href="https://etherscan.io/tx/0x4e5126b56e3acac1d80278602c72933f538ab8d069ec267a6d61ca17ae0b0a08#eventlog">
      Revoke buOLAS execution 2
    </ExternalLink>
    <ExternalLink href="https://etherscan.io/tx/0x0132ac743f3da1a3eb1fb8e5bc853e254b47ddbf4e1f6a699e21cbc787d44a26#eventlog">
      Revoke buOLAS execution 3
    </ExternalLink>
  </div>
);

function formatNumber(number) {
  return number.toLocaleString();
}

function formatEthers(value) {
  const weiValue = value;
  const divisor = 1000000000000000000n;
  const etherValue = weiValue / divisor;
  return Number(etherValue);
}

export const SupplyPieChart = () => {
  const [data, setData] = useState([]);
  const [totalSupply, setTotalSupply] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [
          fetch('/api/olas/total_supply'),
          ...ADDRESSES.map((address) =>
            olasContract.methods.balanceOf(address).call(),
          ),
        ];

        const result = await Promise.allSettled(promises);
        const totalSupplyResult = await result[0].value.json();

        const totalSupply = BigInt(totalSupplyResult.data.totalSupply);
        const distributions = result
          .slice(1, result.length)
          .map((item) => item.value || 0);

        const circulatingSupply =
          totalSupply > 0
            ? totalSupply - distributions.reduce((sum, item) => sum + item, 0n)
            : 0;

        setTotalSupply(formatEthers(totalSupply));
        setData([
          ...distributions.map((item, index) => ({
            id: IDS[index],
            label: LABELS[index],
            address: ADDRESSES[index],
            color: TAILWIND_COLORS[index],
            value: formatEthers(item),
          })),
          {
            id: IDS[CIRCULATING_SUPPLY_INDEX],
            label: LABELS[CIRCULATING_SUPPLY_INDEX],
            color: TAILWIND_COLORS[CIRCULATING_SUPPLY_INDEX],
            value: formatEthers(circulatingSupply),
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-x-8 p-4 border-b">
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Total Supply
          </h2>
          <div className="text-gradient text-4xl font-extrabold">
            {loading ? '--' : formatNumber(totalSupply)}
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
          <div className="text-gradient text-4xl font-extrabold">
            {loading ? '--' : formatNumber(data[data.length - 1].value)}
          </div>
          <div className="mb-4">
            <Verify url="https://www.coingecko.com/en/coins/autonolas" />
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
