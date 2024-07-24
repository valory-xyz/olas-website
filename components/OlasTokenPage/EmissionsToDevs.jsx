import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
} from 'chart.js';
import { tokenomicsGraphClient } from 'common-util/graphql/client';
import { emissionsQuery } from 'common-util/graphql/queries';
import { formatWeiNumber } from 'common-util/numberFormatter';
import { LegendItem } from './LegendItem';

Chart.register(
  LineElement,
  PointElement,
);

const MAX_MARGIN = 1.3;

export const EmissionsToDevs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await tokenomicsGraphClient.request(emissionsQuery);
        setData(res.epoches);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching emissions data:', error);
      }
    };

    fetchData();
  }, []);

  const chartPoints = data.map((item) => item.devIncentivesTotalTopUp || 0);

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Actual emissions per epoch
      </h2>
      <div className="mb-6">
        <LegendItem color="bg-cyan-500" label="Dev rewards emitted" />
      </div>
      <div className="flex flex-col flex-auto gap-8">
        <div className="flex-auto">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Line
              data={{
                labels: data.map((item) => item.counter),
                datasets: [
                  {
                    data: chartPoints,
                    fill: true,
                    borderColor: '#09B4D7',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Important to set this to false
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Epoch',
                    },
                    gridLines: {
                      color: 'white',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'OLAS Emitted',
                    },
                    max: Math.max(...chartPoints) * MAX_MARGIN,
                    ticks: {
                      callback(value) {
                        return formatWeiNumber(value);
                      },
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
