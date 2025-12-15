/* eslint-disable react/no-unescaped-entities */
import { PEARL_YOU_URL } from 'common-util/constants';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { ExternalLink } from 'components/ui/typography';
import Link from 'next/link';

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
              <strong>Ownership & Operation</strong> <br />
              The Sites (the{' '}
              <Link href="/" className="text-purple-600">
                https://olas.network/
              </Link>{' '}
              &{' '}
              <ExternalLink href={PEARL_YOU_URL}>
                https://pearl.you/
              </ExternalLink>
              , hereinafter “the Sites”) are owned by the Autonolas DAO (aka
              Olas DAO, or “the Owner”) and operated by Crypto in Motion (“the
              Operator”). For the Terms of Use of the Pearl application, please
              see{' '}
              <Link href="/pearl-terms" className="text-purple-600">
                here
              </Link>
              .
            </li>

            <li>
              <strong>Purpose & General Information</strong> <br />
              The Sites have been prepared by the Owner solely for use by you
              for general information only and do not contain and are not to be
              taken as containing any form of securities advice, financial and
              investment advice, recommendation, offer or invitation to
              subscribe for, purchase or redeem any OLAS tokens. <br />
              The Sites does not represent an offer to sell, or a solicitation
              of offers to purchase or subscribe for OLAS tokens.
            </li>

            <li>
              <strong>
                Disclaimer of Warranties & Limitation of Liability
              </strong>{' '}
              <br />
              THE SITES ARE PROVIDED "AS IS" AND "AS AVAILABLE," AT YOUR OWN
              RISK, AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND,
              WHETHER EXPRESSED OR IMPLIED, REGARDING THE SITES OR THEIR
              CONTENT. Neither the Owner nor the Operator will be liable for any
              loss, whether such loss is direct, indirect, special, or
              consequential, suffered by any party as a result of their use of
              this site. Your use of the Sites is at your own risk.
            </li>

            <li>
              <strong>Third-Party Information</strong> <br />
              The Sites present a vision of the Owner and are also based on
              third-party information which may not be correct or complete.
              Neither the Owner nor the Operator verifies, endorses, or
              guarantees the accuracy, completeness, or reliability of any
              third-party content. Responsibility for the accuracy, completeness
              or reliability of third-party content lies solely with the
              respective third-party sources.
            </li>

            <li>
              <strong>Forward-Looking Statements</strong> <br />
              The Sites contain specific forward-looking statements that include
              terms like "believe", "assume", "expect", "target" or similar
              expressions. Such forward-looking statements represent the Owner's
              judgments and expectations and are subject to known and unknown
              risks, uncertainties and other factors that may result in a
              substantial divergence between the actual results, the financial
              situation, and/or the development or performance of the Owner and
              those explicitly and implicitly presumed in these statements.
              These factors include, but are not limited to general market,
              macroeconomic, government and regulatory trends, competitive
              pressures, and other risks and uncertainties in relation to the
              Owner. The Owner is not under any obligation to (and expressly
              disclaims any such obligation to) update or alter such
              forward-looking statements, whether as result of new information,
              future events or otherwise, except as required by applicable law
              or regulation. Nothing contained herein is, or shall be relied on
              as, a promise or representation concerning the future activities
              of the Owner.
            </li>

            <li>
              <strong>User Representations & Warranties</strong> <br />
              By accessing and using the Sites, you represent and warrant:
              <ol className={`list-[lower-alpha] ${subClassName}`}>
                <li>
                  that you are of legal age and that you will comply with any
                  laws applicable to you and not engage in any illegal
                  activities;
                </li>
                <li>
                  that, if you are claiming OLAS tokens, you are doing so to
                  participate in the Owner’s governance process and that they do
                  not represent consideration for past or future services;
                </li>
                <li>
                  that you, the country you are a resident of, and your wallet
                  address is not on any sanctions lists maintained by the United
                  Nations, Switzerland, the EU, UK or the US;
                </li>
                <li>
                  that you are responsible for any tax obligations arising out
                  of the interaction with the Sites;
                </li>
                <li>
                  none of the information available on the Sites, or made
                  otherwise available to you in relation to their use,
                  constitutes any legal, tax, financial or other advice. Where
                  in doubt as to the action you should take, please consult your
                  own legal, financial, tax or other professional advisors; and
                </li>
                <li>
                  that your data may be collected per this Disclaimer and
                  Privacy Policy, in particular Section 8 regarding ‘Privacy and
                  Analytics Tools’.
                </li>
              </ol>
            </li>

            <li>
              <strong>Location - based measures</strong> <br />
              In case the Sites link to any platform on which OLAS tokens can be
              acquired, the following apply:
              <ol className={`list-[lower-alpha] ${subClassName}`}>
                <li>
                  usage may be restricted for residents of jurisdictions subject
                  to sanctions or local prohibitions;
                </li>
                <li>
                  to comply with applicable laws, users from OFAC Restricted
                  Countries and the United States of America are prohibited from
                  participating; or
                </li>
                <li>
                  access restrictions may be implemented via technical and
                  compliance measures, and do not affect your statutory rights.
                </li>
              </ol>
              Users interacting with third-party platforms linked from the Sites
              do so at their own risk. The Owner and the Operator are not
              responsible for any interactions with third-party platforms nor
              data, security, or financial loss on third-party platforms. <br />
              We may process limited, region-level IP geolocation data (which
              identifies the user’s country and region from their IP address) to
              determine whether access to this Site is permitted from your
              location. This enables some locations to be restricted due to
              legal, regulatory, security or other reasonable requirements. We
              do not use or collect precise location data. The limited location
              data that is processed, is processed in aggregate, anonymized form
              and not used for analytics, marketing, profiling, or any secondary
              purpose. Location data is processed transiently and is not stored,
              logged, or linked to any user account or identifier. These access
              restrictions may be applied consistently across all websites and
              applications operated on behalf of the Owner following the same
              minimal-data principles described above.
            </li>

            <li>
              <strong>Privacy and Analytics Tools</strong> <br />
              <ol className={`list-[lower-alpha] ${subClassName}`}>
                <li>
                  <strong>Use of Privacy-Focused Analytics Tools</strong> <br />
                  This Site uses Plausible, a privacy-focused, open-source
                  analytics tool, to analyze website usage, improve performance,
                  and enhance user experience. Plausible processes only
                  anonymized, aggregated data without using cookies or tracking
                  technologies across different websites.
                </li>
                <li>
                  <strong>Types of Data Collected</strong> <br />
                  Plausible collects anonymized and aggregated data, such as:
                  <ol className={`list-[lower-roman] ${subClassName}`}>
                    <li>
                      Browser type, operating system, and device information;
                    </li>
                    <li>
                      Pages visited, time spent on the Site, and navigation
                      paths;
                    </li>
                    <li>General geographic location (non-specific);</li>
                    <li>
                      Interactions with outbound links, file downloads, 404
                      error pages, hashed page paths custom events and;
                    </li>
                    <li>custom properties.</li>
                  </ol>
                  No personally identifiable information (PII) is collected. You
                  can explore all the data points Plausible does collect in
                  their{' '}
                  <ExternalLink href="https://plausible.io/data-policy">
                    data policy
                  </ExternalLink>
                  , nor does it track across devices, across websites and apps
                  or send or share or sell your data to third parties. Data that
                  may be indirectly identifiable under applicable data privacy
                  laws (IP addresses or device hashes) is masked or anonymized.
                </li>
                <li>
                  <strong>Purpose and Legal Basis for Processing</strong> <br />
                  Data is processed to monitor and improve website performance
                  and to generate aggregated insights for business purposes.
                  Because all data is anonymized, explicit consent is not
                  required under GDPR.
                </li>
                <li>
                  <strong>Data Sharing and Retention</strong> <br />
                  Data is processed by Plausible Analytics in compliance with
                  GDPR and is not shared with third parties for commercial
                  purposes. Plausible reassures users that their data ‘
                  <ExternalLink href="https://plausible.io/blog/google-analytics-illegal">
                    never leaves the EU
                  </ExternalLink>
                  ’.
                </li>
              </ol>
            </li>

            <li>
              <strong>User Rights</strong> <br />
              Users may:
              <ol className="list-[lower-alpha] pl-6 space-y-2">
                <li>Request access to analytics data;</li>
                <li>
                  Inquire about data practices and exercise rights under
                  applicable data privacy laws.
                </li>
              </ol>
            </li>

            <li>
              <strong>Updates</strong> <br />
              This page was last updated on 12.12.2025. <br />
              Any changes will be reflected on this page. If material changes
              are made to how your personal data is processed, we will notify
              you on the Site before the changes take effect. Continued use of
              the Site after such notice constitutes acceptance of the updated
              Disclaimer & Privacy Policy.
            </li>

            <li>
              <strong>Governing Law</strong> <br />
              This Disclaimer & Privacy Policy shall be governed by and
              construed in accordance with the substantive laws of Switzerland,
              excluding the United Nations Convention on Contracts for the
              International Sale of Goods dated 11 April 1980 (CISG), as amended
              from time to time. <br />
              All disputes arising out of or in connection with this Disclaimer
              & Privacy Policy, including disputes on its conclusion, binding
              effect, amendment and termination, shall be resolved by the
              ordinary courts in Switzerland.
            </li>

            <li>
              <strong>Contact Information</strong> <br />
              If you have any questions about this Disclaimer & Privacy Policy,
              please contact Crypto in Motion (
              <ExternalLink href="contact@cryptoinmotion.co.uk">
                contact@cryptoinmotion.co.uk
              </ExternalLink>
              ).
            </li>
          </ol>
        </div>
      </article>
    </SectionWrapper>
  </PageWrapper>
);

export default DisclaimerPage;
