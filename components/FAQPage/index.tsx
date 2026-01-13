/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import { LinkIcon } from 'lucide-react';

import {
  COINGECKO_URL,
  ETHERSCAN_URL,
  PEARL_YOU_URL,
  SNAPSHOT_URL,
  VALORY_URL,
  VEOLAS_URL,
  X_OLAS_URL,
} from 'common-util/constants';
import { Card } from 'components/ui/card';
import { ExternalLink, SubsiteLink } from 'components/ui/typography';
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
              Olas enables everyone to own and monetize their AI agents. It is the platform that
              enables true co-ownership of AI.
            </p>
            <p className="mb-3">
              With Pearl, the first “AI Agent App Store,” any consumer with a laptop can use AI
              agents they truly own.
            </p>
            <p className="mb-3">
              With Mech Marketplace, businesses can put their AI agent up for hire to earn crypto
              and tap into other AI agents&apos; services.
            </p>
            <p>
              Launched in 2021 as one of the first Crypto x AI projects, Olas today powers multiple
              active agent economies with millions of transactions to date.
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
              AI is changing the world at breakneck speed — but with this comes the risk of its
              ownership becoming more and more centralized. Labs like OpenAI, Anthropic, and
              DeepMind are building AI Agents that they hope will soon run everything.
            </p>
            <p className="mb-3">
              If unchecked, the best AI will be owned by the few and rented by the many.
            </p>
            <p className="mb-3">
              For everyone who dreams of AI Agents that could satisfy your every wish or
              revolutionize industries, there will always be a price: pay the tax forever — or get
              left behind.
            </p>
          </>
        ),
      },
      {
        id: 'olas-solution',
        title: "What is Olas' solution?",
        desc: (
          <p className="mb-3">
            Olas solves this problem by enabling true co-ownership of AI. With Olas&apos; Pearl, the
            first “AI Agent App Store”, any consumer with a laptop can use AI agents they truly own.
            With the Mech Marketplace, the “AI Agent Bazaar”, businesses can put their AI agent up
            for hire to earn crypto and tap into other AI agents&apos; services.
          </p>
        ),
      },
      {
        id: 'use-cases',
        title: 'What are the main products/use cases?',
        desc: (
          <>
            <p className="mb-3">
              For consumers, Pearl: the AI Agent App Store is a desktop app that lets anyone with a
              laptop run and own multiple AI agents easily.
            </p>
            <p className="mb-3">
              For businesses, Mech Marketplace: the AI Agent Bazaar is where they can offer their AI
              agents for hire to earn crypto and tap into other AI agents’ services.
            </p>
            <p className="mb-3">
              Everyone can co-own a piece of Olas through the OLAS utility token. OLAS grants access
              to core functions of the network and coordinates autonomous AI agent economies.
            </p>
            <p className="mb-3">
              Additionally, the most up-to-date and heavily showcased products can be found on the
              Olas homepage and{' '}
              <Link href="/timeline" className="text-purple-600">
                Olas Timeline
              </Link>
              .
            </p>
          </>
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
              page summarize progress during the last quarter and what to look out for during the
              next one.
            </p>
            <p className="mb-3">
              <Link
                href={`${X_OLAS_URL}/status/1676576697863507968?s=20`}
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                The &apos;Week in Olas&apos; Twitter summary thread is updated weekly by autonomous
                Olas agents
              </Link>
              , summarizing what&apos;s happened in the Olas ecosystem in the past week.
            </p>
            <p>
              You can also{' '}
              <Link className="text-purple-600" href="/roadmap">
                read the Roadmap
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        id: 'multi-agent-systems',
        title: 'Does Olas support multi-agent systems?',
        desc: (
          <>
            <p className="mb-3">
              Olas supports a wide variety of multi-agent systems, that is systems of multiple
              interacting intelligent agents that solve problems that are difficult for individual
              agents to solve.
            </p>
            <p>
              Evidently, any agent economy is a multi-agent system. Moreover, decentralized agents
              can be a multi-agent system when the individual agent instances in the autonomous
              service take on differentiated tasks.
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
            In 2022, Olas DAO was founded with ~50 participants. When the DAO was founded all the
            founding members paid their share of the costs, in total it was{' '}
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
            In July 2023, the OLAS token launched publicly via a Liquidity Bootstrapping Pool{' '}
            <Link href="/blog/lbp-stats" className="text-purple-600">
              (LBP) via Fjord Foundry which ended on 12.7.23 at 6pm UTC
            </Link>
            . This LBP is the only one planned and was created by Valory to establish initial
            liquidity in a decentralized manner because{' '}
            <Link
              href={`${X_OLAS_URL}/status/1675892568905900033?s=20`}
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              the DAO members love decentralization
            </Link>
            . The Fully Diluted Valuation during the LBP varied between a bottom of $12m and a
            closing of $74.6m FDV,{' '}
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
            Olas was founded as above and did not have a seed round. Valory, the dev company many of
            the founding members work from,{' '}
            <Link
              href={`${VALORY_URL}/post/autonomous-services-to-power-next-gen-apps-for-crypto-users-and-daos`}
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
        id: 'otc-round',
        title: 'Did Olas have an OTC round?',
        desc: (
          <p>
            No, Olas DAO itself did not have an OTC round. However, in early 2025, core contributor{' '}
            <Link
              href="/blog/olas-announces-the-agent-app-store-after-core-contributor-raises-13-8m-led-by-1kx"
              className="text-purple-600"
            >
              Valory announced an OTC fundraise of $13.8
            </Link>
            million to continue supporting and scaling the Olas ecosystem.
          </p>
        ),
      },
      {
        id: 'difference-between-olas',
        title: "What's the difference between Olas and Autonolas?",
        desc: (
          <p>
            Upon its inception, the project was named &apos;Autonolas&apos;, a combination of the
            words &apos;autonomy&apos; and &apos;olas&apos;; the latter meaning &apos;waves&apos; in
            Spanish. Today, the project is commonly referred to as &apos;Olas&apos;, and has earned
            the moniker &apos;crypto&apos;s ocean of agents&apos;.
          </p>
        ),
      },
      {
        id: 'symbol-meaning',
        title: 'What does the ☴ symbol mean?',
        desc: (
          <p>
            ☴ is a hexagram from the Yi Ching, the oldest known book. It represents wind and
            symbolically reinforces &apos;olas&apos; which means waves in Spanish. Together, they
            create a sense of vibrancy as generated by Olas&apos; autonomous agents, who generate
            waves of activity on top of the blockchain.
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
            Read more on the{' '}
            <Link href="/staking" className="text-purple-600">
              staking page
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
              Voting rights are granted to holders of locked OLAS, veOLAS token holders. Token
              holders cannot affect the disposition of the assets of the project team, the project,
              or any third party. Token holders can use their votes to affect the distribution of
              token emissions.
            </p>{' '}
            <p className="mb-3">
              The introduction of{' '}
              <Link href="/staking" className="text-purple-600">
                Olas Staking
              </Link>{' '}
              gave the DAO the ability to direct emissions to useful builders and the DAO treasury,
              controlling how much OLAS is emitted into the market. For more information on voting,
              see:{' '}
              <Link href="/govern" className="text-purple-600">
                https://olas.network/govern.
              </Link>
            </p>
          </>
        ),
      },
      {
        id: 'current-distribution',
        title: 'What is the current OLAS distribution / supply / planned unlocks?',
        desc: (
          <>
            <p className="mb-3">
              Live token distribution data (inc. total supply, circulating supply, current holders,
              unlock schedules, and more) is live{' '}
              <Link href="/olas-token" className="text-purple-600">
                here
              </Link>
              .
            </p>
            <p className="mb-3">
              You can also see the primary source for the buOLAS contract{' '}
              <Link
                href={`${ETHERSCAN_URL}/token/0xb09ccf0dbf0c178806aaee28956c74bd66d21f73`}
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>{' '}
              and the veOLAS contract{' '}
              <Link
                href={`${ETHERSCAN_URL}/token/0x7e01a500805f8a52fad229b3015ad130a332b7b3`}
                className="text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              . veOLAS is the governance token, which anyone can get by locking OLAS to participate
              in governance. Governance proposals can be found for off-chain votes on Snapshot{' '}
              <ExternalLink href={SNAPSHOT_URL} className="text-purple-600">
                here
              </ExternalLink>{' '}
              and for on-chain votes{' '}
              <ExternalLink href={SNAPSHOT_URL} className="text-purple-600">
                here
              </ExternalLink>
              . buOLAS is a vesting contract for the founding members.
            </p>
            <p>
              You can lock OLAS for veOLAS and check unlocks for your wallet{' '}
              <SubsiteLink href={VEOLAS_URL}>here</SubsiteLink>.
            </p>
          </>
        ),
      },
      {
        id: 'derive-token-allocation',
        title: 'How did you derive the founding member / DAO / treasury token allocation?',
        desc: (
          <>
            <p className="mb-3">
              At deployment and issuance of the contract to DAO founding members in 2022:
            </p>
            <p className="mb-3">
              {' '}
              47.35% of the fixed token supply (i.e. 1 billion OLAS) of the first 10 years is
              programmed to be distributed to the ecosystem, issued as rewards including developer
              and bonding rewards in the{' '}
              <Link
                href="/blog/code-capital-attracting-capital-via-bonding"
                className="text-purple-600"
              >
                (code, capital) mechanism
              </Link>
              . After 10 years the maximum token inflation per annum is capped at 2% and the DAO
              governance can opt to further reduce it. The aim is to have an s-shaped curve of token
              emissions to allow for the ecosystem to organically grow over time. The rest of the
              fixed token supply is distributed as follows:
            </p>
            <ul className="list-disc ml-6 mb-3">
              <li className="mb-2">DAO Treasury: 10%</li>
              <li className="mb-2">Development reserve: 10%</li>
              <li className="mb-2">DAO founding members: 32.65%</li>
            </ul>{' '}
            <p>
              See the live statistics on the{' '}
              <Link href="/olas-token" className="text-purple-600">
                token page
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
            Valory, founding member and co-creator of Olas, has a token allocation (see the{' '}
            <Link href="/olas-token" className="text-purple-600">
              Token page
            </Link>{' '}
            for wallet and amounts). This allocation has never been subject to locking or vesting.
            Valory stated{' '}
            <Link
              href="https://discord.com/channels/899649805582737479/899649805582737482/1187422618408726538"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              “there are no plans to lock or vest, and this is to the sole discretion of Valory, as
              is the case with any token holder“
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
            The definition of circulating supply is set by Coingecko and other aggregators -{' '}
            <Link
              href={`${COINGECKO_URL}/en/glossary/circulating-supply`}
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              see here for definition
            </Link>
            , and
            <Link
              href={`${COINGECKO_URL}/en/coins/autonolas`}
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
            “Autonolas Deployer“ is called this way on Etherscan because Valory deployed the Olas
            (prev. Autonolas) protocol. The deployer has no privileged role in the protocol. The
            protocol is controlled by the DAO (holders of veOLAS).
          </p>
        ),
      },
      {
        id: 'specific-transactions',
        title: 'What if I want to know about specific transactions?',
        desc: (
          <p>
            You can use block explorers to find all transactions on-chain. DAO founding member
            Valory stated they{' '}
            <Link
              href="https://discord.com/channels/899649805582737479/899649805582737482/1187022092139503626"
              className="text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              “never comment on individual transactions unless they are related to a security
              incident or some governance vote“
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

    <div className="mb-8">
      Have a question about Pearl: The &quot;AI Agent App Store&quot;?{' '}
      <SubsiteLink href={`${PEARL_YOU_URL}FAQ`}>Check out the Pearl FAQ</SubsiteLink>.
    </div>

    {faqList.map((eachSet, setIndex) => (
      <div key={eachSet.category} className={setIndex === faqList.length - 1 ? '' : 'mb-8'}>
        <h2 className="text-2xl font-semibold mt-2 mb-4 pb-4 border-b-1.5 text-gray-600">
          {eachSet.category}
        </h2>
        {eachSet.list.map((faq) => (
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
