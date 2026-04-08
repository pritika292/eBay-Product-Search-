import { DEFAULT_PAGE_SIZE } from '../constants/search';
import type { SearchRequest, SearchResponse } from '../types/search';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(
  /\/$/,
  '',
);
const DEFAULT_OFFSET = 0;
const SEARCH_ENDPOINT = '/search';
const CLIENT_ERROR_MESSAGE = 'The search request was invalid. Please review your filters and try again.';
const SERVER_ERROR_MESSAGE = 'The search service is temporarily unavailable. Please try again shortly.';
const NETWORK_ERROR_MESSAGE = 'Unable to reach the search service right now.';

interface FetchSearchResultsOptions {
  signal?: AbortSignal;
}

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as { detail?: string | { message?: string } };

    if (typeof payload.detail === 'string' && payload.detail) {
      return payload.detail;
    }

    if (
      payload.detail
      && typeof payload.detail === 'object'
      && 'message' in payload.detail
      && typeof payload.detail.message === 'string'
    ) {
      return payload.detail.message;
    }
  } catch {
    // Fall through to status-based messaging when the response body is not JSON.
  }

  if (response.status >= 400 && response.status < 500) {
    return CLIENT_ERROR_MESSAGE;
  }

  return SERVER_ERROR_MESSAGE;
};

export const fetchSearchResults = async (
  params: SearchRequest = {},
  options: FetchSearchResultsOptions = {},
): Promise<SearchResponse> => {
  const query = new URLSearchParams();

  if (params.q) {
    query.set('q', params.q);
  }

  if (params.filter) {
    query.set('filter', params.filter);
  }

  query.set('take', String(params.take ?? DEFAULT_PAGE_SIZE));
  query.set('offset', String(params.offset ?? DEFAULT_OFFSET));

  const response = await fetch(
    `${API_BASE_URL}${SEARCH_ENDPOINT}?${query.toString()}`,
    { signal: options.signal },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  try {
    return (await response.json()) as SearchResponse;
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
};
