import { Flipside } from '@flipsidecrypto/sdk';

const flipsideApiCall = async ({ query }) => {
  const flipside = new Flipside(
    process.env.NEXT_PUBLIC_FLIPSIDE_API_KEY,
    'https://api-v2.flipsidecrypto.xyz',
  );

  const queryResultSet = await flipside.query.run({ sql: query });
  return queryResultSet;
};

export const getTotalTransactionsCount = async () => {
  const sql = `
    With ethereum as (
      SELECT
        date_trunc('month', BLOCK_TIMESTAMP) as month,
        'Ethereum' as chain,
        count(*) as no_txn
      from
        ethereum.core.fact_transactions
      where
        TO_ADDRESS in (
          SELECT
            DECODED_LOG:multisig as multisig
          from
            ethereum.core.ez_decoded_event_logs
          where
            CONTRACT_ADDRESS = '0x48b6af7b12c71f09e2fc8af4855de4ff54e775ca'
            and CONTRACT_NAME = 'Service Registry'
            and EVENT_NAME = 'CreateMultisigWithAgents'
        )
      group by
        1
    ),
    polygon as (
      SELECT
        date_trunc('month', BLOCK_TIMESTAMP) as month,
        'Polygon' as chain,
        count(*) as no_txn
      from
        Polygon.core.fact_transactions
      where
        TO_ADDRESS in (
          SELECT
            DECODED_LOG:multisig as multisig
          from
            Polygon.core.ez_decoded_event_logs
          where
            CONTRACT_ADDRESS = '0xe3607b00e75f6405248323a9417ff6b39b244b50'
            and CONTRACT_NAME = 'Service Registry L2'
            and EVENT_NAME = 'CreateMultisigWithAgents'
        )
      group by
        1
    ),
    gnosis as (
      SELECT
        date_trunc('month', BLOCK_TIMESTAMP) as month,
        'Gnosis' as chain,
        count(*) as no_txn
      from
        Gnosis.core.fact_transactions
      where
        TO_ADDRESS in (
          SELECT
            DECODED_LOG:multisig as multisig
          from
            Gnosis.core.ez_decoded_event_logs
          where
            CONTRACT_ADDRESS = '0x9338b5153ae39bb89f50468e608ed9d764b755fd'
            and CONTRACT_NAME = 'Service Registry L2'
            and EVENT_NAME = 'CreateMultisigWithAgents'
        )
      group by
        1
    ),
    arbitrum as (
      SELECT
        date_trunc('month', BLOCK_TIMESTAMP) as month,
        'Arbitrum' as chain,
        count(*) as no_txn
      from
        arbitrum.core.fact_transactions
      where
        TO_ADDRESS in (
          SELECT
            DECODED_LOG:multisig as multisig
          from
            arbitrum.core.ez_decoded_event_logs
          where
            CONTRACT_ADDRESS = '0xe3607b00e75f6405248323a9417ff6b39b244b50' --and CONTRACT_NAME = 'Service Registry L2'
            and EVENT_NAME = 'CreateMultisigWithAgents'
        )
      group by
        1
    ),
    optimism as (
      SELECT
        date_trunc('month', BLOCK_TIMESTAMP) as month,
        'Optimism' as chain,
        count(*) as no_txn
      from
        optimism.core.fact_transactions
      where
        TO_ADDRESS in (
          SELECT
            DECODED_LOG:multisig as multisig
          from
            optimism.core.ez_decoded_event_logs
          where
            CONTRACT_ADDRESS = '0x3d77596beb0f130a4415df3d2d8232b3d3d31e44' --and CONTRACT_NAME = 'Service Registry L2'
            and EVENT_NAME = 'CreateMultisigWithAgents'
        )
      group by
        1
    ),
    base as (
      SELECT
        date_trunc('month', BLOCK_TIMESTAMP) as month,
        'Base' as chain,
        count(*) as no_txn
      from
        base.core.fact_transactions
      where
        TO_ADDRESS in (
          SELECT
            DECODED_LOG:multisig as multisig
          from
            base.core.ez_decoded_event_logs
          where
            CONTRACT_ADDRESS = '0x3c1ff68f5aa342d296d4dee4bb1cacca912d95fe' --and CONTRACT_NAME = 'Service Registry L2'
            and EVENT_NAME = 'CreateMultisigWithAgents'
        )
      group by
        1
    ),
    solana as (
      SELECT
        date_trunc('month', BLOCK_TIMESTAMP) as month,
        'Solana' as chain,
        count(*) as no_txn
      from
        crosschain.olas.fact_service_events
      where
        BLOCKCHAIN = 'solana'
      group by
        1
    ),
    final as (
      select
        *
      from
        ethereum
      union
      all
      select
        *
      from
        polygon
      union
      all
      select
        *
      from
        gnosis
      union
      all
      select
        *
      from
        arbitrum
      union
      all
      select
        *
      from
        optimism
      union
      all
      select
        *
      from
        base
      union
      all
      select
        *
      from
        solana
    ),
    final2 as (
      select
        month,
        chain,
        no_txn
      from
        final
    )
    select
      month,
      sum(no_txn) as "Transactions",
      sum("Transactions") over (
        order by
          month
      ) as "Cumulative transactions"
    from
      final2
    group by
      1
    having
      month is not null
    order by
      1 desc
  `;
  const queryResultSet = await flipsideApiCall({ query: sql, maxAgeMinutes: 60 * 24 });
  return queryResultSet;
};

export const getTotalUnitsCount = async () => {
  const sql = `
    WITH tb1 AS (
    SELECT
      'Service' AS type,
      COUNT(*) AS total_mints
    FROM
      (
        SELECT
          *
        FROM
          ethereum.nft.ez_nft_transfers
        WHERE
          NFT_ADDRESS = lower('0x48b6af7B12C71f09e2fC8aF4855De4Ff54e775cA')
          AND NFT_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'
        UNION
        ALL
        SELECT
          *
        FROM
          polygon.nft.ez_nft_transfers
        WHERE
          NFT_ADDRESS = lower('0xE3607b00E75f6405248323A9417ff6b39B244b50')
          AND NFT_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'
        UNION
        ALL
        SELECT
          *
        FROM
          gnosis.nft.ez_nft_transfers
        WHERE
          NFT_ADDRESS = lower('0x9338b5153AE39BB89f50468E608eD9d764B755fD')
          AND NFT_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'
      )
    UNION
    ALL
    SELECT
      'Agent' AS type,
      COUNT(*) AS total_mints
    FROM
      ethereum.nft.ez_nft_transfers
    WHERE
      NFT_ADDRESS = lower('0x2F1f7D38e4772884b88f3eCd8B6b9faCdC319112')
      AND NFT_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'
    UNION
    ALL
    SELECT
      'Component' AS type,
      COUNT(*) AS total_mints
    FROM
      ethereum.nft.ez_nft_transfers
    WHERE
      NFT_ADDRESS = lower('0x15bd56669f57192a97df41a2aa8f4403e9491776')
      AND NFT_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'
  )
  SELECT
    type,
    total_mints
  FROM
    tb1
  `;
  const queryResultSet = await flipsideApiCall({ query: sql, maxAgeMinutes: 60 * 24 });
  return queryResultSet;
};
