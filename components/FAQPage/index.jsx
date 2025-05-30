/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import { LinkIcon } from 'lucide-react';

import { Card } from 'components/ui/card';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';

const faqList = [
  {
    category: 'High-level questions',
    list: [
      {
        id: 'what-is-olas',
        title: 'What is Olas?',
        desc: (
          <>
            <p className="mb-3">
              The network for co-owning AI. Olas enables everyone to own a share
              of AI, specifically autonomous agents.
            </p>
            <p className="mb-3">
              One of the first Crypto x AI projects, founded in 2021, Olas
              offers the composable{' '}
              <Link href="/stack" className="text-purple-600">
                Olas Stack
              </Link>{' '}
              for developing autonomous AI agents, and the{' '}
              <Link href="/protocol" className="text-purple-600">
                Olas Protocol
              </Link>{' '}
              for incentivizing their creation and co-ownership.
            </p>
            <p className="mb-3">
              Olas&apos; mission is to incentivize and coordinate different
              parties to launch autonomous agents that form entire AI economies
              serving all humans.
            </p>
            <p>
              Olas is giving rise to agent economies across major blockchains.
              Check the{' '}
              <Link href="/#ecosystem" className="text-purple-600">
                homepage
              </Link>{' '}
              to see how many hundreds of thousands of transactions have been
              made. In{' '}
              <Link href="/agent-economies/predict" className="text-purple-600">
                Olas Predict
              </Link>
              , AI agents predict the future, using state-of-the-art AI models,
              and then apply their predictions to on-chain markets.
            </p>
          </>
        ),
      },
      {
        id: 'olas-is-trying-to-solve',
        title: 'What is the problem Olas is trying to solve?',
        desc: (
          <>
            <p className="mb-3">
              The best AI is increasingly agentic but centralized.
            </p>
            <p className="mb-3">
              {' '}
              Everyone (end users, businesses, governments) wants general
              purpose autonomous AI agents to do valuable (health, wealth,
              wellbeing, all industries, all services) things for them.
            </p>
            <p className="mb-3">
              {' '}
              As it stands, the best AI agents will be provided by centralized
              labs (e.g., OpenAI, Anthropic, DeepMind, etc.) and require all
              users to pay them a continuous tax.{' '}
            </p>
            <p className="mb-3">This is the problem that Olas is solving.</p>
          </>
        ),
      },
      {
        id: 'olas-solution',
        title: "What is Olas' solution?",
        desc: (
          <>
            <p className="mb-3">
              Olas is a path to powerful AI that is user-owned.
            </p>
            <p className="mb-3">
              It is a coordination protocol for autonomous AI agents that
              bootstraps the best agents and incentivizes them to be
              open-source! Users can share in the growth of the protocol and own
              their powerful agents outright.
            </p>
          </>
        ),
      },
      {
        id: 'use-cases',
        title: 'What are the main products/use cases?',
        desc: (
          <p className="mb-3">
            The most up-to-date and heavily showcased products can be found on
            the{' '}
            <Link href="/#use-cases" className="text-purple-600">
              homepage
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'whats-next',
        title:
          "Where can I see what's already happened in the Olas ecosystem, and find out what's next?",
        desc: (
          <>
            <p className="mb-3">
              The{' '}
              <Link href="/quarterly-updates" className="text-purple-600">
                Quarterly Updates
              </Link>{' '}
              page summarize progress during the last quarter and what to look
              out for during the next one.
            </p>
            <p className="mb-3">
              <Link
                href="https://x.com/autonolas/status/1676576697863507968?s=20"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                The &apos;Week in Olas&apos; Twitter summary thread is updated
                weekly by autonomous Olas agents
              </Link>
              , summarizing what&apos;s happened in the Olas ecosystem in the
              past week.
            </p>
            <p>
              You can also{' '}
              <a
                href="https://contribute.olas.network/roadmap"
                target="_blank"
                className="text-purple-600"
              >
                read the Roadmap
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
  {
    category: 'DAO-related questions',
    list: [
      {
        id: 'when-was-tge',
        title: 'When was the DAO founded? When was the TGE?',
        desc: (
          <p>
            In 2022, Olas DAO was founded with ~50 participants. When the DAO
            was founded all the founding members paid their share of the costs,
            in total it was{' '}
            <Link
              href="https://discord.com/channels/899649805582737479/899649805582737482/1126134102400176229"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              in the order of tens of thousands of dollars
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'when-was-lbp',
        title: 'When was the first public sale/LBP?',
        desc: (
          <p>
            In July 2023, the OLAS token launched publicly via a Liquidity
            Bootstrapping Pool{' '}
            <Link href="/blog/lbp-stats" className="text-purple-600">
              (LBP) via Fjord Foundry which ended on 12.7.23 at 6pm UTC
            </Link>
            . This LBP is the only one planned and was created by Valory to
            establish initial liquidity in a decentralized manner because{' '}
            <Link
              href="https://twitter.com/autonolas/status/1675892568905900033?s=20"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              the DAO members love decentralization
            </Link>
            . The Fully Diluted Valuation during the LBP varied between a bottom
            of $12m and a closing of $74.6m FDV,{' '}
            <Link href="/blog/lbp-stats" className="text-purple-600">
              raising a $1.2m total volume from 149 holders
            </Link>
            ​​. All funds collected will be strictly used to{' '}
            <a href="blog/olas-public-launch" className="text-purple-600">
              &apos;maintain, run, and further&apos;
            </a>{' '}
            the decentralized Olas protocol.
          </p>
        ),
      },
      {
        id: 'seed-round',
        title: "What's this about a seed round?",
        desc: (
          <p>
            Olas was founded as above and did not have a seed round. Valory, the
            dev company many of the founding members work from,{' '}
            <Link
              href="https://www.valory.xyz/post/autonomous-services-to-power-next-gen-apps-for-crypto-users-and-daos"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              had a seed round
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'difference-between-olas',
        title: "What's the difference between Olas and Autonolas?",
        desc: (
          <p>
            Upon its inception, the project was named &apos;Autonolas&apos;, a
            combination of the words &apos;autonomy&apos; and &apos;olas&apos;;
            the latter meaning &apos;waves&apos; in Spanish. Today, the project
            is commonly referred to as &apos;Olas&apos;, and has earned the
            moniker &apos;crypto&apos;s ocean of agents&apos;.
          </p>
        ),
      },
      {
        id: 'symbol-meaning',
        title: 'What does the ☴ symbol mean?',
        desc: (
          <p>
            ☴ is a hexagram from the Yi Ching, the oldest known book. It
            represents wind and symbolically reinforces &apos;olas&apos; which
            means waves in Spanish. Together, they create a sense of vibrancy as
            generated by Olas&apos; autonomous agents, who generate waves of
            activity on top of the blockchain.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Token-related questions',
    list: [
      {
        id: 'bonding-and-liquidity-process',
        title: 'How does Bonding and liquidity work on Olas?',
        desc: (
          <p>
            Read more at{' '}
            <Link href="/bond" className="text-purple-600">
              https://olas.network/bond.
            </Link>
          </p>
        ),
      },
      {
        id: 'staking-process',
        title: 'How does Staking work on Olas?',
        desc: (
          <p>
            Read more at{' '}
            <Link
              href="https://staking.olas.network"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://staking.olas.network
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'voting-process',
        title: 'How does voting work on Olas?',
        desc: (
          <>
            <p className="mb-3">
              Voting rights are granted to holders of locked OLAS, veOLAS token
              holders. Token holders cannot affect the disposition of the assets
              of the project team, the project, or any third party. Token
              holders can use their votes to affect the distribution of token
              emissions.
            </p>{' '}
            <p className="mb-3">
              The introduction of{' '}
              <Link
                href="https://staking.olas.network"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Olas Staking
              </Link>{' '}
              gave the DAO the ability to direct emissions to useful builders
              and the DAO treasury, controlling how much OLAS is emitted into
              the market. For more information on voting, see:{' '}
              <Link href="/govern" className="text-purple-600">
                https://olas.network/govern.
              </Link>
            </p>{' '}
            <p>
              The current token distribution can be tracked on-chain since the
              inception of OLAS, and for convenience, on Flipside dashboards
              like this one{' '}
              <Link
                href="https://flipsidecrypto.xyz/flipsideteam/olas-key-activity-metrics-pnPjda"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        id: 'current-distribution',
        title:
          'What is the current OLAS distribution / supply / planned unlocks?',
        desc: (
          <>
            <p className="mb-3">
              Live token distribution data (inc. total supply, circulating
              supply, current holders, unlock schedules, and more) is live{' '}
              <Link href="/olas-token" className="text-purple-600">
                here
              </Link>
              .
            </p>
            <p className="mb-3">
              You can also see the primary source for the buOLAS contract{' '}
              <Link
                href="https://etherscan.io/token/0xb09ccf0dbf0c178806aaee28956c74bd66d21f73"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>{' '}
              and the veOLAS contract{' '}
              <Link
                href="https://etherscan.io/token/0x7e01a500805f8a52fad229b3015ad130a332b7b3"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              . veOLAS is the governance token, which anyone can get by locking
              OLAS to participate in governance. Governance proposals can be
              found for off-chain votes on Snapshot{' '}
              <Link
                href="https://snapshot.org/#/autonolas.eth"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>{' '}
              and for on-chain votes{' '}
              <Link
                href="https://snapshot.org/#/autonolas.eth"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              . buOLAS is a vesting contract for the founding members.
            </p>
            <p>
              You can lock OLAS for veOLAS and check unlocks for your wallet{' '}
              <Link
                href="https://govern.olas.network/veolas"
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        id: 'derive-token-allocation',
        title:
          'How did you derive the founding member / DAO / treasury token allocation?',
        desc: (
          <>
            <p className="mb-3">
              At deployment and issuance of the contract to DAO founding members
              in 2022:
            </p>
            <p className="mb-3">
              {' '}
              47.35% of the fixed token supply (i.e. 1 billion OLAS) of the
              first 10 years is programmed to be distributed to the ecosystem,
              issued as rewards including developer and bonding rewards in the{' '}
              <Link
                href="/blog/code-capital-attracting-capital-via-bonding"
                className="text-purple-600"
              >
                (code, capital) mechanism
              </Link>
              . After 10 years the maximum token inflation per annum is capped
              at 2% and the DAO governance can opt to further reduce it. The aim
              is to have an s-shaped curve of token emissions to allow for the
              ecosystem to organically grow over time. The rest of the fixed
              token supply is distributed as follows:
            </p>
            <ul className="list-disc ml-6 mb-3">
              <li className="mb-2">DAO Treasury: 10%</li>
              <li className="mb-2">Development reserve: 10%</li>
              <li className="mb-2">DAO founding members: 32.65%</li>
            </ul>{' '}
            <p>
              See the live statistics here:{' '}
              <Link href="/olas-token" className="text-purple-600">
                https://olas.network/olas-token
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        id: 'what-token-allocation',
        title: 'What token allocation does Valory have?',
        desc: (
          <p>
            Valory, founding member and co-creator of Olas, has a token
            allocation (see the{' '}
            <Link href="/olas-token" className="text-purple-600">
              Token page
            </Link>{' '}
            for wallet and amounts). This allocation has never been subject to
            locking or vesting. Valory stated{' '}
            <Link
              href="https://discord.com/channels/899649805582737479/899649805582737482/1187422618408726538"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              “there are no plans to lock or vest, and this is to the sole
              discretion of Valory, as is the case with any token holder“
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'circulating-supply',
        title:
          'What is the circulating supply and where can I find the circulating supply of OLAS?',
        desc: (
          <p>
            The definition of circulating supply is set by Coingecko and other
            aggregators -{' '}
            <Link
              href="https://www.coingecko.com/en/glossary/circulating-supply"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              see here for definition
            </Link>
            , and
            <Link
              href="https://www.coingecko.com/en/coins/autonolas"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              here for live data
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'autonolas-deployer-contract',
        title: 'What is the Autonolas Deployer contract?',
        desc: (
          <p>
            “Autonolas Deployer“ is called this way on Etherscan because Valory
            deployed the Olas (prev. Autonolas) protocol. The deployer has no
            privileged role in the protocol. The protocol is controlled by the
            DAO (holders of veOLAS).
          </p>
        ),
      },
      {
        id: 'specific-transactions',
        title: 'What if I want to know about specific transactions?',
        desc: (
          <p>
            You can use block explorers to find all transactions on-chain. DAO
            founding member Valory stated they{' '}
            <Link
              href="https://discord.com/channels/899649805582737479/899649805582737482/1187022092139503626"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              “never comment on individual transactions unless they are related
              to a security incident or some governance vote“
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'protocol-audit',
        title: 'Has the Olas Protocol been audited?',
        desc: (
          <p>
            Yes, you can learn more about the{' '}
            <Link href="/protocol" className="text-purple-600">
              various audits here
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'olas-cexs',
        title: 'Is OLAS listed on any CEXs?',
        desc: (
          <p>
            Yes, on 30.10.24, the OLAS token was listed on{' '}
            <Link
              href="https://x.com/MEXC_Listings/status/1851224602405716047"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              MEXC
            </Link>
            .
          </p>
        ),
      },
    ],
  },
];

const Question = ({ text, children, questionId }) => {
  const [copied, setCopied] = useState(false);

  const getLink = async () => {
    const { origin, pathname } = window.location;
    const questionUrl = `${origin}${pathname}#${questionId}`;

    try {
      await navigator.clipboard.writeText(questionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy to clipboard: ', error);
    }
  };

  return (
    <div className="mb-8 group">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-semibold mb-2 w-[95%]">{text}</h2>
        <LinkIcon
          className="w-4 align-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={getLink}
        />
      </div>
      {children}

      {copied && (
        <Card className="fixed bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 z-50 bg-white shadow-lg">
          Copied to clipboard
        </Card>
      )}
    </div>
  );
};

Question.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

const FAQPage = () => (
  <div className="p-4 max-w-screen-sm mx-auto text-slate-800">
    <h1 className="text-5xl font-extrabold mb-12 mt-8 text-slate-800">FAQ</h1>

    {faqList.map((eachSet, setIndex) => (
      <div
        key={eachSet.category}
        className={setIndex === faqList.length - 1 ? '' : 'mb-8'}
      >
        <h2 className="text-2xl font-semibold mt-2 mb-4 pb-4 border-b-1.5 text-gray-600">
          {eachSet.category}
        </h2>
        {eachSet.list.map((faq, index) => (
          <div className="py-2 scroll-mt-20" key={faq.id} id={faq.id}>
            <Question text={faq.title} questionId={faq.id}>
              {faq.desc}
            </Question>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default FAQPage;
