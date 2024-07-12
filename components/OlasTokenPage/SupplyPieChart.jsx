import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import olasAbi from '../../data/ABIs/Olas.json';

// manually register arc element – required due to chart.js tree shaking
Chart.register(ArcElement);

const olasAddress = '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0';
const daoAddress = '0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE';
const buOlasAddress = '0xb09CcF0Dbf0C178806Aaee28956c74bd66d21f73';
const veOlasAddress = '0x7e01A500805f8A52Fad229b3015AD130A332B7b3';
const valoryAddress = '0x87cc0d34f6111c8A7A4Bdf758a9a715A3675f941';
const providerUrl = 'https://ethereum.publicnode.com';

const LABELS = [
  'veOLAS',
  'DAO Treasury',
  'buOLAS',
  'Valory',
  'Circulating supply',
];

const COLORS = {
  'bg-purple-500': '#A755F7',
  'bg-pink-500': '#E964C4',
  'bg-orange-400': '#FFB246',
  'bg-green-400': '#3FE681',
  'bg-cyan-500 ': '#09B4D7',
};

const TAILWIND_COLOR = Object.keys(COLORS);
const RGB_COLOR = Object.values(COLORS);

const LegendItem = ({ label, color, value }) => (
  <div className="flex gap-2 items-center w-full">
    <div className={`${color} px-3 py-1 rounded-sm`} />
    <span className="text-gray-600">{label}</span>
    <span className="ml-auto">{value}</span>
  </div>
);

LegendItem.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

function formatNumber(number) {
  return number.toLocaleString();
}

function formatEthers(value) {
  const weiValue = value;
  const divisor = 1000000000000000000n;
  const etherValue = weiValue / divisor;
  return Number(etherValue);
}

const SupplyPieChart = () => {
  const [data, setData] = useState([]);
  const [totalSupply, setTotalSupply] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

      const olasContract = new web3.eth.Contract(olasAbi, olasAddress);

      const promises = [
        olasContract.methods.totalSupply().call(),
        olasContract.methods.balanceOf(veOlasAddress).call(),
        olasContract.methods.balanceOf(daoAddress).call(),
        olasContract.methods.balanceOf(buOlasAddress).call(),
        olasContract.methods.balanceOf(valoryAddress).call(),
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
        </div>
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Circulating Supply
          </h2>
          <div className="text-gradient text-4xl font-extrabold">
            {loading ? '--' : formatNumber(data[data.length - 1])}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
          Total Supply Distribution
        </h2>
        <div className="flex flex-wrap gap-8 mb-4">
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
                      backgroundColor: RGB_COLOR,
                      hoverBackgroundColor: RGB_COLOR,
                    },
                  ],
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4 self-center flex-1 max-w-[300px]">
            {data.map((item, index) => (
              <LegendItem
                key={index}
                label={LABELS[index]}
                color={TAILWIND_COLOR[index]}
                value={formatNumber(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplyPieChart;
