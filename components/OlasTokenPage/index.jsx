import { BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { FLIPSIDE_URL } from 'common-util/constants';
import { tokenomicsGraphClient } from 'common-util/graphql/client';
import { emissionsQuery } from 'common-util/graphql/queries';
import { getTokenomicsContract, web3 } from 'common-util/web3';
import SectionWrapper from '../Layout/SectionWrapper';
import { ActualEmissionsChart } from './ActualEmissionsChart';
import { EmissionScheduleChart } from './EmissionScheduleChart';
import { EmissionsToBonders } from './EmissionsToBonders';
import { EmissionsToBuilders } from './EmissionsToBuilders';
import { EmissionsToOperators } from './EmissionsToOperators';
import Hero from './Hero';
import { LearnMoreAboutTokenomics } from './LearnMoreAboutTokenomics';
import { OlasUtility } from './OlasUtility';
import { SupplyPieChart } from './SupplyPieChart';
import { TokenDetails } from './TokenDetails';
import { TokenHoldersMetric } from './TokenHoldersMetric';
import { UsagePieChart } from './UsagePieChart';

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
        const emissionsData =
          await tokenomicsGraphClient.request(emissionsQuery);
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
        <div className="flex-row lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border rounded-lg mb-8 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Token Supply</h2>
            </div>
            <SupplyPieChart epoch={epoch} split={split} loading={loading} />
          </div>

          <div className="border rounded-lg mb-12 lg:mb-0 mb-8 lg:mb-0">
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

          <div className="border rounded-lg mb-8 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">
                Actual Emissions Schedule
              </h2>
              <p className="text-slate-500">
                What is the actual amount of OLAS minted by the protocol per
                epoch?
              </p>
            </div>
            <div className="p-4">
              <ActualEmissionsChart emissions={emissions} loading={loading} />
            </div>
          </div>

          <div className="border rounded-lg mb-8 lg:mb-0">
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

          <div className="flex flex-col border rounded-lg mb-8 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Builders</h2>
            </div>
            <EmissionsToBuilders emissions={emissions} loading={loading} />
          </div>

          <div className="flex flex-col border rounded-lg mb-8 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Bonders</h2>
            </div>
            <EmissionsToBonders emissions={emissions} loading={loading} />
          </div>

          <div className="flex flex-col border rounded-lg mb-8 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Operators</h2>
            </div>
            <EmissionsToOperators emissions={emissions} loading={loading} />
          </div>

          <div className="flex flex-col border rounded-lg place-content-center text-center mb-8 lg:mb-0 py-6">
            <div className="inline-block mx-auto mb-4">
              <Image
                src="/images/olas-token-page/flipside.svg"
                width={60}
                height={60}
                alt="Flipside logo"
              />
            </div>

            <h2 className="text-xl mb-4 font-bold">
              Dive into the current distribution details
            </h2>
            <a
              href={FLIPSIDE_URL}
              className="text-purple-500"
              rel="noopener noreferrer"
              target="_blank"
            >
              Visit OLAS Flipside dashboard ↗
            </a>
          </div>

          <div className="flex flex-col col-span-2 border rounded-lg py-6 px-4">
            <h2 className="text-xl mb-4 font-bold">Learn more</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div className="flex flex-col gap-3">
                <span>
                  <Link href="/faq" className="text-purple-600">
                    Token allocation at launch and other FAQ
                  </Link>
                </span>
                <span>
                  <Link
                    href="https://coinmarketcap.com/currencies/autonolas/"
                    className="text-purple-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CoinMarketCap ↗
                  </Link>
                </span>
                <span>
                  <Link
                    href="https://www.coingecko.com/en/coins/autonolas"
                    className="text-purple-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CoinGecko ↗
                  </Link>
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <span>Convenience API endpoints:</span>
                <span>
                  <Link
                    href="https://api.olas.autonolas.tech/total_supply"
                    className="text-purple-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Total Supply ↗
                  </Link>
                </span>
                <span>
                  <Link
                    href="https://api.olas.autonolas.tech/circulating_supply"
                    className="text-purple-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Circulating Supply ↗
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

const OlasToken = () => (
  <>
    <Hero />
    <TokenHoldersMetric />
    <Supply />
    <OlasUtility />
    <TokenDetails />
    <LearnMoreAboutTokenomics />
  </>
);

export default OlasToken;
