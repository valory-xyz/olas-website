import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/predict-page/hero.png"
    alt="Predict Hero"
    width={500}
    height={500}
    className="xl:w-full mx-auto"
  />
);

const OnDemand = (
  <div>
    On-demand
    <br />
    Agent-powered
    <br />
    Predictions
  </div>
);

const GetInvolved = () => (
  <Button variant="default" size="xl" asChild className="max-xl:grow">
    <a href="#grow">Get involved</a>
  </Button>
);

const ExplorePredict = () => (
  <Button
    variant="ghostPrimary"
    size="xl"
    asChild
    className="max-xl:grow"
    target="_blank"
    rel="noopener noreferrer"
  >
    <a href="https://predict.olas.network">Explore Predict UI</a>
  </Button>
);

export const PredictHero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS PREDICT"
    title={OnDemand}
    PrimaryButton={GetInvolved}
    SecondaryButton={ExplorePredict}
  />
);
