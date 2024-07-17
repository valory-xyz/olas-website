import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import { getOlasContract, olasAddress } from 'common-util/web3';
import Verify from '../Verify';

// manually register arc element – required due to chart.js tree shaking
Chart.register(ArcElement);

const olasContract = getOlasContract();

const daoAddress = '0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE';
const buOlasAddress = '0xb09CcF0Dbf0C178806Aaee28956c74bd66d21f73';
const veOlasAddress = '0x7e01A500805f8A52Fad229b3015AD130A332B7b3';
const valoryAddress = '0x87cc0d34f6111c8A7A4Bdf758a9a715A3675f941';

const DATA = [
  {
    label: 'veOLAS (vote escrow)',
    address: veOlasAddress,
    tailwindColor: 'bg-purple-500',
    rgbColor: '#A755F7',
  },
  {
    label: 'DAO Treasury',
    address: daoAddress,
    tailwindColor: 'bg-pink-500',
    rgbColor: '#E964C4',
  },
  {
    label: 'buOLAS',
    address: buOlasAddress,
    tailwindColor: 'bg-orange-400',
    rgbColor: '#FFB246',
  },
  {
    label: 'Valory (core contributor)',
    address: valoryAddress,
    tailwindColor: 'bg-green-400',
    rgbColor: '#3FE681',
  },
  {
    label: 'Circulating supply',
    tailwindColor: 'bg-cyan-500',
    rgbColor: '#09B4D7',
  },
];

const LABELS = DATA.map((item) => item.label);
const ADDRESSES = DATA.map((item) => item.address).filter(Boolean);
const TAILWIND_COLORS = DATA.map((item) => item.tailwindColor);
const RGB_COLORS = DATA.map((item) => item.rgbColor);

function getAddressPrefix(address) {
  return address.slice(0, 6);
}

const LegendItem = ({
  label, color, address, value,
}) => (
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
      const promises = [
        olasContract.methods.totalSupply().call(),
        ...ADDRESSES.map((address) => olasContract.methods.balanceOf(address).call()),
      ];

      const result = await Promise.allSettled(promises);

      const totalSupplyResult = result[0].value;
      const distributions = result
        .slice(1, result.length)
        .map((item) => item.value || 0);

      const circulatingSupply = totalSupplyResult > 0
        ? result[0].value
            - distributions.reduce((sum, item) => sum + item, 0n)
        : 0;

      setTotalSupply(formatEthers(totalSupplyResult));
      setData([
        ...distributions.map((item) => formatEthers(item)),
        formatEthers(circulatingSupply),
      ]);

      setLoading(false);
    };

    try {
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-8 p-4 border-b">
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Total Supply
          </h2>
          <div className="text-gradient text-4xl font-extrabold">
            {loading ? '--' : formatNumber(totalSupply)}
          </div>
          <div className="mb-4">
            <Verify url="https://etherscan.io/address/0x0001A500A6B18995B03f44bb040A5fFc28E45CB0#readContract#F16" />
          </div>
        </div>
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Circulating Supply
          </h2>
          <div className="text-gradient text-4xl font-extrabold">
            {loading ? '--' : formatNumber(data[data.length - 1])}
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
                      data,
                      backgroundColor: RGB_COLORS,
                      hoverBackgroundColor: RGB_COLORS,
                    },
                  ],
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-2 self-center w-full">
            {data.map((item, index) => (
              <LegendItem
                key={index}
                label={LABELS[index]}
                address={ADDRESSES[index]}
                color={TAILWIND_COLORS[index]}
                value={formatNumber(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
