import React from "react";

import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

/**
 * Truncates an Ethereum address to show the first five characters, a ..., and the last three characters
 * @param {string} address - The Ethereum address to truncate
 * @returns {string} The truncated address
 */
export const truncateAddress = (address) =>
  address
    ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}`
    : "--";

const TOKEN_DETAILS = [
  {
    network: "Ethereum",
    address: "0x0001A500A6B18995B03f44bb040A5fFc28E45CB0",
    explorerBaseUrl: "https://etherscan.io/token/",
    exchange: {
      name: "Uniswap",
      url: "https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0",
    },
    bridge: null,
  },
  {
    network: "Gnosis",
    address: "0xcE11e14225575945b8E6Dc0D4F2dD4C570f79d9f",
    explorerBaseUrl: "https://gnosisscan.io/token/",
    exchange: {
      name: "Balancer",
      url: "https://app.balancer.fi/#/gnosis-chain/pool/0x79c872ed3acb3fc5770dd8a0cd9cd5db3b3ac985000200000000000000000067",
    },
    bridge: { name: "Omnibridge", url: "https://omni.gnosischain.com/bridge" },
  },
  {
    network: "Polygon",
    address: "0xFEF5d947472e72Efbb2E388c730B7428406F2F95",
    explorerBaseUrl: "https://polygonscan.com/token/",
    exchange: {
      name: "Balancer",
      url: "https://app.balancer.fi/#/polygon/pool/0x62309056c759c36879cde93693e7903bf415e4bc000200000000000000000d5f"
    },
    bridge: {
      name: "POS Bridge",
      url: "https://portal.polygon.technology/bridge",
    },
  },
  {
    network: "Solana",
    address: "Ez3nzG9ofodYCvEmw73XhQ87LWNYVRM2s7diB5tBZPyM",
    explorerBaseUrl: "https://solscan.io/token/",
    exchange: {
      name: "Orca",
      url: "https://www.orca.so/liquidity?address=5dMKUYJDsjZkAD3wiV3ViQkuq9pSmWQ5eAzcQLtDnUT3",
    },
    bridge: { name: "Portal", url: "https://portalbridge.com/" },
  },
];

const generateExplorerUrl = (token) => `${token.explorerBaseUrl}${token.address}`;


export const TokenDetails = () => (
  <>
    <a id="get-olas" />
    <SectionWrapper
      customClasses="border-b px-8 py-12 lg:p-24 text-black"
      backgroundType="SUBTLE_GRADIENT"
    >
      <div>
        <SectionHeading
          size="text-3xl sm:text-5xl lg:text-3xl xl:text-4xl lg:mb-10 text-center font-bold"
          color="text-black"
        >
          Token Details
        </SectionHeading>
        <div className="hidden md:block">
          <table className="table-auto w-full mt-6">
            <thead>
              <tr>
                <th className="px-4 py-4 text-left border">Network</th>
                <th className="px-4 py-4 text-left border">Get OLAS</th>
                <th className="px-4 py-4 text-left border">Token Address</th>
                <th className="px-4 py-4 text-left border">Bridge</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_DETAILS.map((token, index) => {
                const explorerUrl = generateExplorerUrl(token);
                return (
                <tr key={index}>
                  <td className="border px-4 py-4">{token.network}</td>
                  <td className="border px-4 py-4">
                    {token.exchange ? (
                      <a
                        href={token.exchange.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {token.exchange.name} ↗
                      </a>
                    ) : (
                      "TBD"
                    )}
                  </td>
                  <td className="border px-4 py-4 break-all">
                    <a
                      href={explorerUrl}
                      title={token.address}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {explorerUrl} ↗
                    </a>
                  </td>
                  <td className="border px-4 py-4">
                    {token.bridge ? (
                      <a
                        href={token.bridge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {token.bridge.name} ↗
                      </a>
                    ) : (
                      "n/a"
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex flex-col space-y-4">
          {TOKEN_DETAILS.map((token, index) => {
            const explorerUrl = generateExplorerUrl(token);
            return (
            <div key={index} className="border p-4 rounded">
              <h3 className="font-bold mb-2">{token.network}</h3>
              <p>
                <strong>Get OLAS:</strong>{" "}
                {token.exchange ? (
                  <a
                    href={token.exchange.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {token.exchange.name} ↗
                  </a>
                ) : (
                  "TBD"
                )}
              </p>
              <p>
                <strong>Token Address:</strong>{" "}
                <a
                  href={explorerUrl}
                  title={token.address}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateAddress(token.address)} ↗
                </a>
              </p>
              <p>
                <strong>Bridge:</strong>{" "}
                {token.bridge ? (
                  <a
                    href={token.bridge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {token.bridge.name} ↗
                  </a>
                ) : (
                  "n/a"
                )}
              </p>
            </div>
          )})}
        </div>
      </div>
    </SectionWrapper>
  </>
);
