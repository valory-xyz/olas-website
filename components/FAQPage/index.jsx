/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React from 'react';

import { FLIPSIDE_URL } from 'common-util/constants';
import { ExternalLink, Link } from 'components/ui/typography';

const Question = ({ text, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-2">{text}</h2>
    <p>{children}</p>
  </div>
);

Question.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

const FAQLink = ({ external, ...props }) => (external ? <ExternalLink {...props} /> : <Link {...props} />);

const FAQPage = () => (
  <div className="p-4 max-w-screen-sm mx-auto text-slate-800">
    <h1 className="text-5xl font-extrabold mb-12 text-slate-800">FAQ</h1>
    <Question text="What is Olas?">
      A unified network of off-chain services - like automation, oracles, and
      co-owned AI. Olas offers a composable stack for building these services,
      and a protocol for incentivizing their creation. Olas enables operating
      these services in a co-owned and decentralized way.
    </Question>
    <Question text="What are the main products/use cases?">
      The most up-to-date and heavily showcased products can be found in the
      {' '}
      <FAQLink href="/#services">Ecosystem section</FAQLink>
      .
    </Question>
    <Question text="Where can I catch up on everything that's happened since the early days?">
      <FAQLink
        href="https://twitter.com/autonolas/status/1676576697863507968?s=20"
        external
      >
        This Twitter summary thread
      </FAQLink>
      .
    </Question>
    <Question text="When was the DAO founded? When was the TGE?">
      Olas DAO was founded in 2022 with ~50 participants. When the DAO was
      founded all the founding members paid their share of the costs, in total
      it was
      {' '}
      <FAQLink
        href="https://discord.com/channels/899649805582737479/899649805582737482/1126134102400176229"
        external
      >
        in the order of 10s of thousands of dollars
      </FAQLink>
      .
    </Question>
    <Question text="When was the LBP?">
      <FAQLink
        href="https://fjordfoundry.com/pools/mainnet/0x4131fD7B699155f69E0192145C36f27852BE7c11"
        external
      >
        In 2023, the OLAS token launched publicly via an LBP which ended on
        12.7.23 at 6pm UTC
      </FAQLink>
      . This LBP is the only one planned and was created by Valory to establish
      initial liquidity in a decentralized manner because
      {' '}
      <FAQLink
        href="https://twitter.com/autonolas/status/1675892568905900033?s=20"
        target="_blank"
        rel="noreferrer"
        external
      >
        the DAO members love decentralization
      </FAQLink>
      . All funds collected will be strictly used to
      {' '}
      <FAQLink href="https://www.autonolas.network/blog/olas-public-launch">
        &apos;maintain, run and further&apos;
      </FAQLink>
      {' '}
      the decentralized Olas protocol.
    </Question>
    <Question text="What’s this about a seed round?">
      Olas was founded as above and did not have a seed round. Valory, the dev
      company many of the founding members work from,
      {' '}
      <FAQLink
        href="https://www.valory.xyz/post/autonomous-services-to-power-next-gen-apps-for-crypto-users-and-daos"
        external
      >
        had a seed round
      </FAQLink>
      .
    </Question>
    <Question text="What’s next?">
      Catch up on everything built in the Olas ecosystem so far
      {' '}
      <FAQLink
        href="https://twitter.com/autonolas/status/1676576697863507968?s=20"
        external
      >
        here
      </FAQLink>
      . This thread is extended weekly as more is built, and there’s a lot to be
      announced.
    </Question>
    <Question text="OLAS supply and unlocks">
      Various statistics about OLAS (inc. total supply, circulating supply,
      current holders, unlock schedules and more) are all live
      {' '}
      <FAQLink href="https://dune.com/adrian0x/olas" external>
        here
      </FAQLink>
      , or at the primary source: buOLAS contract
      {' '}
      <FAQLink
        href="https://etherscan.io/token/0xb09ccf0dbf0c178806aaee28956c74bd66d21f73"
        external
      >
        here
      </FAQLink>
      , veOLAS contract
      {' '}
      <FAQLink
        href="https://etherscan.io/token/0x7e01a500805f8a52fad229b3015ad130a332b7b3"
        external
      >
        here
      </FAQLink>
      . veOLAS is the governance token, which anyone can get by locking OLAS to
      participate in governance. Governance proposals can be found on Snapshot
      {' '}
      <FAQLink href="https://snapshot.org/#/autonolas.eth" external>
        here
      </FAQLink>
      {' '}
      and Boardroom
      {' '}
      <FAQLink href="https://boardroom.io/autonolas" external>
        here
      </FAQLink>
      . buOLAS is a vesting contract for the founding members. You can lock OLAS
      for veOLAS and check unlocks for your wallet
      {' '}
      <FAQLink href="https://member.olas.network/" external>
        here
      </FAQLink>
      .
    </Question>
    <Question text="How does bonding and liquidity work on Olas?">
      The most detail is found in the full whitepaper and whitepaper summary (
      <FAQLink href="https://olas.network/whitepaper">whitepaper</FAQLink>
      ), and the contract repository (
      <FAQLink
        href="https://github.com/valory-xyz/autonolas-tokenomics"
        external
      >
        contract repository
      </FAQLink>
      ), but the community might create further resources to make them more
      accessible as time progresses. The promised
      {' '}
      <FAQLink
        href="https://boardroom.io/autonolas/proposal/cHJvcG9zYWw6YXV0b25vbGFzOm9uY2hhaW46ODU3ODA1MjQ1MjQyODgwNTE0MTU1MjEyODcyNzMyNTgwNzY1NTY5MTE5Nzc2NTQwODk1MDAzNzA4MzE3NjIyMTY1NjUzNzEwMjIzNDY="
        external
      >
        governance vote on bonding is here
      </FAQLink>
      . Here you can find a thread about
      {' '}
      <FAQLink
        href="https://twitter.com/david_enim/status/1677611439236739072?s=46&t=PBYzKHt3WSIq4JxQTUrjWA"
        external
      >
        Protocol-owned Liquidity
      </FAQLink>
      , the unique Olas tokenomics inspired by Olympus.
    </Question>
    <Question text="When will there be a CEX listing?">
      There aren&apos;t any imminent plans. The DAO focuses on the decentralized
      approach of growing liquidity via bonding.
    </Question>
    <Question text="What does the ☴ symbol mean?">
      ☴ is a hexagram from the Yi Ching, the oldest known book. It represents
      wind and symbolically reinforces &apos;olas&apos; which means waves in
      Spanish. Together, they create a sense of vibrancy as generated by
      Olas&apos; autonomous agents, who generate waves of activity on top of the
      blockchain.
    </Question>
    <Question text="What's the difference between Olas and Autonolas?">
      Autonolas was the original name. The DAO subsequently adopted the name
      Olas because it&apos;s more inclusive and easier to pronounce. You&apos;ll
      still see Autonolas around because it&apos;s embedded in many of the
      contracts and because it will take time for some people to get used to the
      new name.
    </Question>
    <Question text="How did you derive the founding member / DAO / treasury token allocation?">
      The OLAS tokenomics was designed to coordinate a network of stakeholders
      in enabling an ocean of autonomous services. Other protocols are designed
      with different ends in mind and with different mechanisms, requiring
      different tokenomics. Aggregating different entities including DAO
      Treasury (10% of 10 year max supply), with Founding Members (~50 including
      people outside Valory, 32.7% of 10 year max supply), and Development
      reserve (to build out Olas Stack etc) is not very meaningful. E.g. Olas
      Governance determines the Treasury use. Many &quot;fair-launch&quot;
      projects end up with similarly high Gini coefficient in early days because
      early mining/staking is concentrated. Olas compares favourably to many
      other industry-defining projects like StarkNet, Celestia, Arbitrum, etc.
    </Question>
    <Question text="How do I track the current token distribution?">
      The current token distribution can be tracked on-chain since the inception
      of OLAS, and for convenience, on Flipside dashboards like this one
      {' '}
      <FAQLink href={FLIPSIDE_URL} external>
        here
      </FAQLink>
      .
    </Question>
    <Question text="What token allocation does Valory have?">
      Valory, founding member and co-creator of Olas, has a token allocation
      (see
      {' '}
      <FAQLink href={FLIPSIDE_URL} external>
        Flipside dashboard
      </FAQLink>
      {' '}
      and
      {' '}
      <FAQLink href="https://www.autonolas.network/whitepaper">
        Tokenomics paper
      </FAQLink>
      {' '}
      for wallet and amounts). This allocation has never been subject to locking
      or vesting. Valory stated
      {' '}
      <FAQLink
        href="https://discord.com/channels/899649805582737479/899649805582737482/1187422618408726538"
        external
      >
        &ldquo;there are no plans to lock or vest, and this is to the sole
        discretion of Valory, as is the case with any token holder&ldquo;
      </FAQLink>
      .
    </Question>
    <Question text="What is circulating supply and where can I find the circulating supply of OLAS?">
      The definition of circulating supply is set by Coingecko and other
      aggregators - see
      {' '}
      <FAQLink
        href="https://www.coingecko.com/en/glossary/circulating-supply"
        external
      >
        here for definition
      </FAQLink>
      , and
      {' '}
      <FAQLink href="https://www.coingecko.com/en/coins/autonolas" external>
        here for live data
      </FAQLink>
      .
    </Question>
    <Question text="What is the Autonolas Deployer contract?">
      &ldquo;Autonolas Deployer&ldquo; is called this way on Etherscan because
      Valory deployed the Olas (prev. Autonolas) protocol. The deployer has no
      privileged role in the protocol. The protocol is controlled by the DAO
      (holders of veOLAS).
    </Question>
    <Question text="What if I want to know about specific transactions?">
      You can use block explorers to find all transactions on-chain. DAO
      founding member Valory stated
      {' '}
      <FAQLink
        href="https://discord.com/channels/899649805582737479/899649805582737482/1187022092139503626"
        external
      >
        &ldquo;they never comment on individual transactions unless they are
        related to a security incident or some governance vote&ldquo;
      </FAQLink>
      .
    </Question>
  </div>
);

export default FAQPage;
