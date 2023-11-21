import Link from "next/link";
import React from "react";

const Question = ({ text, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{text}</h2>
      <p>{children}</p>
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className="p-4 max-w-screen-sm mx-auto text-slate-800">
      <h1 className="text-5xl font-extrabold mb-12 text-slate-800 ">FAQ</h1>
      <Question text="What is Olas?">
        A unified network of off-chain services – like automation, oracles, and co-owned AI. Olas offers a composable stack for building these services, and a protocol for incentivizing their creation. Olas enables operating these services in a co-owned and decentralized way.
      </Question>
      <Question text="What are the main products/use cases?">
        The most up-to-date and heavily showcased products can be found in the <Link className="underline underline-offset-4" href="/#services">Ecosystem section</Link>.
      </Question>
      <Question text="Where can I catch up on everything that&apos;s happened since the early days?">
        <a href="https://twitter.com/autonolas/status/1676576697863507968?s=20" target="_blank" class="underline underline-offset-4">This Twitter summary thread. ↗</a>
      </Question>
      <Question text="When was the DAO founded? When was the TGE?">
        Olas DAO was founded in 2022 with ~50 participants. When the DAO was founded all the founding members paid their share of the costs, in total it was <a href="https://discord.com/channels/899649805582737479/899649805582737482/1126134102400176229" target="_blank" class="underline underline-offset-4">in the order of 10s of thousands of dollars. ↗</a>
      </Question>
      <Question text="When was the LBP?">
        <a href="https://fjordfoundry.com/pools/mainnet/0x4131fD7B699155f69E0192145C36f27852BE7c11" target="_blank" class="underline underline-offset-4">In 2023, we launched publicly via an LBP which ended on 12.7.23 at 6pm UTC. ↗</a> This LBP is the only one planned and was created by Valory to establish initial liquidity in a decentralized manner because <a href="https://twitter.com/autonolas/status/1675892568905900033?s=20" target="_blank" class="underline underline-offset-4">we love decentralization ↗</a>. All funds collected will be strictly used to <a href="https://www.autonolas.network/blog/olas-public-launch" target="_blank" class="underline underline-offset-4">&apos;maintain, run and further&apos; ↗</a> the decentralized Olas protocol.
      </Question>
      <Question text="What’s this about a seed round?">
        Olas was founded as above and did not have a seed round. Valory, the dev company many of the founding members work from, <a href="https://www.valory.xyz/post/autonomous-services-to-power-next-gen-apps-for-crypto-users-and-daos" target="_blank" class="underline underline-offset-4">had a seed round ↗</a>.
      </Question>
      <Question text="What’s next?">
        Catch up on everything built in the Olas ecosystem so far <a href="https://twitter.com/autonolas/status/1676576697863507968?s=20" target="_blank" class="underline underline-offset-4">here ↗</a>. This thread is extended weekly as more is built, and there’s a lot to be announced. OLAS supply and unlocks Various statistics about OLAS (inc. total supply, circulating supply, current holders, unlock schedules and more) are all live <a href="https://dune.com/adrian0x/olas" target="_blank" class="underline underline-offset-4">here ↗</a>, or at the primary source: buOLAS contract <a href="https://etherscan.io/token/0xb09ccf0dbf0c178806aaee28956c74bd66d21f73" target="_blank" class="underline underline-offset-4">here ↗</a>, veOLAS contract <a href="https://etherscan.io/token/0x7e01a500805f8a52fad229b3015ad130a332b7b3" target="_blank" class="underline underline-offset-4">here ↗</a>. veOLAS is the governance token, which anyone can get by locking OLAS to participate in governance. Governance proposals can be found on Snapshot <a href="https://snapshot.org/#/autonolas.eth" target="_blank" class="underline underline-offset-4">here ↗</a> and Boardroom <a href="https://boardroom.io/autonolas" target="_blank" class="underline underline-offset-4">here ↗</a>. buOLAS is a vesting contract for the team. You can lock OLAS for veOLAS and check unlocks for your wallet <a href="https://member.olas.network/" target="_blank" class="underline underline-offset-4">here ↗</a>.
      </Question>
      <Question text="How does bonding and liquidity work on Olas?">
        The most detail is found in the full whitepaper and whitepaper summary (<a href="https://autonolas.network/whitepaper" target="_blank" class="underline underline-offset-4">whitepaper</a>), and the contract repository (<a href="https://github.com/valory-xyz/autonolas-tokenomics" target="_blank" class="underline underline-offset-4">contract repository</a>), but we’ll create further resources to make them more accessible as time progresses. The promised <a href="https://boardroom.io/autonolas/proposal/cHJvcG9zYWw6YXV0b25vbGFzOm9uY2hhaW46ODU3ODA1MjQ1MjQyODgwNTE0MTU1MjEyODcyNzMyNTgwNzY1NTY5MTE5Nzc2NTQwODk1MDAzNzA4MzE3NjIyMTY1NjUzNzEwMjIzNDY=" target="_blank" class="underline underline-offset-4">⁠ governance vote on bonding</a> is here. Here you can find a thread about <a href="https://twitter.com/david_enim/status/1677611439236739072?s=46&t=PBYzKHt3WSIq4JxQTUrjWA" target="_blank" class="underline underline-offset-4">Protocol-owned Liquidity</a>, the unique Olas tokenomics inspired by Olympus. You can now get OLAS on Uniswap <a href="https://app.uniswap.org/#/swap?inputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0" target="_blank" class="underline underline-offset-4">here</a>, we expect liquidity to grow <a href="https://app.uniswap.org/#/swap?inputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0" target="_blank" class="underline underline-offset-4">here</a> with bonding and founding member unlocks.
      </Question>
      <Question text="When will there be a CEX listing?">
        There aren&apos;t any imminent plans and we instead propose the DAO focus on the decentralized approach.
      </Question>
      <Question text="What does the ☴ symbol mean?">
        ☴ is a hexagram from the Yi Ching, the oldest known book. It represents wind and symbolically reinforces &apos;olas&apos; which means waves in Spanish. Together, they create a sense of vibrancy as generated by Olas&apos; autonomous agents, who generate waves of activity on top of the blockchain.
      </Question>
      <Question text="What&apos;s the difference between Olas and Autonolas?">
        Autonolas was the original name. The DAO subsequently adopted the name Olas because it&apos;s more inclusive and easier to pronounce. You&apos;ll still see Autonolas around because it&apos;s embedded in many of the contracts and because it will take time for some people to get used to the new name.
      </Question>
      <Question text="How did you derive the team / DAO / treasury token allocation?">
        The OLAS tokenomics was designed to coordinate a network of stakeholders in enabling an ocean of autonomous services. Other protocols are designed with different ends in mind and with different mechanisms, requiring different tokenomics. Aggregating different entities including DAO Treasury (10% of 10 year max supply), with Founding Members (~50 including people outside Valory, 32.7% of 10 year max supply), and Development reserve (to build out Olas Stack etc) is not very meaningful. E.g. Olas Governance determines the Treasury use. Many &quot;fair-launch&quot; projects end up with similarly high Gini coefficient in early days because early mining/staking is concentrated. Olas compares favourably to many other industry-defining projects like StarkNet, Celestia, Arbitrum, etc.
      </Question>
    </div>
  );
};

export default FAQPage;
