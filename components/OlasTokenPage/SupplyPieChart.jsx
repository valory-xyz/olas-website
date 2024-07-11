import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from "chart.js";
import { TEXT_GRADIENT } from "styles/globals";
import olasAbi from "../../data/ABIs/Olas.json";

// manually register arc element – required due to chart.js tree shaking
Chart.register(ArcElement);


const olasAddress = "0x0001A500A6B18995B03f44bb040A5fFc28E45CB0";
const providerUrl = "https://ethereum.publicnode.com";

const LABELS = [
  "veOLAS",
  "DAO Treasury",
  "buOLAS",
  "Valory",
  "Est. circulating supply",
];

const COLORS = {
  "bg-purple-500": "#A755F7",
  "bg-pink-500": "#E964C4",
  "bg-orange-400": "#FFB246",
  "bg-green-400": "#3FE681",
  "bg-cyan-500 ": "#09B4D7",
};

const TAILWIND_COLOR = Object.keys(COLORS);
const RGB_COLOR = Object.values(COLORS);

const LegendItem = ({ label, color, value }) => (
  <div className="flex gap-2 items-center w-full">
    <div className={`${color} px-3 py-1 rounded-sm`} />
    {label}
    <span className="ml-auto">{value}</span>
  </div>
);

LegendItem.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

function formatNumber(number) {
  return Math.floor(number/ Math.pow(10, 18)).toLocaleString();
}

const SupplyPieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

      const olasContract = new web3.eth.Contract(olasAbi, olasAddress);

      const promises = [];

      promises.push(
          olasContract.methods
            .totalSupply()
            .call()
      );

      const result = await Promise.allSettled(promises);

      setData([result.map(item => item.value || 0), 0, 0, 0, 0]);

      setLoading(false);
    };

    try {
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <>
      <div className="flex gap-8 p-4 border-b">
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Total Supply
          </h2>
          <div className="text-4xl font-extrabold">
            <span className={TEXT_GRADIENT}>
              {loading ? "--" : formatNumber(data[0])}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Circulating Supply
          </h2>
          <div className="text-4xl font-extrabold">
            <span className={TEXT_GRADIENT}>
              {loading ? "--" : formatNumber(data[0])}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
          Total Supply Distribution
        </h2>
        <div className="flex gap-8 mb-4">
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

          <div className="flex flex-col gap-2 mb-4 self-center flex-1">
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
