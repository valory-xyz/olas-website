import type { GraphQLClient } from 'graphql-request';

import {
  MARKETPLACE_GRAPH_CLIENTS,
  MARKETPLACE_SQUID_CLIENTS,
  MECH_FEES_GRAPH_CLIENTS,
  MECH_FEES_SQUID_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
  REGISTRY_SQUID_CLIENTS,
} from 'common-util/graphql/client';
import { WithMeta } from 'common-util/graphql/types';

/**
 * Sources indexed by The Graph subgraphs on some chains and SQD squids (OpenReader dialect)
 * on others. The client set a chain sits in picks the query: each metric passes both
 * dialects, with the squid query aliasing its fields to the subgraph shape, and squid
 * responses get their `squidStatus` turned into `_meta` so callers stay dialect-blind.
 */

export type IndexerQuery = { subgraph: string; squid: string };

type SquidStatus = { squidStatus?: { height?: number | string | null } | null };

const createRequester = <
  S extends Record<string, GraphQLClient>,
  Q extends Record<string, GraphQLClient>,
>(
  subgraphClients: S,
  squidClients: Q
) => {
  type Chain = Extract<keyof S | keyof Q, string>;
  const chains = [...Object.keys(subgraphClients), ...Object.keys(squidClients)] as Chain[];

  const request = async <T extends object>(
    chain: Chain,
    query: IndexerQuery
  ): Promise<WithMeta<T>> => {
    if (chain in subgraphClients)
      return subgraphClients[chain].request<WithMeta<T>>(query.subgraph);

    const { squidStatus, ...data } = await squidClients[chain].request<T & SquidStatus>(
      query.squid
    );
    // Squids have no indexing-error flag: a failed handler stops the processor, which
    // surfaces as lag instead.
    const height = squidStatus?.height;
    return {
      ...(data as T),
      _meta:
        height == null
          ? undefined
          : { hasIndexingErrors: false, block: { number: Number(height) } },
    };
  };

  return { chains, request };
};

const mechFees = createRequester(MECH_FEES_GRAPH_CLIENTS, MECH_FEES_SQUID_CLIENTS);
export type MechFeesChain = (typeof mechFees.chains)[number];
export const MECH_FEES_CHAINS = mechFees.chains;
export const requestMechFees = mechFees.request;

const marketplace = createRequester(MARKETPLACE_GRAPH_CLIENTS, MARKETPLACE_SQUID_CLIENTS);
export const MARKETPLACE_CHAINS = marketplace.chains;
export const requestMarketplace = marketplace.request;

const registry = createRequester(REGISTRY_GRAPH_CLIENTS, REGISTRY_SQUID_CLIENTS);
export const REGISTRY_CHAINS = registry.chains;
export const requestRegistry = registry.request;
