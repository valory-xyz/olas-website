import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/models-page/hero.png"
    alt="Models"
    width={580}
    height={580}
    priority
    className="xl:w-full mx-auto"
  />
);

const BrowseModels = () => (
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#models">Browse Models</a>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS MODELS"
    title="AI Models Built for Olas"
    description="Specialised models trained for the agents running on Olas."
    PrimaryButton={BrowseModels}
    backgroundType="GRAY"
    className="bg-gradient-to-t from-slate-100 to-gray-50"
  />
);
