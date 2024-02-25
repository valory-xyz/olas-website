import SectionWrapper from "../Layout/SectionWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ExternalLink, H1, Link } from "../ui/typography";
import Content from "./Content";
import Contribute from "./Contribute";
import Hero from "./Hero";
import NetworkRole from "./NetworkRole";
import { Card } from "../ui/card";
import { truncateAddress } from "../OlasTokenPage/TokenDetails";
import { TOKEN_DETAILS } from "../OlasTokenPage/TokenDetails";

const BondingDetailsSection = () => {
  const networks = TOKEN_DETAILS.filter(token => token.bond !== null);

  return (
    <SectionWrapper>
      <a id="bonding-details" />
      <H1 className="text-center mb-12">Details</H1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Network</TableHead>
              <TableHead>Guide</TableHead>
              <TableHead>Exchange</TableHead>
              <TableHead>Pool Symbol</TableHead>
              <TableHead>LP Token Address</TableHead>
              <TableHead>Bridged LP Token Address</TableHead>
              <TableHead>Bridge LP Token from Network to Ethereum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {networks?.map((network, index) => (
              <TableRow key={index}>
                <TableCell>{network?.network}</TableCell>
                <TableCell><ExternalLink href={network?.bond?.guideUrl}>Guide</ExternalLink></TableCell>
                <TableCell>{network?.exchange?.name}</TableCell>
                <TableCell>{network?.bond?.lpTokenName}</TableCell>
                <TableCell>{network?.bond?.lpTokenAddress ? <ExternalLink href={network?.explorerBaseUrl + network?.bond?.lpTokenAddress}>{truncateAddress(network?.bond?.lpTokenAddress)}</ExternalLink> : "n/a"}</TableCell>
                <TableCell>{network?.bond?.bridgedLpTokenAddress ? <ExternalLink href={`https://etherscan.io/token/${network?.bond?.bridgedLpTokenAddress}`}>{truncateAddress(network?.bond?.bridgedLpTokenAddress)}</ExternalLink> : "n/a"}</TableCell>
                <TableCell>{network?.bond?.lpTokenBridge ? <ExternalLink href={network?.bond?.lpTokenBridge?.url}>{network?.bond?.lpTokenBridge?.name}</ExternalLink> : "n/a"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </SectionWrapper>
  )
}

const Bonds = () => {
  return <>
    <Hero />
    <BondingDetailsSection />
    <Content />
    <NetworkRole />
    <Contribute />
  </>
};

export default Bonds;
