/* eslint-disable react/no-unescaped-entities */
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const subClassName = 'pl-6 space-y-2';

const DisclaimerPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Disclaimer"
      description="Visit our disclaimer page to learn more about the legal terms, conditions, and limitations of using our website and services."
    />
    <SectionWrapper backgroundType="SUBTLE_GRADIENT">
      <article className="max-w-[800px] mx-auto">
        <h1 className="tracking-tight text-4xl md:text-6xl lg:text-2xl text-purple-950 font-bold md:font-black mb-12">
          Disclaimer & Privacy Policy
        </h1>
        <div className="text-xl text-gray-600">
          <ol className="list-decimal space-y-4">
            <li>
              This Site is owned by the Autonolas DAO (aka Olas DAO) and
              operated by Centrality Labs.
            </li>

            <li>
              This Site has been prepared by the Autonolas DAO solely for use by
              you for general information only and does not contain and is not
              to be taken as containing any securities advice, recommendation,
              offer or invitation to subscribe for, purchase or redeem any OLAS
              tokens.
            </li>

            <li>
              This Site is not an offer to sell or a solicitation of offers to
              purchase or subscribe for OLAS tokens.
            </li>

            <li>
              THIS SITE IS PROVIDED "AS IS" AND "AS AVAILABLE," AT YOUR OWN
              RISK, AND WITHOUT WARRANTIES OF ANY KIND. Neither Autonolas nor
              Centrality Labs will be liable for any loss, whether such loss is
              direct, indirect, special or consequential, suffered by any party
              as a result of their use of this site. This Site presents a vision
              of Autonolas DAO and is also based on third party information
              which may not be correct or complete;
            </li>

            <li>
              This Site contains specific forward-looking statements that
              include terms like "believe", "assume", "expect", "target" or
              similar expressions. Such forward-looking statements represent the
              Autonolas DAO's judgments and expectations and are subject to
              known and unknown risks, uncertainties and other factors that may
              result in a substantial divergence between the actual results, the
              financial situation, and/or the development or performance of the
              Autonolas DAO and those explicitly and implicitly presumed in
              these statements. These factors include, but are not limited to
              general market, macroeconomic, government and regulatory trends,
              competitive pressures, and other risks and uncertainties in
              relation to the Autonolas DAO. The Autonolas DAO is not under any
              obligation to (and expressly disclaims any such obligation to)
              update or alter its forward-looking statements, whether as result
              of new information, future events or otherwise, except as required
              by applicable law or regulation. Nothing contained herein is, or
              shall be relied on as, a promise or representation concerning the
              future activities of the Autonolas DAO.
            </li>

            <li>
              By accessing this Site, you represent and warrant:
              <ol className={`list-[lower-alpha] ${subClassName}`}>
                <li>
                  that you are of legal age and that you will comply with any
                  laws applicable to you and not engage in any illegal
                  activities;
                </li>

                <li>
                  that, if you are claiming OLAS tokens, you are doing so to
                  participate in the Autonolas DAO governance process and that
                  they do not represent consideration for past or future
                  services;
                </li>

                <li>
                  that you, the country you are a resident of and your wallet
                  address is not on any sanctions lists maintained by the United
                  Nations, Switzerland, the EU, UK or the US;
                </li>

                <li>
                  that you are responsible for any tax obligations arising out
                  of the interaction with this site;
                </li>

                <li>
                  None of the information available on this site, or made
                  otherwise available to you in relation to its use, constitutes
                  any legal, tax, financial or other advice. Where in doubt as
                  to the action you should take, please consult your own legal,
                  financial, tax or other professional advisors;
                </li>

                <li>
                  that your data may be collected per this Disclaimer and
                  Privacy Policy, in particular Section 8 regarding ‘Privacy and
                  Analytics Tools’.
                </li>
              </ol>
            </li>
            <li>
              If this Site links to any platform where OLAS tokens can be
              acquired, the following restrictions apply:
              <ol className={`list-[lower-alpha] ${subClassName}`}>
                <li>
                  Participation may be restricted for residents of jurisdictions
                  subject to sanctions or local prohibitions;
                </li>
                <li>
                  To comply with applicable laws, participants from{' '}
                  <a
                    className="text-primary"
                    href="https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    OFAC Restricted Countries
                  </a>{' '}
                  and the United States of America are prohibited from
                  participating.
                </li>
                <li>
                  Access restrictions are implemented via technical and
                  compliance measures, such as IP address or wallet screening,
                  and do not affect your statutory privacy rights.
                </li>
              </ol>
            </li>
            <li>
              Location Data & Access Restriction <br />
              We may process limited, region-level IP geolocation (country and
              region as derived from the IP address) data to determine whether
              access to this Site is permitted from your location. Some regions
              may be restricted due to legal, regulatory, or security
              requirements. We do not use or collect precise location data. This
              is processed solely for the purpose of enforcing access
              restrictions where required. It is not used for analytics,
              marketing, profiling, or any secondary purpose. Location data is
              processed transiently and is not stored, logged, or linked to any
              user account or identifier. These access restrictions may be
              applied consistently across all websites and applications operated
              on behalf of the Olas DAO, following the same minimal-data
              principles described above.
            </li>
            <li>
              Privacy and Analytics Tools
              <ol className={`list-[lower-alpha] ${subClassName}`}>
                <li>
                  Use of Privacy-Focused Analytics Tools <br /> This Site uses
                  Plausible, a privacy-focused,{' '}
                  <a
                    className="text-primary"
                    href="https://plausible.io/privacy-focused-web-analytics"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    open-source analytics tool
                  </a>
                  , to analyze website usage, improve performance, and enhance
                  user experience. Plausible respects user privacy by processing
                  only anonymized, aggregated data without using cookies or
                  tracking technologies across different websites.
                </li>
                <li>
                  Types of Data Collected <br />
                  Plausible collects anonymized and aggregated data, including:
                  <ol className={`list-[lower-roman] ${subClassName}`}>
                    <li>
                      Browser type, operating system, and device information.
                    </li>
                    <li>
                      Pages visited, time spent on the site, and navigation
                      paths.
                    </li>
                    <li>General geographic location (non-specific).</li>
                    <li>
                      Interactions with: outbound links, file downloads, 404
                      error pages, hashed page paths (e.g. tracking clicks to
                      specific parts of a page), custom events (e.g. tracking
                      button clicks), and custom properties (e.g. campaign
                      tracking).
                    </li>
                    <li>
                      No personally identifiable information (PII) is collected.
                      You can explore all the data points Plausible does collect
                      in their{' '}
                      <a
                        className="text-primary"
                        href="https://plausible.io/data-policy"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        data policy
                      </a>
                      , nor does it track across devices, across websites and
                      apps or send or share or sell your data to third parties.
                    </li>
                  </ol>
                </li>
                <li>
                  Purpose and Legal Basis for Processing <br />
                  The data is processed to monitor and improve website
                  performance and generate aggregated insights for business
                  purposes. As all data is anonymized, no explicit consent is
                  required under GDPR.
                </li>
                <li>
                  Data Sharing and Retention Data is processed by Plausible
                  Analytics in compliance with GDPR and is not shared with third
                  parties. Plausible reassures users that their data ‘
                  <a
                    className="text-primary"
                    href="https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    never leaves the EU
                  </a>
                  '.
                </li>
                <li>
                  User Rights <br />
                  Users may:
                  <ol className={`list-[lower-roman] ${subClassName}`}>
                    <li>Request access to analytics data.</li>
                    <li>
                      Inquire about data practices by contacting
                      <a
                        className="text-primary"
                        href="https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {' '}
                        Centrality Labs
                      </a>
                      .
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              Updates <br />
              This page was last updated on 29.11.24. Changes will be reflected
              on this page.
            </li>
          </ol>
        </div>
      </article>
    </SectionWrapper>
  </PageWrapper>
);

export default DisclaimerPage;
