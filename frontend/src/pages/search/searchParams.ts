import {
  DEFAULT_FILTER,
  FILTER_OPTIONS,
  FILTER_PARAM_KEY,
  SEARCH_PARAM_KEY,
} from '../../constants/search';
import type { SearchFilter } from '../../types/search';

interface SearchPageUrlState {
  filter: SearchFilter;
  searchQuery: string;
}

const VALID_FILTER_VALUES = new Set(FILTER_OPTIONS.map((option) => option.value));

const sanitizeFilter = (value: string | null): SearchFilter => {
  if (!value || !VALID_FILTER_VALUES.has(value as SearchFilter)) {
    return DEFAULT_FILTER;
  }

  return value as SearchFilter;
};

export const getInitialSearchPageState = (): SearchPageUrlState => {
  if (typeof window === 'undefined') {
    return {
      filter: DEFAULT_FILTER,
      searchQuery: '',
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    filter: sanitizeFilter(params.get(FILTER_PARAM_KEY)),
    searchQuery: params.get(SEARCH_PARAM_KEY)?.trim() ?? '',
  };
};

export const syncSearchPageStateToUrl = (state: SearchPageUrlState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const params = new URLSearchParams();

  if (state.searchQuery) {
    params.set(SEARCH_PARAM_KEY, state.searchQuery);
  }

  if (state.filter !== DEFAULT_FILTER) {
    params.set(FILTER_PARAM_KEY, state.filter);
  }

  const nextUrl = params.size > 0
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState(null, '', nextUrl);
};
