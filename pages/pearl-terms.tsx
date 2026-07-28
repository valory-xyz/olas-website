import { AlertTriangle, Link as LinkIcon } from 'lucide-react';

import {
  PEARL_YOU_URL,
  PEARL_YOU_URL_WITH_UTM_SOURCE,
  UTM_SOURCE_OLAS_SITE,
  VALORY_URL,
} from 'common-util/constants';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { ExternalLink, Link } from 'components/ui/typography';
import { useRouter } from 'next/router';

// Note: All links on this page must be external because
// the page is also rendered inside the Pearl app
const PearlTerms = () => {
  const router = useRouter();
  const hideLayout = router?.query?.hideLayout === 'true';
  const Layout = hideLayout ? 'div' : PageWrapper;
  return (
    <Layout>
      <Meta
        pageTitle="Pearl Terms"
        description="Terms and conditions for using the Pearl application. Learn about Pearl's scope, user responsibilities, third-party integrations, and legal agreements."
      />
      <SectionWrapper backgroundType="SUBTLE_GRADIENT">
        <article className="max-w-[800px] mx-auto">
          <h1 className="text-3xl lg:text-[40px] mb-12 text-purple-950 font-semibold">
            Pearl Terms
          </h1>
          <div className="text-xl text-gray-600 space-y-6">
            <section>
              <h4 className="text-xl text-black font-semibold mt-8">1. Introduction and Scope</h4>
              <p className="mt-2">
                Valory AG (“Valory” as defined at{' '}
                <ExternalLink href={`${VALORY_URL}/terms`}>https://valory.xyz/terms</ExternalLink>,
                herein: the “Valory Terms”) develops and provides tools built on emerging
                technologies, including the open-source Pearl Application (the “Pearl Application”,
                as defined below).
              </p>
              <p className="mt-2">
                <strong>The Pearl Application</strong> is an open-source desktop application
                available for download at{' '}
                <ExternalLink
                  href={`${PEARL_YOU_URL_WITH_UTM_SOURCE}&utm_campaign=pearl-terms&utm_content=pearl-terms-link`}
                >
                  https://www.pearl.you/
                </ExternalLink>{' '}
                (the “Pearl Site”). By downloading, installing, or using the Pearl Application, you
                acknowledge and agree to be bound by these Pearl Terms, the Valory Terms, the Pearl
                Site&apos;s policies (available at{' '}
                <ExternalLink
                  href={`${PEARL_YOU_URL}disclaimer?${UTM_SOURCE_OLAS_SITE}&utm_campaign=pearl-terms&utm_content=pearl-terms-link`}
                >
                  https://www.pearl.you/disclaimer
                </ExternalLink>
                , herein: “Pearl Site Disclaimer &amp; Privacy Policy”), and any applicable Olas
                Site policies (available at <Link href="/">https://olas.network/</Link>, herein:
                “Olas Site”) all collectively the “Conditions”. If you do not agree to these
                Conditions, you must not download or use the Pearl Application. You also acknowledge
                the terms and privacy policies of “Third-Party Integrations” (external protocols,
                platforms, or services provided by entities other than Valory, including but not
                limited to those named in Section 7).
              </p>
              <p className="mt-2">
                For the avoidance of doubt, the Pearl Site Disclaimer & Privacy Policy governs the
                use of the Pearl Site, while these Pearl Terms govern the use of the Pearl
                Application. In the event of any conflict, inconsistency, or ambiguity between the
                various components of the Conditions or terms and privacy policies of Third-Party
                Integrations, the following order of precedence shall apply: 1) Valory Terms (which
                shall govern and prevail in all matters, especially regarding Valory&apos;s
                liability, rights, and obligations); 2) these Pearl Terms; 3) the Pearl Site
                Disclaimer & Privacy Policy, and 4) any terms and privacy policies of Third-Party
                Integrations.
              </p>
              <p className="mt-2">
                Nothing in these Pearl Terms shall be construed to waive, limit, or supersede any
                rights, remedies, or limitations of liability that Valory (or any legal entities
                that control, are controlled by, or are under control with Valory, herein:
                “Affiliates”) retain under the Valory Terms. Valory&apos;s inclusion of or
                integration with any Third-Party Integrations does not imply any assumption of
                liability for such third-party services.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                2. What is the Pearl Application
              </h4>
              <p className="mt-2">
                Pearl Application enables users to run “Agents” or “AI Agents” (software that can
                perceive its environment, make decisions, and take actions without constant human
                input to achieve specific goals) locally, on their own devices. These Agents
                interact with the “Olas Protocol” (a decentralized platform for owning Agents and
                other protocols, described at{' '}
                <Link href="/protocol">https://olas.network/protocol</Link>
                ). The Pearl Application, Pearl Site, the brands “Pearl” or “Olas Pearl” and
                associated “Marks” (trademarks, service marks, logos, and brand identifiers) are
                part of Valory&apos;s “Offerings” (as defined in Sections 1.3 and 2 of the Valory
                Terms) and are governed by the Valory Terms. All trademarks, logos, and branding
                associated with Pearl Application are owned or licensed by Valory.
              </p>
              <p className="mt-2">
                Functionality in Pearl Application may interact with Third-Party Integrations - any
                such interactions occur under their respective terms and conditions and are
                initiated, configured, and controlled by the user and at the user&apos;s sole
                direction and risk. Certain Agents or functionalities may depend on external
                infrastructure, including third-party APIs, developer accounts, or credit-based
                services. Users are solely responsible for independently registering for,
                maintaining, funding, and complying with the terms of such Third-Party Integrations.
                Valory does not provide, resell, bundle, monitor, or guarantee access to any such
                APIs or credit-based services.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">3. Acceptance of the risks</h4>
              <p className="mt-2">
                The Conditions explain the risks involved in using Offerings like Pearl Application,
                which are based on emerging technologies (such as blockchain). Nothing in Pearl
                Application or related materials constitutes investment advice, a financial
                promotion, or an offer to manage assets. Pearl Application and any functionality
                within Pearl Application may not behave as expected, may fail, or may underperform.
                Any assets used with Pearl Application are at risk and you may lose some or all of
                your assets. You remain solely responsible for your financial decisions and
                blockchain transactions, and for understanding any legal, tax, or regulatory
                obligations that may apply. Valory does not provide legal, tax, financial, or
                trading advice nor does it assess user suitability, appropriateness, or risk
                tolerance.
              </p>
              <p className="mt-2">
                By using Pearl Application, you acknowledge that access to any and all functionality
                may be restricted based on jurisdiction, residency, sanctions, or eligibility
                requirements imposed by Valory and/or third-parties. In particular, Valory may
                restrict your use of Pearl Application based on IP-address checks.
              </p>
              <p className="mt-2">
                While using Pearl Application, users may interact with or receive{' '}
                <Link href="/olas-token">Olas tokens</Link> (hereafter “Olas Token(s)”, a digital
                asset associated with the Olas Protocol, specifically its native token:{' '}
                <Link href="/olas-token">https://olas.network/olas-token</Link>, via the Olas
                Protocol). Any issuance, distribution or receipt of Olas Tokens is not guaranteed
                and is governed by the Olas Protocol (not Pearl Application, Pearl Site, or Valory),
                which is in turn governed by the “Olas DAO” (a decentralized autonomous organization
                where decisions are made by token holders rather than a central authority). Users
                assume all risks associated with acquiring, holding, or transacting with Olas
                Tokens, including potential loss of assets or value, irretrievability, or tax or
                regulatory obligations. Valory is not responsible for any token-related losses,
                account balances, or third-party token activities.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">4. Limitation of liability</h4>
              <p className="mt-2">
                <AlertTriangle size={18} className="inline-block mb-1" /> Warning: Pearl Application
                is experimental open-source software that is provided “as is”, without any
                representation or warranty that it has been fully audited, tested, or secured. If
                you choose to use Pearl Application, you do so at your own risk. To the maximum
                extent permitted by law, and except where mandatory consumer protections apply,
                Valory is not liable and responsible for any delays, losses, damages, or issues
                resulting from or arising out of the access, use, cessation or interruption of use
                of Pearl Application, related Agents, Third-Party Integrations, or underlying
                technologies, nor for paying any costs related to the same.
              </p>
              <p className="mt-2">
                You agree to hold harmless and indemnify Valory, and its affiliates, from any
                third-party claim (including legal fees) arising from your use of the Pearl
                Application or your violation of these Pearl Terms.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                5. Non-custodial nature & data handling
              </h4>
              <p className="mt-2">
                Pearl Application is non-custodial software developed by Valory. Valory does not
                ever take custody of user funds, access wallets, or act as a financial intermediary
                or data processor on behalf of users. Valory does not sell, nor rent, nor share
                personal data, nor store personal data via Pearl Application. Any technical data
                generated by Pearl Application is processed locally on your device solely to enable
                the software&apos;s functionality and is never shared with Valory. All wallet keys,
                configurations, and operational data remain local to your device. Valory does not
                approve, reject, modify, or reverse any transaction initiated through/by Pearl
                Application or any functionality therein, nor does it access or control funds held
                in user wallets or smart-contract wallets used by Agents or users.
              </p>
              <p className="mt-2">
                Where Pearl Application displays on-chain information such as balances, positions,
                or transaction history, that information is commonly retrieved via subgraphs hosted
                on The Graph&apos;s decentralized network, not solely by Valory, and Valory does not
                guarantee the availability, accuracy, or timeliness of such third-party indexing
                infrastructure.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">6. Pearl Agents</h4>
              <p className="mt-2">
                As above, Pearl enables users to use various Agents where the open-source code was
                provided by Valory or another Third-Party and the Agents run locally on users&apos;
                own devices. Agents in Pearl currently available to create and maintain (“Available
                Agents”) include: Basius, Connect, Omenstrat and Polystrat. Agents that can only be
                maintained and not created (“Agents Under Development”) include Optimus, Agents.fun,
                Modius and Pettbro. Find more information about some of the Available Agents and
                Agents Under Development below:
              </p>
              <div className="space-y-4 mt-4 ml-8">
                <div>
                  <h5 className="text-lg text-black font-semibold" id="available-agents-terms">
                    6.1 Available Agents
                  </h5>
                  <div className="space-y-4 mt-4 ml-8">
                    <div>
                      <h6 className="text-lg text-black font-semibold" id="basius-terms">
                        6.1.1 Basius (DeFAI Agents)
                      </h6>
                      <p className="mt-2">
                        Pearl Application allows users to run Optimus and Basius, autonomous Agents
                        developed by Valory (together, the “DeFAI Agent(s)”). “Optimus” is a DeFAI
                        Agent that operates on the{' '}
                        <ExternalLink href="https://www.optimism.io/">
                          Optimism network
                        </ExternalLink>{' '}
                        and “Basius” is the{' '}
                        <ExternalLink href="https://www.base.org/">Base network</ExternalLink>{' '}
                        version of Optimus and shares the same agent logic. The DeFAI Agent(s) are
                        operated and executed locally on the user&apos;s device and, at the
                        user&apos;s sole discretion and risk, interact with third-party
                        decentralized exchanges (the “DEXs”) and other decentralized market
                        protocols like “
                        <ExternalLink href="https://velodrome.finance/">Velodrome</ExternalLink>” on
                        Optimism and “
                        <ExternalLink href="https://aerodrome.finance/">Aerodrome</ExternalLink>” on
                        Base, together with third-party routing, bridging, and pricing services used
                        to execute swaps and transactions, in order to provide or manage liquidity
                        positions. The DEXs and other protocols with which DeFAI Agent(s) interact
                        are Market Protocols within the meaning of Section 7.5, and Section 7.5
                        applies to them. Valory does not operate, control, or manage these DEXs or
                        protocols, does not execute, clear, or settle any transaction on them, and
                        does not determine pricing, slippage, eligibility, or outcomes. Consistent
                        with Section 5, Valory does not take custody of, access, or control any
                        assets used by the DeFAI Agent(s), which at all times remain in
                        user-controlled wallets or smart-contract wallets. The DeFAI Agent(s) may
                        hold or route between digital assets, and tokens not supported by a DeFAI
                        Agent(s) may be swapped into a supported asset when a position is entered.
                        Providing liquidity and transacting on DEXs involves significant risk,
                        including price volatility, slippage, impermanent loss, smart-contract
                        failure, failed or delayed transactions, and partial or total loss of
                        assets. Any reference to returns, yield, return of investment, or portfolio
                        performance is indicative only, is not guaranteed, and does not constitute
                        investment, financial, or trading advice. Nothing in the DeFAI Agent(s)
                        constitutes a managed account, pooled investment, or any offer to manage
                        assets and Section 3 applies in full. Valory is not liable for any losses,
                        damages, delays, failed actions, or other issues arising from or related to
                        the DeFAI Agent(s), the DEXs, or any third-party routing, bridging, or
                        pricing services they rely on, including outages, mispricing, or changes to
                        such services or their rules. Use of the DeFAI Agent(s) may be subject to
                        geographic, legal, or regulatory restrictions, and may be limited or
                        disabled at the Pearl Application level in accordance with Section 3, 7.5
                        and 8 herein.
                      </p>
                    </div>
                    <div>
                      <h6 className="text-lg text-black font-semibold" id="connect-terms">
                        6.1.2 Connect
                      </h6>
                      <p className="mt-2">
                        Pearl Connect (“Connect”) is a Pearl Agent; each instance you create is a
                        “Connect Agent”. Connect Agents are Pearl Agents that can connect to any
                        agent harness (e.g.{' '}
                        <ExternalLink href="https://claude.com/product/claude-code">
                          Claude Code
                        </ExternalLink>{' '}
                        (see Section 7.6), hereafter “Agent Harness”), and optionally any
                        Independent Agent you create independently via the Agent Harness (hereafter
                        “Independent Agent”, totally distinct from Pearl&apos;s Agents). Together
                        the Agent Harness and any Independent Agent are each termed a “Connected
                        Agent”, collectively “Connected Agents”. Unlike other Pearl Agents, Connect
                        is not autonomous: it is designed as a co-pilot for the Connected Agents,
                        giving them the ability to act on-chain — including transferring funds,
                        paying for Agent services via the Olas Protocol, or trading on Market
                        Protocols, such as Polymarket or Omen (see Section 7.5) — only when you
                        direct them to, live.
                      </p>
                      <p className="mt-2">
                        Connect is non-custodial in the manner described in Section 5: the Connected
                        Agent prepares the action you asked for, but neither it nor its provider
                        holds your private key or signs anything, only your Connect Agent can sign
                        and thereby approve the action and resulting actions, e.g. sending funds
                        from your Connect Agent&apos;s wallet (the “Agent Wallet”). Your Connected
                        Agent can prepare a trade on a Market Protocol, your Connect Agent can sign
                        the trade to approve the necessary actions (including transfers of funds
                        from your Agent Wallet), and your Connect Agent or Connected Agent can send
                        the signed trade to the Market Protocol, depending on the Market Protocol.
                        Trades are initiated by you or Connected Agents and are your own
                        responsibility, regardless of whether they are executed by the Connect Agent
                        and whether they are informed by predictions requested by the Connect Agent.
                        Any prediction, forecast, or other output returned by the Connect Agent is
                        generated by processes involving independent Third-Parties, is not reviewed
                        or verified by Valory, and does not constitute financial, investment, or
                        trading advice (Section 3).
                      </p>
                      <p className="mt-2">
                        <AlertTriangle size={18} className="inline-block mb-1" /> Connect Agents
                        carry risks in addition to those described in Sections 3, 4, and 7. By
                        creating and using your Connect Agent you are agreeing that any funds in
                        your Agent Wallet can be used by your Connect and Connected Agent. You
                        understand that these technologies are AI-mediated and may result in the
                        loss of any and all funds associated. Only fund your Agent Wallet with funds
                        you agree to spend. As with any AI Agent that acts on content it processes,
                        your Connected Agent could be manipulated by content it encounters into
                        requesting a transaction you did not intend (“prompt injection”). The
                        Connect Agents&apos; design can mitigate some risks but cannot fully
                        eliminate risks and your Agent&apos;s risk profile is affected by how you
                        configure it. Connect Agents&apos; protections also depend on the ordinary
                        security of your own device and Connected Agent installations, and on the
                        independent conduct of the Connected Agent provider and any Third-Party
                        Integrations you choose to interact with through it. You acknowledge that
                        using Connect Agents carry a non-zero risk of loss of some or all funds held
                        in the Agent Wallet, and that you are solely responsible for the Connected
                        Agent you use, the content it is exposed to, and how you configure your
                        Connect Agent.
                      </p>
                      <p className="mt-2">
                        Anything beyond what Connect Agents themselves provide — any MCP server,
                        skill, extension, workspace file, or other code you install or enable in
                        your Connected Agent — is added at your own discretion. Valory does not
                        audit, review, or endorse any such addition, and any loss of funds resulting
                        from its use is your sole responsibility. This is true even for additions
                        that never touch signing: reading wallet, balance, or position data does not
                        require a signature, so such additions can access and transmit that data to
                        third-parties regardless of any restrictions you apply to the Connect Agent,
                        which govern what can be signed, not what can be read.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5
                    className="text-lg text-black font-semibold"
                    id="agents-under-development-terms"
                  >
                    6.2 Agents Under Development
                  </h5>
                  <div className="space-y-4 mt-4 ml-8">
                    <div>
                      <h6 className="text-lg text-black font-semibold" id="optimus-terms">
                        6.2.1 Optimus
                      </h6>
                      <p className="mt-2">See Section 6.1.1.</p>
                    </div>
                    <div>
                      <h6 className="text-lg text-black font-semibold" id="pettbro-terms">
                        6.2.2 Pettbro
                      </h6>
                      <p className="mt-2">
                        “PettBro” is an autonomous Agent provided and built by Pett.ai (an
                        independent third-party that is not owned, operated, or controlled by
                        Valory, hereafter: “
                        <ExternalLink href="https://pett.ai/">Pett.ai</ExternalLink>”) that performs
                        actions on Pett.ai&apos;s game (hereafter “the Pett.ai Game”), for the
                        purpose of taking care of a user&apos;s digital “pet” on the Pett.ai Game.
                        PettBro is accessed via Pearl Application and operated and executed locally
                        on the user&apos;s device. Pearl Application provides the infrastructure for
                        accessing the Agent, while Pett.ai provides the Pett.ai Game, including its
                        logic, game environment, and backend services with which PettBro Agents
                        interact. The Pett.ai Game is powered by third-party services, “Pett.ai
                        Third-Party Services”, which are also independent from Valory. Pearl
                        Application does not design, modify, or control the internal decision-making
                        logic of the PettBro Agent nor the Pett.ai Game and does not act as a game
                        operator, decision-maker, or financial intermediary in relation to Pett.ai
                        and the Pett.ai Third-Party Services. When a user chooses to use a PettBro
                        Agent in Pearl Application they enable functionality that interacts with the
                        Pett.ai Game and Pett.ai Third-Party Services, which may change at any time.
                        Pearl Application may then establish (directly from the user&apos;s device)
                        ongoing and continuous communication with the Pett.ai Game and Pett.ai
                        Third-Party Services, including by means of a secure socket layer
                        (SSL)-based persistent connection, in order to receive pet state updates and
                        submit pet-related actions. PettBro involves continuous bidirectional data
                        exchange and ongoing execution rather than a one-time or incidental
                        connection. Pett.ai Third-Party Services may include third-party
                        authentication, identity, or verification services (including passwordless
                        authentication mechanism using one-time passcodes (OTPs)) to facilitate user
                        authentication and authorization. In connection with such interactions, data
                        exchanged may include identifiers and metadata necessary to operate the
                        functionality (such as the user&apos;s email address used to access the
                        Pett.ai Game, pet-care action commands submitted by the PettBro Agent, and
                        pet state and performance information returned by the Pett.ai backend).
                        Users acknowledge that Pett.ai collects and processes personal data as an
                        independent data controllers in connection with the Pett.ai Game, including
                        account identifiers, usage data, device and network information, and
                        analytics data, as defined in Pett.ai&apos;s{' '}
                        <ExternalLink href="https://docs.pett.ai/resources/privacy-policy-and-terms-of-services">
                          terms and privacy policy
                        </ExternalLink>
                        , and Pett.ai Third-Party Services may also do so as independent data
                        controllers in line with their policies, which are incorporated by reference
                        and apply in addition to these Pearl Terms. Pett.ai does not store or
                        persist data originating from the Pearl Application itself, however, Pett.ai
                        processes and stores user data and game state data required to operate the
                        Pett.ai Game. Valory does not control, determine, or influence how Pett.ai
                        or Pett.ai Third-Party Services process such data. Availability,
                        performance, and response times of the Pett.ai, the Pett.ai Game and PettBro
                        depend on Pett.ai and Pett.ai Third-Party Services and are not guaranteed by
                        Valory. You contract directly with Pett.ai and Pett.ai Third-Party Services
                        in relation to the Pett.ai Game. Valory does not operate, control, audit, or
                        guarantee the Pett.ai Game, PettBro, or any other Pett.ai services, nor
                        Pett.ai Third-Party Services nor their services, and Valory makes no
                        warranties regarding their availability, security, correctness, or
                        performance. To the maximum extent permitted by law, Valory is not liable
                        for any losses, damages, delays, failed actions, or other issues arising
                        from or related to the services offered by Pett.ai and the Third-Party
                        Services nor their dependencies, including outages, authentication failures,
                        or changes to services, rules or requirements). Virtual items, in-game
                        currencies, and rewards have no guaranteed financial value and are not
                        offered as investments, financial products, or profit-generating
                        opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">7. Third-Party Integrations</h4>
              <p className="mt-2">
                Valory is not liable for any Third-Party Integrations; you use them at your own sole
                risk and must comply with their respective terms. To the fullest extent permitted by
                law, Valory shall not be liable for any indirect, incidental, special, punitive, or
                consequential damages arising from the use of Pearl Application or any Third-Party
                Integrations. For more information see:
              </p>
              <div className="space-y-4 mt-4 ml-8">
                <div>
                  <h5 className="text-lg text-black font-semibold" id="transak-terms">
                    <LinkIcon size={18} className="inline-block mb-1" /> 7.1 Transak
                  </h5>
                  <p className="mt-2">
                    Transak is a regulated Virtual Asset Service Provider (VASP) that enables
                    fiat-to-crypto purchases (available at{' '}
                    <ExternalLink href="https://transak.com/">https://transak.com/</ExternalLink>,
                    hereafter: “the Transak Service”). Although the Transak Service is technically
                    accessed via a non-transactional proxy (for software compatibility only)
                    operated by Valory, your transaction remains exclusively with the Transak
                    Service Provider. This integration is offered for your convenience, and all
                    onramp services are clearly branded and operated by the Transak Service
                    provider. When accessing the Transak Service through Pearl Application, users
                    are redirected to the Transak Service&apos;s interface and contract directly
                    with the Transak Service provider under its own{' '}
                    <ExternalLink href="https://transak.com/terms-of-service">
                      Terms of Service
                    </ExternalLink>{' '}
                    and{' '}
                    <ExternalLink href="https://transak.com/privacy-policy">
                      Privacy Policy
                    </ExternalLink>
                    .
                  </p>
                  <p className="mt-2">
                    For the avoidance of doubt, Valory does not process or store user payment or any
                    data, perform KYC/AML checks, or hold, custody or transfer of fiat or crypto
                    funds: any processing or storage of user payments or user data, KYC/AML checks,
                    or holding, custody or transfer of funds taking place in the process of
                    fiat-to-crypto onboarding within Pearl Application is performed solely by the
                    Transak Service provider. Valory is not an intermediary, counterparty, or
                    payment processor in any onramp transaction. Valory assumes no responsibility or
                    liability for the performance, security, or data handling of the Transak Service
                    provider nor its integration, except to the extent such liability cannot
                    lawfully be excluded.
                  </p>
                </div>
                <div>
                  <h5 className="text-lg text-black font-semibold" id="web3auth-terms">
                    <LinkIcon size={18} className="inline-block mb-1" /> 7.2 Web3Auth
                  </h5>
                  <p className="mt-2">
                    Web3Auth is a third-party authentication and wallet backup service that uses
                    multi-party computation (MPC) technology (available at{' '}
                    <ExternalLink href="https://web3auth.io/">https://web3auth.io/</ExternalLink>,
                    hereafter: “the Web3Auth Service”). The Web3Auth Service enables users to create
                    a backup wallet to aid recovery of your main wallet used in Pearl Application
                    using a social login, e.g. an email account. Part of the private key of said
                    backup wallet is securely backed up via their chosen login method, and the other
                    part is held by Web3Auth&apos;s Service&apos;s infrastructure. The Web3Auth
                    Service provider acts as an independent service provider and may process limited
                    personal data (e.g., identifiers tied to your Authentication Provider) in
                    accordance with its own privacy policies. Neither Valory nor the Web3Auth
                    Service provider ever hold your full private key. Valory never accesses or
                    stores keys or parts of keys or login credentials. You contract directly with
                    the Web3Auth Service provider under its own{' '}
                    <ExternalLink href="https://web3auth.io/docs/legal/terms-and-conditions">
                      Terms of Use
                    </ExternalLink>{' '}
                    and{' '}
                    <ExternalLink href="https://web3auth.io/docs/legal/privacy-policy">
                      Privacy Policy
                    </ExternalLink>
                    . Users are solely responsible for maintaining access to their authentication
                    accounts via the Web3Auth Service. Valory assumes no responsibility or liability
                    for the performance, security, or data handling of the Web3Auth Service nor its
                    integration, except to the extent such liability cannot lawfully be excluded.
                  </p>
                </div>
                <div>
                  <h5 className="text-lg text-black font-semibold" id="zendesk-terms">
                    <LinkIcon size={18} className="inline-block mb-1" /> 7.3 Zendesk
                  </h5>
                  <p className="mt-2">
                    Pearl Application allows users to contact the Valory support team through
                    Zendesk (available at{' '}
                    <ExternalLink href="https://www.zendesk.com/">
                      https://www.zendesk.com/
                    </ExternalLink>
                    , hereafter: “the Zendesk Platform”), a third-party support platform integrated
                    into Pearl Application by Valory for handling support requests submitted by
                    users using the “Contact Support” form in Pearl Application. When submitting the
                    form, users are required to provide their email address, a description of the
                    issue, and may optionally attach files, including app logs. This data is stored
                    by the Zendesk Platform and is collected by Valory. The Valory support team may
                    access, use, export, or analyze the data for support purposes. While any data
                    use or support provision is handled by the Valory team, the full operation,
                    processing, and management of the Zendesk Platform and its integration is
                    performed by Zendesk and subject to the Zendesk Platform provider&apos;s{' '}
                    <ExternalLink href="https://www.zendesk.com/company/agreements-and-terms/terms-of-use/">
                      Terms of Use
                    </ExternalLink>{' '}
                    and{' '}
                    <ExternalLink href="https://www.zendesk.com/company/privacy./">
                      Privacy Policy
                    </ExternalLink>
                    . Valory does not make any guarantees, warranties or representations regarding
                    the timeliness, completeness, accuracy, or adequacy of any responses. Users
                    acknowledge that the “Contact Support” form in Pearl Application is provided for
                    convenience and clarity, and does not create any contractual obligations with
                    Valory. Valory is not responsible for any errors, miscommunications, or actions
                    resulting from the use of the Zendesk Platform, or for the content of messages
                    submitted by users. Users remain solely responsible for their own decisions,
                    actions, and precautions while using Pearl Application, including any reliance
                    on support or feedback received from Valory and/or through the Zendesk Platform.
                    Valory assumes no responsibility or liability for the performance, security, or
                    data handling of the Zendesk Platform provider nor its integration, except to
                    the extent such liability cannot lawfully be excluded.
                  </p>
                </div>
                <div>
                  <h5 className="text-lg text-black font-semibold" id="pettai-terms">
                    <LinkIcon size={18} className="inline-block mb-1" /> 7.4 Pett.ai
                  </h5>
                  <p className="mt-2">See Section 6.2.2.</p>
                </div>
                <div>
                  <h5 className="text-lg text-black font-semibold" id="market-protocols-terms">
                    7.5 Interaction with Market Protocols
                  </h5>
                  <p className="mt-2">
                    Some functionality in Pearl Application may interact with decentralized or
                    centralized market protocols operated by third-parties (“Market Protocols”).
                    Valory does not operate, control, or manage any Market Protocols, does not
                    execute, or clear trades on Market Protocols, and does not determine
                    eligibility, pricing, outcomes, settlement nor has custody or control of your
                    transactions on any Market Protocols. Market Protocols, and other decentralized
                    services referenced in these Pearl Terms, are frequently run by multiple
                    independent, and in some cases pseudonymous, operators rather than a single
                    identifiable entity; Valory is not liable for the acts, omissions, or
                    reliability of any such operator.
                  </p>
                  <p className="mt-2">
                    Valory relies on Market Protocols&apos; eligibility checks, KYC/AML compliance
                    and obligations, market operation, and outcome determination, and makes no
                    representation regarding their correctness, availability, or performance.
                  </p>
                  <p className="mt-2">
                    Use of functionality related to Market Protocols may be subject to geographic,
                    legal, or regulatory restrictions imposed by the Market Protocols&apos;
                    provider(s).
                  </p>
                  <p className="mt-2">
                    Where required to comply with applicable laws or third-party restrictions,
                    access to specific functionality (for example, Agents that trade on a particular
                    Market Protocol - like the Polystrat Agent that trades on the{' '}
                    <ExternalLink href="https://polymarket.com/">Polymarket</ExternalLink> Platform
                    (available at{' '}
                    <ExternalLink href="https://polymarket.com/">
                      https://polymarket.com/
                    </ExternalLink>
                    , herein: “Polymarket”) or Omenstrat Agent that trades via the decentralized
                    Omen Platform (available at{' '}
                    <ExternalLink href="https://dxdocs.eth.limo/docs/Products/omen/">
                      https://dxdocs.eth.limo/docs/Products/omen/
                    </ExternalLink>
                    , herein: “Omen”)) may be limited or disabled at the Pearl Application-level
                    (including preventing activation or execution of an Agent from certain
                    locations). Such limitations are not designed to affect user custody of funds or
                    the ability to withdraw assets (for example, assets held in user-controlled
                    wallets), however, Valory has no control over the Market Protocols and their
                    geographic limitations, for example, withdrawal of assets held in Market
                    Protocols in unresolved positions may be limited outside of approved
                    jurisdictions.
                  </p>
                </div>
                <div>
                  <h5 className="text-lg text-black font-semibold" id="anthropic-terms">
                    <LinkIcon size={18} className="inline-block mb-1" /> 7.6 Anthropic (Claude Code)
                  </h5>
                  <p className="mt-2">
                    <ExternalLink href="https://claude.com/product/claude-code">
                      Claude Code
                    </ExternalLink>
                    , including its Desktop and CLI forms, is software independently developed,
                    owned, and operated by Anthropic (available at{' '}
                    <ExternalLink href="https://www.anthropic.com/">anthropic.com</ExternalLink>,
                    hereafter: “the Anthropic Software”) and is not owned, controlled, or operated
                    by Valory. Pearl Application may launch or link to the Anthropic Software,
                    including as a means of accessing Pearl Connect (Section 6.1.2), but does not
                    modify it and has no visibility into or control over your Anthropic account,
                    session content, or any data you provide to or receive from it. Any mention and
                    interaction with Pearl or related software or communications from Valory does
                    not constitute nor imply a partnership or any other kind of relationship with
                    Anthropic nor an endorsement from the same. You contract directly with Anthropic
                    under its own applicable terms of service and privacy policy. Valory makes no
                    warranties regarding the Anthropic Software&apos;s availability, security,
                    correctness, or performance, and, to the maximum extent permitted by law, is not
                    liable for any losses, damages, or issues arising from or related to your use of
                    the Anthropic Software, including any output it generates or action it takes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                8. User responsibilities and prohibited uses
              </h4>
              <p className="mt-2">
                You represent and warrant that your access to and use of the Pearl Application, any
                Agent or Third-Party Integrations accessed through Pearl Application complies with
                all applicable laws, regulations, and third-party terms (including restrictions
                based on jurisdiction, sanctions, or residency) and that you are solely responsible
                for such compliance. Without limitation, you represent and warrant that: (i) you
                access and use Pearl Application only from jurisdictions where such use is lawful;
                (ii) you access or use third-party functionality through Pearl Application only if
                you are eligible to do so under applicable Third-Party Integrations&apos; terms
                (e.g. you are not a U.S. person where such status is restricted); (iii) you are not
                located in, resident in, or acting on behalf of any person or entity subject to
                sanctions or restricted measures administered or enforced by OFAC, Switzerland,
                European Union, or the United Nations; and (iv) you do not use VPNs, proxies, or
                other technical measures to circumvent geographic, sanctions-related, or eligibility
                restrictions imposed by Valory or Third-Party Integrations.
              </p>
              <p className="mt-2">
                You may not use Pearl Application to violate laws, infringe IP, introduce malware,
                reverse-engineer the software, or interfere with any networks. Valory may suspend or
                terminate access to Pearl Application through which the user interacts with their
                Agent (or specific functionality of the Pearl Application) at any time for violation
                of these Pearl Terms, including for breach of eligibility, sanctions, or
                jurisdictional restrictions, without any obligation to compensate you or any
                third-party for resulting losses. Pearl Application may include or rely on
                open-source libraries, which are subject to their respective licenses; you agree to
                comply with such licenses, and Valory makes no warranties and assumes no liability
                regarding such third-party open-source components.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                9. Updates, governing law and dispute resolution
              </h4>
              <p className="mt-2">
                Valory may update these Pearl Terms from time to time to reflect changes in the
                product or legal requirements. Updates will be effective when posted on the Pearl
                Site or within Pearl Application, and continued use after posting constitutes
                acceptance. Continued use of Pearl Application after such updates constitutes
                acceptance of the revised terms. If you do not agree to the Conditions your sole
                remedy is to discontinue your use of Pearl Application.
              </p>
              <p className="mt-2">
                These Pearl Terms are governed by and constructed in accordance with the laws of
                Switzerland, and any disputes shall be resolved in accordance with the dispute
                resolution provisions of the Valory Terms. If any provision of these Terms is found
                to be invalid or unenforceable, the remaining provisions shall remain in full force
                and effect.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">10. Support</h4>
              <p className="mt-2">
                If you encounter a problem/question, please contact here -{' '}
                <ExternalLink href="mailto:support@valory.zendesk.com">
                  support@valory.zendesk.com
                </ExternalLink>
                .
              </p>
            </section>
          </div>
        </article>
      </SectionWrapper>
    </Layout>
  );
};

export default PearlTerms;
