import PropTypes from 'prop-types';

import { getTransactionsTotal, getAgentsTotal, getAgentsTypesTotal } from 'common-util/api';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Hero from 'components/HomepageSection/Hero';
import Activity from 'components/HomepageSection/Activity';
import UseCases from 'components/HomepageSection/UseCases';
import { TheTech } from 'components/HomepageSection/TheTech';
import PropelledBy from 'components/HomepageSection/PropelledBy';
import GetInvolved from 'components/HomepageSection/GetInvolved';
import Media from 'components/HomepageSection/Media';

const DAY_IN_SECONDS = 86400;

export const getStaticProps = async () => {
  const [transactions, agents, agentsTypes] = await Promise.allSettled([
    getTransactionsTotal(),
    getAgentsTotal(),
    getAgentsTypesTotal(),
    // getBlockchainsTotal(),
  ]);

  return {
    props: {
      activityMetrics: {
        transactions: transactions.status === 'fulfilled' ? transactions : null,
        agents: agents.status === 'fulfilled' ? agents : null,
        agentsTypes: agentsTypes.status === 'fulfilled' ? agentsTypes : null,
        // blockchains: blockchains.status === 'fulfilled' ? blockchains.value : null,
      },
    },
    revalidate: DAY_IN_SECONDS,
  };
};

export default function Home({ activityMetrics }) {
  return (
    <PageWrapper>
      <Meta />
      <Hero />
      <Activity activityMetrics={activityMetrics} />
      <UseCases />
      <TheTech />
      <PropelledBy />
      <GetInvolved />
      <Media />
    </PageWrapper>
  );
}

Home.propTypes = {
  activityMetrics: PropTypes.object.isRequired,
};
