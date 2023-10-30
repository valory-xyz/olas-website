import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import Verify from "../Verify";
import { TEXT_GRADIENT } from ".";

// manually register arc element – required due to chart.js tree shaking
Chart.register(ArcElement);

const UsagePieChart = ({ epoch, split, loading }) => {
  return (
    <>
      <div>
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase">
            Current Epoch
          </h2>
          <div className="text-4xl font-extrabold">
            <span className={TEXT_GRADIENT}>
              {loading ? "--" : epoch?.toString()}
              {!loading && }
            </span>
          </div>
          <div className="mb-4">
            <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F15" />
          </div>
          <p className="mb-8 text-slate-500">
            Tokens are distributed to developers and bonders each epoch. Epochs
            run roughly once a month.
          </p>
        </div>
        <div>
          <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
            Per Epoch Distribution
          </h2>
          <div className="text-center mb-4">
            <span className="text-cyan-500 font-bold">
              {loading ? "--" : split?.developers}%
            </span>{" "}
            of new tokens go to{" "}
            <Link href="/dev-rewards" className="text-cyan-500 font-bold">
              Developers
            </Link>
          </div>
          <div className="mb-4 max-w-[300px] mx-auto">
            {loading ? (
              <div className="text-center">
              Loading...
              </div>
            ) : (
              <Pie
                data={{
                  labels: ["Developers", "Bonders"],
                  datasets: [
                    {
                      data: [split.developers, split.bonders] || [0,0],
                      backgroundColor: ["#cffafe", "#a855f7"],
                      hoverBackgroundColor: ["#cffafe", "#a855f7"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
          <div className="text-center mb-4">
            <span className="text-purple-600 font-bold">
              {loading ? "--" : split?.bonders}%
            </span>{" "}
            of new tokens go to{" "}
            <Link href="/bonds" className="text-purple-600 font-bold">
              Bonders
            </Link>
          </div>
          <div className="text-center mb-4">
            <Verify url="https://etherscan.io/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readProxyContract#F27" />
          </div>
          <p className="text-slate-500">
            DAO members can vote to update how newly minted tokens are
            distributed.
          </p>
        </div>
      </div>
    </>
  );
};

export default UsagePieChart;
