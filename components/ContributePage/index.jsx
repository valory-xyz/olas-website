import Content from "./Content";
import Contribute from "./Contribute";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import NetworkRole from "./NetworkRole";
import Benefits from "./Benefits";
import Features from "./Features";

const Bonds = () => {
  return <>
    <Hero />
    <Benefits />
    <Features />
    {/* <HowItWorks /> */}
    <Content />
    <NetworkRole />
    <Contribute />
  </>
};

export default Bonds;
