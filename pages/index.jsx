import PropTypes from 'prop-types';

import {
  getTotalTransactionsCount,
  getTotalUnitsCount,
} from 'common-util/api/flipside';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Hero from 'components/HomepageSection/Hero';
import { Activity } from 'components/HomepageSection/Activity';
import UseCases from 'components/HomepageSection/UseCases';
import { TheTech } from 'components/HomepageSection/TheTech';
import { PropelledBy } from 'components/HomepageSection/PropelledBy';
import GetInvolved from 'components/HomepageSection/GetInvolved';
import Media from 'components/HomepageSection/Media';

const DAY_IN_SECONDS = 86400;

export const getStaticProps = async () => {
  const [transactions, unitsCount] = await Promise.allSettled([
    getTotalTransactionsCount(),
    getTotalUnitsCount(),
  ]);

  return {
    props: {
      activityMetrics: {
        transactions:
          transactions.status === 'fulfilled' ? transactions.value : null,
        agents:
          unitsCount.status === 'fulfilled'
            ? unitsCount.value.agentsCount
            : null,
        agentsTypes:
          unitsCount.status === 'fulfilled'
            ? unitsCount.value.agentTypesCount
            : null,
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
      <GetInvolved />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}

Home.propTypes = {
  activityMetrics: PropTypes.object.isRequired,
};
