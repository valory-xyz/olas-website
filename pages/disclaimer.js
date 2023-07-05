/* eslint-disable react/no-unescaped-entities */
import PageWrapper from '@/components/Layout/PageWrapper';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import Videos from '@/components/Content/Videos'
import SectionHeading from '@/components/SectionHeading';
import Meta from '@/components/Meta';

const DisclaimerPage = () =>
  <PageWrapper>
    <Meta pageTitle="Disclaimer" />
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}>
      <article className="max-w-[800px] mx-auto">
        <SectionHeading size="text-4xl lg:text-2xl" color="text-purple-950">Disclaimer</SectionHeading>
        <div className='text-xl text-gray-600'>
          <ol className="list-decimal">

            <li>This Site is owned by the Autonolas DAO and operated by Centrality Labs.</li>

            <li>This Site has been prepared by the Autonolas DAO solely for use by you for general information only and does not contain and is not to be taken as containing any securities advice, recommendation, offer or invitation to subscribe for, purchase or redeem any OLAS tokens.</li>

            <li>This Site is not an offer to sell or a solicitation of offers to purchase or subscribe for OLAS tokens.</li>

            <li>THIS SITE IS PROVIDED "AS IS" AND "AS AVAILABLE," AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. Neither Autonolas nor Centrality Labs will be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of this site. This Site presents a vision of Autonolas DAO and is also based on third party information which may not be correct or complete;</li>

            <li>This Site contains specific forward-looking statements that include terms like "believe", "assume", "expect", "target" or similar expressions. Such forward-looking statements represent the Autonolas DAO's judgments and expectations and are subject to known and unknown risks, uncertainties and other factors that may result in a substantial divergence between the actual results, the financial situation, and/or the development or performance of the Autonolas DAO and those explicitly and implicitly presumed in these statements. These factors include, but are not limited to general market, macroeconomic, government and regulatory trends, competitive pressures, and other risks and uncertainties in relation to the Autonolas DAO. The Autonolas DAO is not under any obligation to (and expressly disclaims any such obligation to) update or alter its forward-looking statements, whether as result of new information, future events or otherwise, except as required by applicable law or regulation. Nothing contained herein is, or shall be relied on as, a promise or representation concerning the future activities of the Autonolas DAO.</li>

            <li>By accessing this Site, you represent and warrant:
              <ol className="pl-6 list-decimal">

                <li>that you are of legal age and that you will comply with any laws applicable to you and not engage in any illegal activities;</li>

                <li>that, if you are claiming OLAS tokens, you are doing so to participate in the Autonolas DAO governance process and that they do not represent consideration for past or future services;</li>

                <li>that you, the country you are a resident of and your wallet address is not on any sanctions lists maintained by the United Nations, Switzerland, the EU, UK or the US;</li>

                <li>that you are responsible for any tax obligations arising out of the interaction with this site.</li>

                <li>None of the information available on this site, or made otherwise available to you in relation to its use, constitutes any legal, tax, financial or other advice. Where in doubt as to the action you should take, please consult your own legal, financial, tax or other professional advisors.
                </li>
              </ol>
            </li>
            <li>
              In case this Site links to any platform on which OLAS tokens can be acquired, the following applies:
              <ol className="pl-6 list-decimal">
                <li>
                  To comply with local laws and regulations, we prohibit participants from the following countries in the sale: <a className='text-primary' href="https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information" rel="noopener noreferrer" target="_blank">OFAC Restricted Countries</a>, United States of America
                </li>
              </ol>
            </li>
          </ol>
        </div>
      </article>
    </SectionWrapper>
  </PageWrapper>
  ;

export default DisclaimerPage;