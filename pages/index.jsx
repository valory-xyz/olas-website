import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  getTransactionsTotal,
  getAgentsTotal,
  getAgentsTypesTotal,
} from 'common-util/api';
import { getTotalTransactionsCount, getTotalUnitsCount } from 'common-util/api/flipside';
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
  ]);

  return {
    props: {
      activityMetrics: {
        transactions: transactions.status === 'fulfilled' ? transactions : null,
        agents: agents.status === 'fulfilled' ? agents : null,
        agentsTypes: agentsTypes.status === 'fulfilled' ? agentsTypes : null,
      },
    },
    revalidate: DAY_IN_SECONDS,
  };
};

export default function Home({ activityMetrics }) {
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  const [isUnitsLoading, setIsUnitsLoading] = useState(true);
  const [units, setUnits] = useState(null);

  useEffect(() => {
    getTotalTransactionsCount()
      .then((data) => setTransaction(data))
      .catch((error) => console.error(error))
      .finally(() => setIsTransactionLoading(false));

    getTotalUnitsCount()
      .then((data) => setUnits(data))
      .catch((error) => console.error(error))
      .finally(() => setIsUnitsLoading(false));
  }, [activityMetrics]);
  window.console.log({
    isTransactionLoading,
    transaction,
    isUnitsLoading,
    units,
  });

  const flipsideMetrics = useMemo(
    () => ({
      transactions: transaction,
      units,
    }),
    [transaction, units],
  );
  window.console.log(flipsideMetrics);

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
