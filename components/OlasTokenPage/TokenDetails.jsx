import React from 'react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

/**
 * Truncates an Ethereum address to show the first five characters, a ...,
 * and the last three characters
 * @param {string} address - The Ethereum address to truncate
 * @returns {string} The truncated address
 */
export const truncateAddress = (address) =>
  address
    ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}`
    : '--';

const BOND_BASE_URL = 'https://bond.olas.network/paths/';

const TOKEN_DETAILS = [
  {
    network: 'Ethereum',
    address: '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0',
    explorerBaseUrl: 'https://etherscan.io/token/',
    exchange: {
      name: 'Uniswap',
      url: 'https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0',
    },
    bridge: null,
    bond: {
      guideUrl: `${BOND_BASE_URL}olas-eth-via-uniswap-on-ethereum`,
      lpTokenName: 'OLAS-ETH',
      bridgedLpTokenAddress: null,
      lpTokenAddress: '0x09d1d767edf8fa23a64c51fa559e0688e526812f',
      bridge: null,
    },
  },
  {
    network: 'Gnosis',
    address: '0xcE11e14225575945b8E6Dc0D4F2dD4C570f79d9f',
    explorerBaseUrl: 'https://gnosisscan.io/token/',
    exchange: {
      name: 'Balancer',
      url: 'https://app.balancer.fi/#/gnosis-chain/pool/0x79c872ed3acb3fc5770dd8a0cd9cd5db3b3ac985000200000000000000000067',
    },
    bridge: { name: 'Gnosis Bridge', url: 'https://bridge.gnosischain.com/' },
    bond: {
      guideUrl: `${BOND_BASE_URL}olas-wxdai-via-balancer-on-gnosis-chain`,
      lpTokenName: 'OLAS-WXDAI',
      bridgedLpTokenAddress: '0x27df632fd0dcf191c418c803801d521cd579f18e',
      lpTokenAddress: '0x79c872ed3acb3fc5770dd8a0cd9cd5db3b3ac985',
      lpTokenBridge: {
        name: 'Gnosis Bridge',
        url: 'https://bridge.gnosischain.com/',
      },
    },
  },
  {
    network: 'Polygon POS',
    address: '0xFEF5d947472e72Efbb2E388c730B7428406F2F95',
    explorerBaseUrl: 'https://polygonscan.com/token/',
    exchange: {
      name: 'Balancer',
      url: 'https://app.balancer.fi/#/polygon/pool/0x62309056c759c36879cde93693e7903bf415e4bc000200000000000000000d5f',
    },
    bridge: {
      name: 'Polygon Portal',
      url: 'https://portal.polygon.technology/bridge',
    },
    bond: {
      guideUrl: `${BOND_BASE_URL}olas-wmatic-via-balancer-on-polygon-pos`,
      lpTokenName: 'WMATIC-OLAS',
      bridgedLpTokenAddress: '0xf9825A563222f9eFC81e369311DAdb13D68e60a4',
      lpTokenAddress: '0x62309056c759c36879cde93693e7903bf415e4bc',
      lpTokenBridge: {
        name: 'Wormhole: Portal Token Bridge',
        url: 'https://portalbridge.com/advanced-tools/#/transfer',
      },
    },
  },
  {
    network: 'Arbitrum',
    address: '0x064f8b858c2a603e1b106a2039f5446d32dc81c1',
    explorerBaseUrl: 'https://arbiscan.io/token/',
    exchange: {
      name: 'Balancer',
      url: 'https://app.balancer.fi/#/arbitrum/pool/0xaf8912a3c4f55a8584b67df30ee0ddf0e60e01f80002000000000000000004fc',
    },
    bridge: {
      name: 'Arbitrum Bridge',
      url: 'https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum',
    },
    bond: {
      guideUrl: `${BOND_BASE_URL}olas-weth-via-balancer-on-arbitrum`,
      lpTokenName: 'OLAS-WETH',
      bridgedLpTokenAddress: '0x36B203Cb3086269f005a4b987772452243c0767f',
      lpTokenAddress: '0xaf8912a3c4f55a8584b67df30ee0ddf0e60e01f8',
      lpTokenBridge: {
        name: 'Wormhole: Portal Token Bridge',
        url: 'https://portalbridge.com/advanced-tools/#/transfer',
      },
    },
  },
  {
    network: 'Solana',
    address: 'Ez3nzG9ofodYCvEmw73XhQ87LWNYVRM2s7diB5tBZPyM',
    explorerBaseUrl: 'https://solscan.io/token/',
    exchange: {
      name: 'Orca',
      url: 'https://www.orca.so/pools?tokens=Ez3nzG9ofodYCvEmw73XhQ87LWNYVRM2s7diB5tBZPyM&tokens=So11111111111111111111111111111111111111112',
    },
    bridge: {
      name: 'Wormhole: Portal Token Bridge',
      url: 'https://portalbridge.com/advanced-tools/#/transfer',
    },
    bond: {
      guideUrl: `${BOND_BASE_URL}wsol-olas-via-orca-on-solana`,
      lpTokenName: 'WSOL-OLAS',
      bridgedLpTokenAddress: '0x3685b8cc36b8df09ed9e81c1690100306bf23e04',
      lpTokenAddress: 'CeZ77ti3nPAmcgRkBkUC1JcoAhR8jRti2DHaCcuyUnzR',
      lpTokenBridge: {
        name: 'Wormhole: Portal Token Bridge',
        url: 'https://portalbridge.com/advanced-tools/#/transfer',
      },
    },
  },
  {
    network: 'Optimism',
    address: '0xFC2E6e6BCbd49ccf3A5f029c79984372DcBFE527',
    explorerBaseUrl: 'https://optimistic.etherscan.io/token/',
    exchange: {
      name: 'Balancer',
      url: 'https://app.balancer.fi/#/optimism/pool/0x5bb3e58887264b667f915130fd04bbb56116c27800020000000000000000012a',
    },
    bridge: {
      name: 'Optimism Bridge',
      url: 'https://app.optimism.io/bridge/deposit',
    },
    bond: {
      guideUrl: `${BOND_BASE_URL}weth-olas-via-balancer-on-optimism`,
      lpTokenName: 'WETH-OLAS',
      bridgedLpTokenAddress: '0x2FD007a534eB7527b535a1DF35aba6bD2a8b660F',
      lpTokenAddress: '0x5BB3E58887264B667f915130fD04bbB56116C278',
      lpTokenBridge: {
        name: 'Wormhole: Portal Token Bridge',
        url: 'https://portalbridge.com/advanced-tools/#/transfer',
      },
    },
  },
  {
    network: 'Base',
    address: '0x54330d28ca3357F294334BDC454a032e7f353416',
    explorerBaseUrl: 'https://basescan.org/token/',
    exchange: {
      name: 'Balancer',
      url: 'https://app.balancer.fi/#/base/pool/0x5332584890d6e415a6dc910254d6430b8aab7e69000200000000000000000103',
    },
    bridge: {
      name: 'Base Bridge',
      url: 'https://etherscan.io/address/0x3154cf16ccdb4c6d922629664174b904d80f2c35',
    },
    bond: {
      guideUrl: `${BOND_BASE_URL}olas-usdc-via-balancer-on-base`,
      lpTokenName: 'OLAS-USDC',
      bridgedLpTokenAddress: '0x9946d6FD1210D85EC613Ca956F142D911C97a074',
      lpTokenAddress: '0x5332584890d6e415a6dc910254d6430b8aab7e69',
      lpTokenBridge: {
        name: 'Wormhole: Portal Token Bridge',
        url: 'https://portalbridge.com/advanced-tools/#/transfer',
      },
    },
  },
  {
    network: 'Celo',
    address: '0xaCFfAe8e57Ec6E394Eb1b41939A8CF7892DbDc51',
    explorerBaseUrl: 'https://celoscan.io/token/',
    exchange: {
      name: 'Ubeswap',
      url: 'https://app.ubeswap.org/#/swap?inputCurrency=0x471ece3750da237f93b8e339c536989b8978a438&outputCurrency=0xacffae8e57ec6e394eb1b41939a8cf7892dbdc51',
    },
    bridge: {
      name: 'Wormhole: Portal Token Bridge',
      url: 'https://portalbridge.com/advanced-tools/#/transfer',
    },
    bond: {
      guideUrl: `${BOND_BASE_URL}celo-olas-via-ubeswap-on-celo`,
      lpTokenName: 'CELO-OLAS',
      bridgedLpTokenAddress: '0xC085F31E4ca659fF8A17042dDB26f1dcA2fBdAB4',
      lpTokenAddress: '0x2976Fa805141b467BCBc6334a69AffF4D914d96A',
      lpTokenBridge: {
        name: 'Wormhole: Portal Token Bridge',
        url: 'https://portalbridge.com/advanced-tools/#/transfer',
      },
    },
  },
];

const generateExplorerUrl = (token) =>
  `${token.explorerBaseUrl}${token.address}`;

export const TokenDetails = () => (
  <>
    <div id="get-olas" />
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
          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left border">Network</TableHead>
                <TableHead className="text-left border">Get OLAS</TableHead>
                <TableHead className="text-left border">
                  Token Address
                </TableHead>
                <TableHead className="text-left border">
                  Bridge from Ethereum to Network
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOKEN_DETAILS.map((token, index) => {
                const explorerUrl = generateExplorerUrl(token);
                return (
                  <TableRow key={index}>
                    <TableCell className="border">{token.network}</TableCell>
                    <TableCell className="border">
                      {token.exchange ? (
                        <a
                          href={token.exchange.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {token.exchange.name} ↗
                        </a>
                      ) : (
                        'TBD'
                      )}
                    </TableCell>
                    <TableCell className="border break-all">
                      <a
                        href={explorerUrl}
                        title={token.address}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {truncateAddress(token.address)} ↗
                      </a>
                    </TableCell>
                    <TableCell className="border">
                      {token.bridge ? (
                        <a
                          href={token.bridge.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {token.bridge.name} ↗
                        </a>
                      ) : (
                        'n/a'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden flex flex-col space-y-4">
          {TOKEN_DETAILS.map((token, index) => {
            const explorerUrl = generateExplorerUrl(token);
            return (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-bold mb-2">{token.network}</h3>
                <p>
                  <strong>Get OLAS:</strong>{' '}
                  {token.exchange ? (
                    <a
                      href={token.exchange.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.exchange.name} ↗
                    </a>
                  ) : (
                    'TBD'
                  )}
                </p>
                <p>
                  <strong>Token Address:</strong>{' '}
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
                  <strong>Bridge:</strong>{' '}
                  {token.bridge ? (
                    <a
                      href={token.bridge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {token.bridge.name} ↗
                    </a>
                  ) : (
                    'n/a'
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  </>
);
