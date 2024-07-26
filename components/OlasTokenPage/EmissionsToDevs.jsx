import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { tokenomicsGraphClient } from 'common-util/graphql/client';
import { emissionsQuery } from 'common-util/graphql/queries';
import { formatWeiNumber } from 'common-util/numberFormatter';
import { LegendItem } from './LegendItem';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

const MAX_MARGIN = 1.2;

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

  const devIncentivesPoints = data.map((item) => item.devIncentivesTotalTopUp || 0);
  const availableDevIncentivesPoints = data.map(
    (item) => item.availableDevIncentives || 0,
  );

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Actual emissions per epoch
      </h2>
      <div className="flex gap-4 mb-6">
        <LegendItem color="bg-slate-400" label="Available dev emissions" />
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
                    label: 'Emitted incentives',
                    data: devIncentivesPoints,
                    fill: true,
                    backgroundColor: 'rgba(9, 180, 215, 0.1)',
                    borderColor: '#09B4D7',
                  },
                  {
                    label: 'Available incentives',
                    data: availableDevIncentivesPoints,
                    fill: true,
                    backgroundColor: 'rgba(125, 138, 158, 0.1)',
                    borderColor: '#7D8A9E',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
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
                    max:
                      Math.max(
                        ...devIncentivesPoints,
                        ...availableDevIncentivesPoints,
                      ) * MAX_MARGIN,
                    ticks: {
                      callback(value) {
                        return formatWeiNumber(value);
                      },
                    },
                  },
                },
                interaction: {
                  intersect: false,
                  includeInvisible: true,
                  mode: 'nearest',
                  axis: 'x',
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      title: (tooltipItems) => `Epoch ${tooltipItems[0].label}`,
                      label: (tooltipItem) => `${tooltipItem.dataset.label}: ${formatWeiNumber(
                        tooltipItem.raw,
                      )}`,
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
