import SectionWrapper from "../Layout/SectionWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ExternalLink, H1 } from "../ui/typography";
import Content from "./Content";
import Contribute from "./Contribute";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import NetworkRole from "./NetworkRole";
import { Card } from "../ui/card";
import { truncateAddress } from "../OlasTokenPage/TokenDetails";
import { truncate } from "lodash";

const BondingDetailsSection = () => {
  return (
    <SectionWrapper>
      <H1 className="text-center mb-12">Cross-chain Details</H1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Network</TableHead>
              <TableHead>Exchange</TableHead>
              <TableHead>Pool Symbol</TableHead>
              <TableHead>LP Token Address</TableHead>
              <TableHead>Bridged LP Token Address</TableHead>
              <TableHead>Bridge</TableHead>
              <TableHead>Guide</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ethereum</TableCell>
              <TableCell>Uniswap</TableCell>
              <TableCell>OLAS-ETH</TableCell>
              <TableCell><ExternalLink href="https://etherscan.io/token/0x09d1d767edf8fa23a64c51fa559e0688e526812f">{truncateAddress('0x09d1d767edf8fa23a64c51fa559e0688e526812f')}</ExternalLink></TableCell>
              <TableCell>NA</TableCell>
              <TableCell>NA</TableCell>
              <TableCell><ExternalLink href="https://olas.network/blog/inaugural-bonding-programme-proposal">Guide</ExternalLink></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gnosis</TableCell>
              <TableCell>Balancer</TableCell>
              <TableCell>OLAS-WXDAI</TableCell>
              <TableCell><ExternalLink href="https://gnosisscan.io/address/0x79c872ed3acb3fc5770dd8a0cd9cd5db3b3ac985">{truncateAddress('0x79c872ed3acb3fc5770dd8a0cd9cd5db3b3ac985')}</ExternalLink></TableCell>
              <TableCell><ExternalLink href="https://etherscan.io/token/0x27df632fd0dcf191c418c803801d521cd579f18e">{truncateAddress('0x27df632fd0dcf191c418c803801d521cd579f18e')}</ExternalLink></TableCell>
              <TableCell>Omni Bridge</TableCell>
              <TableCell><ExternalLink href="https://olas.network/blog/olas-liquidity-on-gnosis-chain">Guide</ExternalLink></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Polygon</TableCell>
              <TableCell>Balancer</TableCell>
              <TableCell>WMATIC-OLAS</TableCell>
              <TableCell><ExternalLink href="https://polygonscan.com/address/0x62309056c759c36879cde93693e7903bf415e4bc">{truncateAddress('0x62309056c759c36879cde93693e7903bf415e4bc')}</ExternalLink></TableCell>
              <TableCell><ExternalLink href="https://etherscan.io/address/0x06512E620A8317da51a73690A596Aca97287b31D">{truncateAddress('0x06512E620A8317da51a73690A596Aca97287b31D')}</ExternalLink></TableCell>
              <TableCell>Polygon POS bridge</TableCell>
              <TableCell><ExternalLink href="https://olas.network/blog/bonding-guide-for-olas-matic-products-on-polygon">Guide</ExternalLink></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </SectionWrapper>
  )
}

const Bonds = () => {
  return <>
    <Hero />
    <HowItWorks />
    <BondingDetailsSection />
    <Content />
    <NetworkRole />
    <Contribute />
  </>
};

export default Bonds;
