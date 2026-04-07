import type { SearchRequest, SearchResponse } from '../types/search';

export async function fetchSearchResults(
  params: SearchRequest = {},
): Promise<SearchResponse> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set('search', params.search);
  }

  if (params.filter) {
    query.set('filter', params.filter);
  }

  query.set('take', String(params.take ?? 4));
  query.set('offset', String(params.offset ?? 0));

  const response = await fetch(`/api/search?${query.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to fetch dummy listings.');
  }

  return (await response.json()) as SearchResponse;
}
