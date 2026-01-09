import Image from 'next/image';

import { PREDICT_URL } from 'common-util/constants';
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
    <a href="#get-started">Get involved</a>
  </Button>
);

const ExplorePredict = () => (
  <Button variant="ghostPrimary" size="xl" asChild className="max-xl:grow">
    <a href={PREDICT_URL} rel="noopener noreferrer">
      Explore Predict UI
    </a>
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
