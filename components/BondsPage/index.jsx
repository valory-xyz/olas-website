import SectionWrapper from '../Layout/SectionWrapper';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../ui/table';
import { ExternalLink, H1 } from '../ui/typography';
import Content from './Content';
import Contribute from './Contribute';
import Hero from './Hero';
import NetworkRole from './NetworkRole';
import { Card } from '../ui/card';
import { truncateAddress, TOKEN_DETAILS } from '../OlasTokenPage/TokenDetails';

const BondingDetailsSection = () => (
  <SectionWrapper>
    <div id="bonding-details" />
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
          {TOKEN_DETAILS?.map((network, index) => (
            <TableRow key={index}>
              <TableCell>{network?.network}</TableCell>
              <TableCell>{network?.bond?.guideUrl ? <ExternalLink href={network?.bond?.guideUrl}>Guide</ExternalLink> : 'TBC'}</TableCell>
              <TableCell>{network?.exchange?.name}</TableCell>
              <TableCell>{network?.bond?.lpTokenName ? network?.bond?.lpTokenName : 'TBC'}</TableCell>
              <TableCell>{network?.bond?.lpTokenAddress ? <ExternalLink href={network?.explorerBaseUrl + network?.bond?.lpTokenAddress}>{truncateAddress(network?.bond?.lpTokenAddress)}</ExternalLink> : 'TBC'}</TableCell>
              <TableCell>{network?.bond?.bridgedLpTokenAddress ? <ExternalLink href={`https://etherscan.io/token/${network?.bond?.bridgedLpTokenAddress}`}>{truncateAddress(network?.bond?.bridgedLpTokenAddress)}</ExternalLink> : 'TBC'}</TableCell>
              <TableCell>{network?.bond?.lpTokenBridge ? <ExternalLink href={network?.bond?.lpTokenBridge?.url}>{network?.bond?.lpTokenBridge?.name}</ExternalLink> : 'TBC'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </SectionWrapper>
);

const Bonds = () => (
  <>
    <Hero />
    <BondingDetailsSection />
    <Content />
    <NetworkRole />
    <Contribute />
  </>
);

export default Bonds;
