import type { SearchRequest, SearchResponse } from '../types/search';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(
  /\/$/,
  '',
);
const DEFAULT_TAKE = 4;
const DEFAULT_OFFSET = 0;
const SEARCH_ENDPOINT = '/api/search';
const FETCH_RESULTS_ERROR_MESSAGE = 'Unable to fetch dummy listings.';

export const fetchSearchResults = async (
  params: SearchRequest = {},
): Promise<SearchResponse> => {
  const query = new URLSearchParams();

  if (params.search) {
    query.set('search', params.search);
  }

  if (params.filter) {
    query.set('filter', params.filter);
  }

  query.set('take', String(params.take ?? DEFAULT_TAKE));
  query.set('offset', String(params.offset ?? DEFAULT_OFFSET));

  const response = await fetch(
    `${API_BASE_URL}${SEARCH_ENDPOINT}?${query.toString()}`,
  );

  if (!response.ok) {
    throw new Error(FETCH_RESULTS_ERROR_MESSAGE);
  }

  return (await response.json()) as SearchResponse;
};
