import { SECTION_BOX_CLASS } from 'common-util/classes';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import Link from 'next/link';

const OlasPredictR1Page = () => (
  <PageWrapper>
    {/* Placeholder until the designed page lands — keep it out of search until then. */}
    <Meta
      pageTitle="Olas-Predict-R1-14B"
      description="A model fine-tuned for forecasting."
      noindex
    />
    <SectionWrapper backgroundType="NONE" customClasses={`${SECTION_BOX_CLASS} bg-slate-100`}>
      <div className="max-w-4xl mx-auto flex flex-col text-center">
        <SectionHeading spacing="mb-6" color="text-slate-800">
          Olas-Predict-R1-14B
        </SectionHeading>
        <p className="text-lg text-slate-600 mb-10">
          A model fine-tuned for forecasting. More details coming soon.
        </p>
        <Button variant="outline" size="lg" className="w-fit mx-auto" asChild>
          <Link href="/models">Back to Models</Link>
        </Button>
      </div>
    </SectionWrapper>
  </PageWrapper>
);

export default OlasPredictR1Page;
