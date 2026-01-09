import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import { MetricStatus, MetricWithStatus, WithMeta } from './types';

export const createStaleStatus = (
  indexingErrors: string[],
  fetchErrors: string[],
): MetricStatus => ({
  stale: indexingErrors.length > 0 || fetchErrors.length > 0,
  lastValidAt:
    indexingErrors.length === 0 && fetchErrors.length === 0 ? Date.now() : null,
  indexingErrors,
  fetchErrors,
});

type GraphQLQueryOptions<TData, TResult> = {
  client: GraphQLClient;
  query: RequestDocument;
  variables?: Variables;
  source: string;
  transform: (data: TData) => TResult;
};

export async function executeGraphQLQuery<
  TData extends WithMeta<unknown>,
  TResult,
>({
  client,
  query,
  variables,
  source,
  transform,
}: GraphQLQueryOptions<TData, TResult>): Promise<
  MetricWithStatus<TResult | null>
> {
  const indexingErrors: string[] = [];

  try {
    const data = (await client.request(query, variables)) as TData;

    if (data._meta?.hasIndexingErrors) {
      indexingErrors.push(source);
    }

    const value = transform(data);

    return {
      value,
      status: createStaleStatus(indexingErrors, []),
    };
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return {
      value: null,
      status: createStaleStatus([], [source]),
    };
  }
}
