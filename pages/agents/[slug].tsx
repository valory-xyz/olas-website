import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { Spinner } from 'components/Spinner';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import servicesData from 'data/agents.json';
import Image from 'next/image';
import PropTypes from 'prop-types';

const FieldRow = ({ fieldName, value }) => (
  <div className="p-4 flex justify-between gap-8 text-right">
    <div>{fieldName}</div>
    <div>{value}</div>
  </div>
);

FieldRow.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const ServiceDetail = ({ service }) => {
  if (!service) return <Spinner />;

  return (
    <PageWrapper>
      <Meta
        pageTitle={service.name}
        description={service.description}
        siteImageUrl={`/images/agents/${service.iconFilename}`}
      />
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'ch'.
      // @ts-expect-error TS(2741): Property 'backgroundType' is missing in type '{ ch... Remove this comment to see the full error message
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-between max-w-5xl mx-auto">
          <div className="flex flex-col justify-center">
            {service.deprecated && (
              <Image
                src="/images/agents/deprecated-tag.svg"
                alt="deprecated"
                width={113}
                height={32}
                className="mb-4"
              />
            )}
            <h1 className="text-5xl font-bold mb-4">{service.name}</h1>
            {service.demo && (
              <div className="inline-block">
                // @ts-expect-error TS(2322) FIXME: Type '{ children: string; variant: string; classNa... Remove this comment to see the full error message
                <Badge variant="outline" className="mb-8">
                  Demo
                </Badge>
              </div>
            )}
            <div className="border rounded-lg mb-8">
              {service.serviceCategory && (
                <FieldRow
                  fieldName="Category"
                  value={service.serviceCategory}
                />
              )}
              {service.builder && (
                <FieldRow fieldName="Builder" value={service.builder} />
              )}
              {service.description && (
                <FieldRow
                  fieldName="Description"
                  value={service.description}

                  // @ts-expect-error TS(2322) FIXME: Type '{ fieldName: string; value: any; last: true;... Remove this comment to see the full error message
                  last
                />
              )}
            </div>
            {service.appUrl && (

              // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; size: "xl"; asChild: tr... Remove this comment to see the full error message
              <Button size="xl" asChild className="w-full lg:w-auto mb-4">
                <a
                  href={service.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View app
                </a>
              </Button>
            )}
            {service.marketingUrl && (

              // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; size: "xl"; variant: "o... Remove this comment to see the full error message
              <Button
                size="xl"
                variant="outline"
                asChild
                className="w-full lg:w-auto mb-4"
              >
                <a
                  href={service.marketingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </Button>
            )}
            {service.integrateUrl && (

              // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; size: "xl"; variant: "o... Remove this comment to see the full error message
              <Button
                size="xl"
                variant="outline"
                asChild
                className="w-full lg:w-auto mb-4"
              >
                <a
                  href={service.integrateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Integrate Mechs
                </a>
              </Button>
            )}
            {service.buildUrl && (

              // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; size: "xl"; variant: "o... Remove this comment to see the full error message
              <Button
                size="xl"
                variant="outline"
                asChild
                className="w-full lg:w-auto"
              >
                <a
                  href={service.buildUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Build your own
                </a>
              </Button>
            )}
          </div>
          <div className="flex justify-center">
            <Image
              src={`/images/agents/${service.iconFilename}`}
              alt={`${service.name} icon`}
              width={200}
              height={200}
              className="my-6"
            />
          </div>
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default ServiceDetail;

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const matchedService = servicesData.find(
    (item) => item.slug === slug && !item.removePage,
  );
  if (!matchedService) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      service: matchedService,
    },
  };
}
