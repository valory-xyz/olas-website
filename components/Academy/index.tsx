import { Hero } from './Hero';
import { IntensiveProgram } from './IntensiveProgram';
import { LearnAtYourOwnPace } from './LearnAtYourOwnPace';
import { OlasDevAcademy } from './OlasDevAcademy';
import { Paths } from './Paths';

const PausedBanner = () => (
  <div className="bg-purple-600 text-white py-4 px-6 text-center">
    <p className="text-lg font-semibold">The Academy is currently paused!</p>
  </div>
);

const Academy = () => (
  <>
    <PausedBanner />
    <Hero />
    <Paths />
    <OlasDevAcademy />
    <IntensiveProgram />
    <LearnAtYourOwnPace />
  </>
);

export default Academy;
