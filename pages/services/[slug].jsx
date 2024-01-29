import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import servicesData from '@/data/services.json';
import Meta from '@/components/Meta';
import PageWrapper from '@/components/Layout/PageWrapper';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


const FieldRow = ({ fieldName, value }) => (
  <div className={'p-4 flex justify-between'}>
    <div>{fieldName}</div>
    <div>{value}</div>
  </div>
);

const ServiceDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState(null);

  useEffect(() => {
    if (slug) {
      const matchedService = servicesData.find(service => service.slug === slug);
      setService(matchedService);
    }
  }, [slug]);

  if (!service) return <Spinner />;

  return (
    <PageWrapper>
      <Meta pageTitle={service.name} siteImageUrl={`/images/services/${service.iconFilename}`} />
      <SectionWrapper>
        <div className={`flex flex-row justify-between`}>
          <div className="flex flex-col justify-center"><div>
            <h1 className="text-5xl font-bold mb-4">
              {service.name}
            </h1>
            {service.demo && <Badge variant="outline" className="mb-8">Demo</Badge>}
            <div className="border rounded-lg mb-8">
              {service.serviceCategory &&
                <FieldRow fieldName="Category" value={service.serviceCategory} />
              }
              {service.builder && <FieldRow fieldName="Builder" value={service.builder} />}
              {service.description && <FieldRow fieldName="Description" value={service.description} last />}
            </div>
            {service.appUrl &&
              <Button size="lg" asChild className="mr-4">
                <a
                  href={service.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View app
                </a>
              </Button>
            }
            {service.marketingUrl && <Button size="lg" asChild className="mr-4">
              <a
                href={service.marketingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </Button>
            }
            {service.buildUrl &&
              <Button size="lg" asChild className="mr-4">
                <a
                  href={service.buildUrl}
                  target="_blank"
                  rel="noopener nor eferrer"
                >
                  Build your own
                </a>
              </Button>
            }
          </div>
          </div>
          <div className="flex justify-start">
            <Image
              src={`/images/services/${service.iconFilename}`}
              alt={`${service.name} icon`}
              width={200}
              height={200}
              className="my-6"
            />
          </div>
        </div>
      </SectionWrapper>
    </PageWrapper >
  );
};

export default ServiceDetail;

