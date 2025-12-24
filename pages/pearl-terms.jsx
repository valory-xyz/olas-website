import { AlertTriangle, Link } from 'lucide-react';

import {
  DISCORD_INVITE_URL,
  PEARL_YOU_URL,
  VALORY_URL,
} from 'common-util/constants';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import SectionHeading from 'components/SectionHeading';
import { ExternalLink } from 'components/ui/typography';
import { useRouter } from 'next/router';

// Note: All links on this page must be external because
// the page is also rendered inside the Pearl app
const PearlTerms = () => {
  const router = useRouter();
  const hideLayout = router?.query?.hideLayout === 'true';
  const Layout = hideLayout ? 'div' : PageWrapper;
  return (
    <Layout>
      <Meta pageTitle="Pearl Terms" />
      <SectionWrapper backgroundType="SUBTLE_GRADIENT">
        <article className="max-w-[800px] mx-auto">
          <SectionHeading color="text-purple-950">Pearl Terms</SectionHeading>
          <div className="text-xl text-gray-600 space-y-6">
            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                1. Introduction and Scope
              </h4>
              <p className="mt-2">
                Valory AG (“Valory” as defined in{' '}
                <ExternalLink href={`${VALORY_URL}/terms`}>
                  Valory Terms
                </ExternalLink>
                ) develops and provides tools built on emerging technologies,
                including the open-source Pearl Application (“Pearl”), which is
                developed and maintained by Valory.
              </p>
              <p className="mt-2">
                Pearl is a desktop application available for download on the{' '}
                <ExternalLink href={PEARL_YOU_URL}>Pearl Site</ExternalLink>,
                therefore is subject to these Pearl Terms, the Valory Terms, and
                the{' '}
                <ExternalLink href={`${PEARL_YOU_URL}/disclaimer`} hideArrow>
                  Pearl Disclaimer & Privacy Policy
                </ExternalLink>{' '}
                (collectively known as the “Conditions”). In case of conflict
                between these Pearl Terms, the Pearl Disclaimer & Privacy
                Policy, the Transak Terms of Service and Privacy Policy, the
                Web3Auth Terms of Use and Privacy Policy, the Pett.ai Terms of
                Service and Privacy Policy, and the Valory Terms, the Valory
                Terms prevail. Nothing in these Pearl Terms shall be construed
                to waive or limit any rights, remedies, or limitations of
                liability that Valory (or its affiliates) retain under the
                Valory Terms.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                2. What are Pearl and Olas
              </h4>
              <p className="mt-2">
                Pearl enables users to run autonomous agents locally, on their
                own devices. These agents interact with the{' '}
                <ExternalLink href="https://olas.network/protocol" hideArrow>
                  Olas Protocol
                </ExternalLink>
                , a decentralized platform for owning AI agents and other
                protocols. Users access Pearl through the{' '}
                <ExternalLink href={PEARL_YOU_URL}>Pearl Site</ExternalLink>,
                which is a website owned by Valory. The Pearl Application, Site
                and brand “Pearl” or “Olas Pearl” and associated Marks are part
                of Valory&apos;s “Offerings” and governed by the Valory Terms.
                All trademarks, logos, and branding associated with Pearl are
                owned or licensed by Valory.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                3. Acceptance of the terms and risks
              </h4>
              <p className="mt-2">
                By downloading, installing, or using Pearl, you acknowledge and
                agree to be bound by these Pearl Terms, the Conditions, and the
                terms and privacy policies of third-party services with which
                Pearl integrates, such as Transak, Web3Auth, Pett.ai, and any
                third party services underlying those third parties. If you do
                not agree, you should not download Pearl, or, if you already
                have, you should stop using it.
              </p>
              <p className="mt-2">
                The Conditions explain the risks involved in using Offerings
                like Pearl, which are based on emerging technologies (such as
                blockchain). Nothing in Pearl or related materials constitutes
                investment advice, a financial promotion, or an offer to manage
                assets. You remain solely responsible for your financial
                decisions and blockchain transactions, and for understanding any
                legal, tax, or regulatory obligations that may apply.
              </p>
              <p className="mt-2">
                Whilst using Pearl, users may interact with or receive{' '}
                <ExternalLink href="https://olas.network/olas-token" hideArrow>
                  Olas tokens
                </ExternalLink>
                , a digital asset associated with the Olas Protocol
                (specifically its native token), via the Olas Protocol. Any
                issuance, distribution or receipt of Olas tokens is governed by
                the Olas Protocol (and not Pearl or Valory, since the Olas
                Protocol is governed by the Olas DAO) and is not guaranteed.
                Users assume all risks associated with acquiring, holding, or
                transacting with Olas tokens, including potential loss of value,
                irretrievability, or tax or regulatory obligations.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                4. Limitation of liability
              </h4>
              <p className="mt-2">
                <AlertTriangle size={18} className="inline-block mb-1" />{' '}
                Warning: Pearl is experimental open-source software that is
                provided “as is”, without any representation that it has been
                fully audited, tested, or secured. If you choose to use Pearl,
                you do so at your own risk. To the maximum extent permitted by
                law, and except where mandatory consumer protections apply,
                Valory is not liable and responsible for any delays, losses,
                damages, or issues resulting from or arising out of using Pearl
                or related integrations, nor for paying any costs related to the
                same.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                5. Non-custodial nature & data handling
              </h4>
              <p className="mt-2">
                Pearl is a non-custodial software interface developed by Valory.
                Valory does not ever take custody of user funds, access wallets,
                or act as a financial intermediary or data processor on behalf
                of users. Valory does not sell, nor rent, nor share personal
                data, nor collect personal data via Pearl. Any technical data
                generated by Pearl is processed locally on your device solely to
                enable the software&apos;s functionality and is never shared
                with Valory. All wallet keys, configurations, and operational
                data remain local to your device.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                6. Third Party Integrations
              </h4>
              <p className="mt-2">
                Pearl integrates third-party services, such as Transak,
                Web3Auth, and Pett.ai. Valory is not responsible for any
                third-party services; you use them at your own risk and must
                comply with their terms. To the fullest extent permitted by law,
                Valory shall not be liable for any indirect, incidental, or
                consequential damages arising from the use of Pearl or any
                third-party services.
              </p>
              <p className="mt-2">
                Any interaction with the Olas Protocol or the Olas DAO through
                Pearl, including earning or transferring Olas tokens, is solely
                at the user&apos;s risk and subject to the rules, risks, and
                discretion of the Olas DAO.
              </p>
              <div className="space-y-4 mt-4 ml-8">
                <div>
                  <h5
                    className="text-lg text-black font-semibold"
                    id="transak-terms"
                  >
                    <Link size={18} className="inline-block mb-1" /> 6.1 Transak
                  </h5>
                  <p className="mt-2">
                    Transak is a regulated Virtual Asset Service Provider (VASP)
                    that enables fiat-to-crypto purchases. Although this service
                    is technically accessed via a non-transactional proxy (for
                    software compatibility only) operated by Valory, your
                    transaction remains exclusively with Transak. This
                    integration is offered for your convenience, and all onramp
                    services are clearly branded and operated by Transak. When
                    accessing Transak through Pearl, users are redirected to
                    Transak&apos;s interface and contract directly with Transak
                    under its own{' '}
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
                    For the avoidance of doubt, Valory does not process or store
                    user payment or any data, perform KYC/AML checks, or hold,
                    custody or transfer of fiat or crypto funds: any processing
                    or storage of user payments or user data, KYC/AML checks, or
                    holding, custody or transfer of funds taking place in the
                    process of fiat-to-crypto onboarding within Pearl is
                    performed solely by Transak. Valory is not an intermediary,
                    counterparty, or payment processor in any onramp
                    transaction. Valory assumes no responsibility or liability
                    for the performance, security, or data handling of Transak
                    nor its integration, except to the extent such liability
                    cannot lawfully be excluded.
                  </p>
                </div>
                <div>
                  <h5
                    className="text-lg text-black font-semibold"
                    id="web3auth-terms"
                  >
                    <Link size={18} className="inline-block mb-1" /> 6.2
                    Web3Auth
                  </h5>
                  <p className="mt-2">
                    Web3Auth is a third-party authentication and wallet backup
                    service that uses multi-party computation (MPC) technology.
                    Web3Auth enables users to create a backup wallet to aid
                    recovery of your main wallet used in Pearl using a social
                    login, e.g. an email account. Part of the private key of
                    said backup wallet is securely backed up via their chosen
                    login method, and the other part is held by Web3Auth&apos;s
                    infrastructure. Web3Auth acts as an independent service
                    provider and may process limited personal data (e.g.,
                    identifiers tied to your Authentication Provider) in
                    accordance with its own privacy policies. Neither Valory nor
                    Web3Auth ever hold your full private key. Valory never
                    accesses or stores keys or parts of keys or login
                    credentials. You contract directly with Web3Auth under its
                    own{' '}
                    <ExternalLink href="https://web3auth.io/docs/legal/terms-and-conditions">
                      Terms of Use
                    </ExternalLink>{' '}
                    and{' '}
                    <ExternalLink href="https://web3auth.io/docs/legal/privacy-policy">
                      Privacy Policy
                    </ExternalLink>
                    . Users are solely responsible for maintaining access to
                    their authentication accounts via Web3Auth. Valory assumes
                    no responsibility or liability for the performance,
                    security, or data handling of Web3Auth nor its integration,
                    except to the extent such liability cannot lawfully be
                    excluded.
                  </p>
                </div>
                <div>
                  <h5
                    className="text-lg text-black font-semibold"
                    id="zendesk-terms"
                  >
                    <Link size={18} className="inline-block mb-1" /> 6.3 Zendesk
                  </h5>
                  <p className="mt-2">
                    Pearl allows users to contact the Valory support team
                    through Zendesk, a third-party support platform integrated
                    into Pearl by Valory for handling support requests submitted
                    by users using the “Contact Support” form in Pearl. When
                    submitting the form, users are required to provide their
                    email address, a description of the issue, and may
                    optionally attach files, including app logs. This data is
                    stored by Zendesk and is collected by Valory. The Valory
                    support team may access, use, export, or analyze the data
                    for support purposes. While any data use or support
                    provision is handled by the Valory team, the full operation,
                    processing, and management of the Zendesk platform and its
                    integration is performed by Zendesk and subject to
                    Zendesk&apos;s{' '}
                    <ExternalLink href="https://www.zendesk.com/company/agreements-and-terms/terms-of-use/">
                      Terms of Use
                    </ExternalLink>{' '}
                    and{' '}
                    <ExternalLink href="https://www.zendesk.com/company/privacy./">
                      Privacy Policy
                    </ExternalLink>
                    . Valory does not make any guarantees, warranties or
                    representations regarding the timeliness, completeness,
                    accuracy, or adequacy of any responses. Users acknowledge
                    that the “Contact Support” form in Pearl is provided for
                    convenience and clarity, and does not create any contractual
                    obligations with Valory. Valory is not responsible for any
                    errors, miscommunications, or actions resulting from the use
                    of Zendesk, or for the content of messages submitted by
                    users. Users remain solely responsible for their own
                    decisions, actions, and precautions while using Pearl,
                    including any reliance on support or feedback received from
                    Valory and/or through Zendesk. Valory assumes no
                    responsibility or liability for the performance, security,
                    or data handling of Zendesk nor its integration, except to
                    the extent such liability cannot lawfully be excluded.
                  </p>
                </div>
                <div>
                  <h5
                    className="text-lg text-black font-semibold"
                    id="pettai-terms"
                  >
                    <Link size={18} className="inline-block mb-1" /> 6.4 Pett.ai
                  </h5>
                  <p className="mt-2">
                    Pearl allows users to access agents built by various parties
                    including Pett.ai,{' '}
                    <ExternalLink href="https://docs.pett.ai/resources/official-links">
                      an independent third party
                    </ExternalLink>{' '}
                    that is not owned, operated, or controlled by Valory.
                    “PettBro” is an agent provided and built by Pett.ai that
                    performs actions on Pett.ai&apos;s game (hereafter “the
                    Pett.ai Game”), for the purpose of taking care of a
                    user&apos;s digital “pet” on the Pett.ai Game. PettBro is
                    accessed via Pearl and operated and executed locally on the
                    user&apos;s device. Pearl provides the infrastructure for
                    accessing the agent, while Pett.ai provides the Pett.ai
                    Game, including its logic, game environment, and backend
                    services with which PettBro agents interact. The Pett.ai
                    Game is powered by third-party services, “Pett.ai Third
                    Party Services”, which are also independent from Valory.
                    Pearl does not design, modify, or control the internal
                    decision-making logic of the PettBro agent nor the Pett.ai
                    Game and does not act as a game operator, decision-maker, or
                    financial intermediary in relation to Pett.ai and the
                    Pett.ai Third Party Services. When a user chooses to use a
                    PettBro agent in Pearl they enable functionality that
                    interacts with the Pett.ai Game and Pett.ai Third Party
                    Services, which may change at any time. Pearl may then
                    establish (directly from the user&apos;s device) ongoing and
                    continuous communication with the Pett.ai Game and Pett.ai
                    Third Party Services, including by means of a secure socket
                    layer (SSL)-based persistent connection, in order to receive
                    pet state updates and submit pet-related actions. PettBro
                    involves continuous bidirectional data exchange and ongoing
                    execution rather than a one-time or incidental connection.
                    Pett.ai Third Party Services may include third-party
                    authentication, identity, or verification services
                    (including passwordless authentication mechanism using
                    one-time passcodes (OTPs)) to facilitate user authentication
                    and authorization. In connection with such interactions,
                    data exchanged may include identifiers and metadata
                    necessary to operate the functionality (such as the
                    user&apos;s email address used to access the Pett.ai Game,
                    pet-care action commands submitted by the PettBro agent, and
                    pet state and performance information returned by the
                    Pett.ai backend). Users acknowledge that Pett.ai collects
                    and processes personal data as an independent data
                    controllers in connection with the Pett.ai Game, including
                    account identifiers, usage data, device and network
                    information, and analytics data, as defined in
                    Pett.ai&apos;s{' '}
                    <ExternalLink href="https://docs.pett.ai/resources/privacy-policy-and-terms-of-services">
                      terms and privacy policy
                    </ExternalLink>
                    , and Pett.ai Third Party Services may also do so as
                    independent data controllers in line with their policies,
                    which are incorporated by reference and apply in addition to
                    these Pearl Terms. Pett.ai does not store or persist data
                    originating from the Pearl itself, however, Pett.ai
                    processes and stores user data and game state data required
                    to operate the Pett.ai Game. Valory does not control,
                    determine, or influence how Pett.ai or Pett.ai Third Party
                    Services process such data. Availability, performance, and
                    response times of the Pett.ai, the Pett.ai Game and PettBro
                    depend on Pett.ai and Pett.ai Third Party Services and are
                    not guaranteed by Valory. You contract directly with Pett.ai
                    and Pett.ai Third Party Services in relation to the Pett.ai
                    Game. Valory does not operate, control, audit, or guarantee
                    the Pett.ai Game, PettBro, or any other Pett.ai services,
                    nor Pett.ai Third Party Services nor their services, and
                    Valory makes no warranties regarding their availability,
                    security, correctness, or performance. To the maximum extent
                    permitted by law, Valory is not liable for any losses,
                    damages, delays, failed actions, or other issues arising
                    from or related to the services offered by Pett.ai and the
                    Third Party Services nor their dependencies, including
                    outages, authentication failures, or changes to services,
                    rules or requirements). Virtual items, in-game currencies,
                    and rewards have no guaranteed financial value and are not
                    offered as investments, financial products, or
                    profit-generating opportunities.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                7. User responsibilities and prohibited uses
              </h4>
              <p className="mt-2">
                By agreeing to the Conditions, you acknowledge and accept all
                risks associated with the use of Pearl or other Offerings and
                integrated third-party services, and you bear full
                responsibility for all such risks that may include potential
                loss of digital assets, data exposure, tax or regulatory
                implications and reporting, or unexpected software behaviour.
                You may not use Pearl to violate laws, infringe IP, introduce
                malware, reverse-engineer, or interfere with networks. Valory
                may suspend or terminate access to Pearl at any time for
                violation of these Pearl Terms or prohibited use, without any
                obligation to compensate you or any third party for resulting
                losses. Pearl may include or rely on open-source libraries,
                which are subject to their respective licenses; you agree to
                comply with such licenses, and Valory makes no warranties
                regarding third-party open-source components.
              </p>
              <p className="mt-2">
                Users acknowledge that Valory does not issue, guarantee, or
                manage Olas tokens and is not responsible for any token-related
                losses, account balances, or third-party token activities.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                8. Updates, governing law and dispute resolution
              </h4>
              <p className="mt-2">
                Valory may update these Pearl Terms from time to time to reflect
                changes in the product or legal requirements. Updates will be
                effective when posted on the Pearl Site or within Pearl, and
                continued use after posting constitutes acceptance. Continued
                use of Pearl after such updates constitutes acceptance of the
                revised terms. If you do not agree to the Conditions your sole
                remedy is to discontinue your use of Pearl.
              </p>
              <p className="mt-2">
                These Pearl Terms are governed by and constructed in accordance
                with the laws of Switzerland, and any disputes shall be resolved
                in accordance with the dispute resolution provisions of the
                Valory Terms.
              </p>
            </section>

            <section>
              <h4 className="text-xl text-black font-semibold mt-8">
                9. Support
              </h4>
              <p className="mt-2">
                If you encounter a problem/question, some support is available{' '}
                <ExternalLink href={DISCORD_INVITE_URL}>
                  in the Olas Discord server
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
