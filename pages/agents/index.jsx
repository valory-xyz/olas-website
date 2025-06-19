import { Agents } from 'components/Agents';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AgentsPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Agents"
      description="Explore Olas' ecosystem of AI Agents—from sovereign agents you can run locally, like Modius, Optimus, and Agents.fun, to decentralized agents like Mech and Governatooor, powered by multi-operator consensus."
    />
    <Agents />
  </PageWrapper>
);

export default AgentsPage;
