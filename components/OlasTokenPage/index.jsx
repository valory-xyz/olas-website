import React, { useState, useEffect } from "react";
import Hero from "./Hero";
import Contracts from "./Contracts";
import OlasUtility from "../HomepageSection/OlasUtility";
import SectionWrapper from "../Layout/SectionWrapper";
import Web3 from "web3";
import dayjs from "dayjs";
import contractAbi from "../../data/ABIs/TokenomicsProxy.json";
import UsagePieChart from "./UsagePieChart";
import Verify from "../Verify";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";

// manually register arc element, category scale, linear scale, and bar element – required due to chart.js tree shaking
Chart.register(CategoryScale, LinearScale, BarElement);

const BACKUP_INFLATION_FOR_YEAR = [
  "3159000",
  "40254084",
  "71239135.5",
  "67347922.22",
  "62539734.28",
  "57193406.97",
  "51626757.14",
  "46088099.54",
  "40758191.75",
  "33293668.6",
  "20000000",
  "20400000",
  "20808000"
]

export const TEXT_GRADIENT =
  "bg-clip-text text-transparent bg-gradient-to-tr from-purple-600 to-purple-400";

const contractAddress = "0xc096362fa6f4A4B1a9ea68b1043416f3381ce300";
const providerUrl = 'https://ethereum.publicnode.com';

const Supply = () => {
  const [epoch, setEpoch] = useState(null);
  const [split, setSplit] = useState({});
  const [timeLaunch, setTimeLaunch] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [inflationForYear, setInflationForYear] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

      const contractInstance = new web3.eth.Contract(
        contractAbi,
        contractAddress
      );

      const timeLaunch = await contractInstance.methods.timeLaunch().call();
      setTimeLaunch(timeLaunch);

      // Call getInflationForYear method repeatedly for 0 through 12
      const inflationForYear = [];

      for (let i = 0; i <= 12; i++) {
        try {
          const result = await contractInstance.methods
            .getInflationForYear(i)
            .call();
          // Convert result from wei to eth
          inflationForYear.push(web3.utils.fromWei(result.toString(), "ether"));
        } catch (error) {
          console.error(`Error in getInflationForYear for year ${i}:`, error);
        }
      }

      setInflationForYear(inflationForYear);

      const currentYear = await contractInstance.methods.currentYear().call();
      setCurrentYear(currentYear);

      // Call epochCounter to get the current epoch
      const epoch = await contractInstance.methods.epochCounter().call();
      setEpoch(epoch);

      // Use the result as the parameter for mapEpochTokenomics
      const result = await contractInstance.methods
        .mapEpochTokenomics(epoch)
        .call();
      // 6 is the index of the bonders % value
      const bonders = Number(result["6"]);
      // subtract bonders % from 100 to get developers %
      const developers = 100 - bonders;
      setSplit({
        bonders,
        developers,
      });

      setLoading(false);
    };

    try {
      fetchData();
    } catch (error) {
      notifyError('Could not get data');
      console.error('Error fetching data:', error);
    }
  }, []);

  return (
    <div className="text-black border-b" id="supply">
      <SectionWrapper>
        <div className="text-5xl font-bold font-manrope mb-4 tracking-tight text-black text-center">
          Supply
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <div className="border rounded-lg mb-12 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-xl mb-2 font-bold">Emission Schedule</h2>
              <p className="text-slate-500">
                How are OLAS tokens minted by the protocol over time?
              </p>
            </div>
            <div className="flex p-4 border-b">
              <div className="mr-8">
                <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
                  Launch Date
                </h2>
                <div className="text-4xl font-extrabold">
                  <span className={TEXT_GRADIENT}>
                    {loading ? '--' : dayjs.unix(timeLaunch?.toString()).format("DD MMM 'YY")}
                  </span>
                </div>
                <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F40" />
              </div>
              <div>
                <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
                  Current Year
                </h2>
                <div className="text-4xl font-extrabold">
                  <span className={TEXT_GRADIENT}>
                    {loading ? '--' : Number(currentYear)}
                  </span>
                </div>
                <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F9" />
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
                Emissions Per Year
              </h2>
              <div className="mb-4">
                {loading ? 'Loading...' :
                <Bar
                  data={{
                    labels: inflationForYear.map((_, index) => index),
                    datasets: [
                      {
                        label: "Inflation",
                        data: inflationForYear || BACKUP_INFLATION_FOR_YEAR,
                        borderWidth: 0,
                        // #a855f7 is Tailwind's purple-500 – our primary brand color
                        backgroundColor: "#a855f7",
                        hoverBackgroundColor: "#a855f7",
                        hoverBorderColor: "#a855f7",
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Year",
                        },
                        gridLines: {
                          color: "white",
                        },
                      },
                      y: {
                        // Y-axis configuration
                        title: {
                          display: true,
                          text: "OLAS Emitted",
                        },
                        ticks: {
                          callback: function (value, index, values) {
                            // Format y-axis numbers as 20m, not 20,000,000
                            return value / 1000000 + "m";
                          },
                        },
                      },
                    },
                  }}
                />}
              </div>

              <p className="mb-4">
                A maximum of 1bn OLAS tokens can be minted in the
                protocol&apos;s first 10 years.
              </p>
              <p className="mb-4">
                After year 10, an additional 2% can be minted each year. This 2%
                inflation rate can be reduced by the DAO.
              </p>
              <div className="mb-4">
                <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F19" />
              </div>
            </div>
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

const OlasToken = () => {
  return (
    <>
      <Hero />
      <Supply />
      <OlasUtility />
      <Contracts />
    </>
  );
};

export default OlasToken;
