import PageWrapper from '@/components/Layout/PageWrapper';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import Videos from '@/components/Content/Videos'
import SectionHeading from '@/components/SectionHeading';

const DisclaimerPage = () =>
  <PageWrapper>
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}>
      <article className="max-w-[800px] mx-auto">
        <SectionHeading size="text-4xl lg:text-2xl" color="text-purple-950">Disclaimer</SectionHeading>
        <div className='text-xl text-gray-600'>
          <ol className='list-decimal list-outside space-y-2 pl-4'>
            <li>This Website is owned by the Olas DAO and operated by&nbsp;<a href="https://centralitylabs.com/" target="_blank" rel="noopener noreferrer">Centrality Labs</a>. This Website is intended as an educational and navigation tool for the Olas community.</li>
            <li>THIS WEBSITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. Neither Olas nor Centrality Labs will be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of this website.</li>
            <li>By accessing this website, you represent and warrant
              <ol  className='list-decimal list-inside pl-2'>
                <li>that you are of legal age and that you will comply with any laws applicable to you and not engage in any illegal activities;</li>
                <li>that you are claiming OLAS tokens to participate in the Olas DAO governance process and that they do not represent consideration for past or future services;</li>
                <li>that you, the country you are a resident of and your wallet address is not on any sanctions lists maintained by the United Nations, Switzerland, the EU, UK or the US;</li>
                <li>that you are responsible for any tax obligations arising out of the interaction with this website.</li>
              </ol>
            </li>
            <li>None of the information available on this website, or made otherwise available to you in relation to its use, constitutes any legal, tax, financial or other advice. Where in doubt as to the action you should take, please consult your own legal, financial, tax or other professional advisors.</li>
          </ol>
        </div>
      </article>
    </SectionWrapper>
  </PageWrapper>
  ;

export default DisclaimerPage;