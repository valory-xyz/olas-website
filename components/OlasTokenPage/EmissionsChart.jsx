import PropTypes from 'prop-types';
import React from 'react';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import {
  Chart, CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import Verify from '../Verify';

// manually register arc element, category scale, linear scale,
// and bar element – required due to chart.js tree shaking
Chart.register(CategoryScale, LinearScale, BarElement);

const BACKUP_INFLATION_FOR_YEAR = [
  '3159000',
  '40254084',
  '71239135.5',
  '67347922.22',
  '62539734.28',
  '57193406.97',
  '51626757.14',
  '46088099.54',
  '40758191.75',
  '33293668.6',
  '20000000',
  '20400000',
  '20808000',
];

const EmissionsChart = ({
  inflationForYear,
  timeLaunch,
  currentYear,
  loading,
}) => (
  <>
    <div className="flex p-4 border-b">
      <div className="mr-8">
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
          Launch Date
        </h2>
        <div className="text-4xl font-extrabold">
          <span className="text-gradient">
            {loading
              ? '--'
              : dayjs.unix(timeLaunch?.toString()).format("DD MMM 'YY")}
          </span>
        </div>
        <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F40" />
      </div>
      <div>
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
          Current Year
        </h2>
        <div className="text-4xl font-extrabold">
          <span className="text-gradient">
            {loading ? '--' : Number(currentYear)}
          </span>
        </div>
        <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F9" />
      </div>
    </div>
    <div className="p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
        Max Emissions Per Year
      </h2>
      <div className="mb-4">
        {loading ? (
          'Loading...'
        ) : (
          <Bar
            data={{
              labels: inflationForYear.map((_, index) => index),
              datasets: [
                {
                  label: 'Inflation',
                  data: inflationForYear || BACKUP_INFLATION_FOR_YEAR,
                  borderWidth: 0,
                  // #a855f7 is Tailwind's purple-500 – our primary brand color
                  backgroundColor: '#a855f7',
                  hoverBackgroundColor: '#a855f7',
                  hoverBorderColor: '#a855f7',
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Year',
                  },
                  gridLines: {
                    color: 'white',
                  },
                },
                y: {
                  // Y-axis configuration
                  title: {
                    display: true,
                    text: 'OLAS Emitted',
                  },
                  ticks: {
                    callback(value) {
                      // Format y-axis numbers as 20m, not 20,000,000
                      return `${value / 1000000}m`;
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>

      <p className="mb-4">
        A maximum of 1bn OLAS tokens can be minted in the protocol&apos;s
        first 10 years.
      </p>
      <p className="mb-4">
        After year 10, an additional 2% can be minted each year. This 2%
        inflation rate can be reduced by the DAO.
      </p>
      <div className="mb-4">
        <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F19" />
      </div>
    </div>
  </>
);

EmissionsChart.propTypes = {
  inflationForYear: PropTypes.arrayOf(PropTypes.string),
  timeLaunch: PropTypes.bigint,
  currentYear: PropTypes.bigint,
  loading: PropTypes.bool.isRequired,
};

EmissionsChart.defaultProps = {
  inflationForYear: [],
  timeLaunch: null,
  currentYear: null,
};

export default EmissionsChart;
