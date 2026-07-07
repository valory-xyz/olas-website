import { BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import { isNil } from 'lodash';
import Link from 'next/link';

import { COINGECKO_URL, OLAS_API_URL } from 'common-util/constants';
import { GetInvolved } from 'components/OlasTokenPage/GetInvolved';
import { ProtocolAudits } from 'components/ProtocolPage/ProtocolAudits';
import SectionWrapper from '../Layout/SectionWrapper';
import { ActualEmissionsChart } from './ActualEmissionsChart';
import { EmissionScheduleChart } from './EmissionScheduleChart';
import { EmissionsToBonders } from './EmissionsToBonders';
import { EmissionsToBuilders } from './EmissionsToBuilders';
import { EmissionsToOperators } from './EmissionsToOperators';
import { Hero } from './Hero';
import { LearnMoreAboutTokenomics } from './LearnMoreAboutTokenomics';
import { OlasProtocol } from './OlasProtocol';
import { SupplyPieChart } from './SupplyPieChart';
import { TokenDetails } from './TokenDetails';
import { TokenHoldersMetric } from './TokenHoldersMetric';
import { UsagePieChart } from './UsagePieChart';

// manually register arc element, category scale, linear scale,
// and bar element – required due to chart.js tree shaking
Chart.register(CategoryScale, LinearScale, BarElement);

const Supply = ({ metrics }) => {
  const tokenomics = metrics?.tokenomics;

  const schedule = tokenomics?.emissionSchedule?.value;
  const epochDistribution = tokenomics?.epochDistribution?.value;
  const emissions = tokenomics?.emissions?.value ?? [];

  const scheduleLoading = isNil(schedule);
  const epochLoading = isNil(epochDistribution);
  const emissionsLoading = isNil(tokenomics?.emissions?.value);

  return (
    <div className="text-black border-b" id="supply">
      <SectionWrapper id="supply">
        <div className="text-5xl font-bold mb-16 tracking-tight text-black text-center">Supply</div>
        <div className="flex-row lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border rounded-lg mb-8 lg:mb-0">
            <div id="token-supply" />
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Token Supply</h2>
            </div>
            <SupplyPieChart supplyDistribution={tokenomics?.supplyDistribution} />
          </div>

          <div id="max-emission-schedule" className="border rounded-lg mb-12 lg:mb-0 mb-8 lg:mb-0">
            <div id="emission-schedule" />
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Max Emission Schedule</h2>
              <p className="text-slate-500">
                What is the maximum amount of OLAS that can be minted by the protocol over time?
              </p>
            </div>
            <EmissionScheduleChart
              inflationForYear={schedule?.inflationForYear}
              timeLaunch={schedule?.timeLaunch}
              currentYear={schedule?.currentYear}
              loading={scheduleLoading}
            />
          </div>

          <div className="border rounded-lg mb-8 lg:mb-0">
            <div id="current-usage" />
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Current Usage</h2>
              <p className="text-slate-500">What are newly minted tokens used for right now?</p>
            </div>
            <div className="p-4">
              <UsagePieChart
                epoch={epochDistribution?.epoch}
                split={epochDistribution?.split ?? {}}
                loading={epochLoading}
              />
            </div>
          </div>

          <div id="actual-emissions" className="border rounded-lg mb-8 lg:mb-0">
            <div id="emissions-schedule" />
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Actual Emissions</h2>
              <p className="text-slate-500">What are the OLAS emissions per epoch</p>
            </div>
            <div className="p-4">
              <ActualEmissionsChart emissions={emissions} loading={emissionsLoading} />
            </div>
          </div>

          <div className="flex flex-col border rounded-lg mb-8 lg:mb-0">
            <div id="emissions-to-builders" />
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Builders</h2>
            </div>
            <EmissionsToBuilders emissions={emissions} loading={emissionsLoading} />
          </div>

          <div className="flex flex-col border rounded-lg mb-8 lg:mb-0">
            <div id="emissions-to-bonders" />
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Bonders</h2>
            </div>
            <EmissionsToBonders emissions={emissions} loading={emissionsLoading} />
          </div>

          <div className="flex flex-col border rounded-lg mb-8 lg:mb-0">
            <div id="emissions-to-operators" />
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emissions to Operators</h2>
            </div>
            <EmissionsToOperators emissions={emissions} loading={emissionsLoading} />
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
                    href={`${COINGECKO_URL}/en/coins/autonolas`}
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
                    href={`${OLAS_API_URL}/total_supply`}
                    className="text-purple-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Total Supply ↗
                  </Link>
                </span>
                <span>
                  <Link
                    href={`${OLAS_API_URL}/circulating_supply`}
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

const OlasToken = ({ metrics }) => (
  <>
    <Hero />
    <TokenHoldersMetric metrics={metrics} />
    <Supply metrics={metrics} />
    <OlasProtocol />
    <GetInvolved />
    <TokenDetails />
    <ProtocolAudits />
    <LearnMoreAboutTokenomics />
  </>
);

export default OlasToken;
