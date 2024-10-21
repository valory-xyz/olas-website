import PageWrapper from "components/Layout/PageWrapper";
import Meta from "components/Meta";
import { GetInvolved } from "components/OptimusPage/GetInvolved";
import { OptimusAgentMetrics } from "components/OptimusPage/OptimusAgentMetrics";
import { OptimusHero } from "components/OptimusPage/OptimusHero";
import { TheProcess } from "components/OptimusPage/TheProcess";
import { WhatIsOlasOptimus } from "components/OptimusPage/WhatIsOlasOptimus";
import { WhyOlasOptimus } from "components/OptimusPage/WhyOlasOptimus";

const Optimus = () => (
  <PageWrapper>
    <Meta pageTitle="Optimus" description="AI agent-powered DeFi management" />

    <OptimusHero />
    <OptimusAgentMetrics />
    <WhatIsOlasOptimus />
    <TheProcess />
    <WhyOlasOptimus />
    <GetInvolved />
  </PageWrapper>
);

export default Optimus;
