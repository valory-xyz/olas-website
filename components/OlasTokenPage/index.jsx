import React, { useState, useEffect } from 'react';
import {
  Chart, CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import { web3, getTokenomicsContract } from 'common-util/web3';
import { emissionsQuery } from 'common-util/graphql/queries';
import { tokenomicsGraphClient } from 'common-util/graphql/client';
import Hero from './Hero';
import { TokenDetails } from './TokenDetails';
import { OlasUtility } from './OlasUtility';
import SectionWrapper from '../Layout/SectionWrapper';
import { UsagePieChart } from './UsagePieChart';
import { SupplyPieChart } from './SupplyPieChart';
import { EmissionScheduleChart } from './EmissionScheduleChart';
import { EmissionsToBuilders } from './EmissionsToBuilders';
import { EmissionsToBonders } from './EmissionsToBonders';
import { LearnMoreAboutTokenomics } from './LearnMoreAboutTokenomics';
import { EmissionsToOperators } from './EmissionsToOperators';

// manually register arc element, category scale, linear scale,
// and bar element – required due to chart.js tree shaking
Chart.register(CategoryScale, LinearScale, BarElement);

const tokenomicsContract = getTokenomicsContract();

const Supply = () => {
  const [epoch, setEpoch] = useState(null);
  const [split, setSplit] = useState({});
  const [timeLaunch, setTimeLaunch] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [inflationForYear, setInflationForYear] = useState([]);
  const [emissions, setEmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const newTimeLaunch = await tokenomicsContract.methods
          .timeLaunch()
          .call();
        setTimeLaunch(newTimeLaunch);

        // Call getInflationForYear method repeatedly for 0 through 12
        const newInflationForYear = Array.from({ length: 12 }, () => null);
        const promises = [];

        for (let i = 0; i <= 12; i += 1) {
          promises.push(
            tokenomicsContract.methods
              .getInflationForYear(i)
              .call()
              .then((result) => {
                newInflationForYear[i] = web3.utils.fromWei(
                  result.toString(),
                  'ether',
                );
                return result;
              })
              .catch((error) => {
                newInflationForYear.push(undefined); // Push undefined if promise fails
                console.error(
                  `Error in getInflationForYear for year ${i}:`,
                  error,
                );
              }),
          );
        }

        await Promise.all(promises);
        setInflationForYear(newInflationForYear);

        const newCurrentYear = await tokenomicsContract.methods
          .currentYear()
          .call();
        setCurrentYear(newCurrentYear);

        // Call epochCounter to get the current epoch
        const newEpoch = await tokenomicsContract.methods.epochCounter().call();
        setEpoch(newEpoch);
        // Use the result as the parameter for mapEpochTokenomics
        const tokenomicsResult = await tokenomicsContract.methods
          .mapEpochTokenomics(newEpoch)
          .call();
        // 6 is the index of the bonders % value
        const bonders = Number(tokenomicsResult['6']);

        // staking
        const stakingResult = await tokenomicsContract.methods
          .mapEpochStakingPoints(newEpoch)
          .call();
        const staking = Number(stakingResult['3']);

        // subtract bonders % from 100 to get developers %
        const developers = 100 - (staking + bonders);
        setSplit({
          staking,
          bonders,
          developers,
        });

        // emissions
        const emissionsData = await tokenomicsGraphClient.request(
          emissionsQuery,
        );
        setEmissions(
          // Filter out the current epoch, because it may contain incorrect data
          emissionsData.epoches.filter(
            (epochEmissions) => epochEmissions.counter !== Number(newEpoch),
          ),
        );

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-black border-b" id="supply">
      <SectionWrapper>
        <div className="text-5xl font-bold mb-16 tracking-tight text-black text-center">
          Supply
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Token Supply</h2>
            </div>
            <SupplyPieChart epoch={epoch} split={split} loading={loading} />
          </div>

          <div className="border rounded-lg mb-12 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emission Schedule</h2>
              <p className="text-slate-500">
                What is the maximum amount of OLAS that can be minted by the
                protocol over time?
              </p>
            </div>
            <EmissionScheduleChart
              inflationForYear={inflationForYear}
              timeLaunch={timeLaunch}
              currentYear={currentYear}
              loading={loading}
            />
          </div>

          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Current Usage</h2>
              <p className="text-slate-500">
                What are newly minted tokens used for right now?
              </p>
            </div>
            <div className="p-4">
              <UsagePieChart epoch={epoch} split={split} loading={loading} />
            </div>
          </div>

          <div className="flex flex-col border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Builders</h2>
            </div>
            <EmissionsToBuilders emissions={emissions} loading={loading} />
          </div>

          <div className="flex flex-col border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Bonders</h2>
            </div>
            <EmissionsToBonders emissions={emissions} loading={loading} />
          </div>

          <div className="flex flex-col border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Operators</h2>
            </div>
            <EmissionsToOperators emissions={emissions} loading={loading} />
          </div>
        </div>

        {/* Dive into the current distribution details */}
        <div className="text-center">
          <div className="inline-block mx-auto mb-4">
            <svg
              width="60"
              height="60"
              viewBox="0 0 77 77"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M38.4836 76.9395C59.7328 76.9395 76.9587 59.7159 76.9587 38.4698C76.9587 17.2235 59.7328 0 38.4836 0C17.2344 0 0.00854492 17.2235 0.00854492 38.4698C0.00854492 59.7159 17.2344 76.9395 38.4836 76.9395Z"
                fill="#F06040"
              />
              <path
                d="M60.9224 7.22589C54.742 2.78685 47.3841 0.279925 39.7788 0.0221C32.1736 -0.235723 24.6626 1.76715 18.1958 5.77743C11.729 9.78772 6.5968 15.6253 3.44814 22.5521C0.299489 29.4786 -0.724171 37.1834 0.506611 44.6918C1.73739 52.2001 5.16734 59.1751 10.3627 64.7343C15.5581 70.2937 22.2854 74.1878 29.6944 75.9241C37.1031 77.6607 44.8606 77.1613 51.9856 74.4896C59.1106 71.8179 65.2833 67.0936 69.7231 60.9142C72.6709 56.8112 74.7816 52.1678 75.9347 47.2492C77.0879 42.3306 77.2608 37.2331 76.4435 32.2475C75.6263 27.2622 73.8351 22.4864 71.1719 18.1933C68.5088 13.9 65.0259 10.1733 60.9224 7.22589Z"
                fill="#F1603F"
              />
              <path
                d="M6.69849 60.1701C6.69849 60.1701 32.1232 51.8422 76.933 37.2314C76.933 37.2314 79.3874 61.1586 54.5821 73.6391C54.5821 73.6391 42.3499 79.5017 28.9302 75.741C28.9302 75.741 15.5673 73.2187 6.69849 60.1701Z"
                fill="#2B286C"
              />
            </svg>
          </div>

          <h2 className="text-xl mb-4 font-bold">
            Dive into the current distribution details
          </h2>
          <a
            href="https://dune.com/adrian0x/olas"
            className="text-purple-500"
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit OLAS Dune dashboard ↗
          </a>
        </div>
      </SectionWrapper>
    </div>
  );
};

const OlasToken = () => (
  <>
    <Hero />
    <Supply />
    <OlasUtility />
    <TokenDetails />
    <LearnMoreAboutTokenomics />
  </>
);

export default OlasToken;
