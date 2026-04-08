import type { SearchFilter } from '../types/search';

export const DEFAULT_PAGE_SIZE = 20;
export const SKELETON_CARD_COUNT = 3;
export const DEFAULT_FILTER: SearchFilter = 'relevance';
export const EMPTY_STATE_TITLE = 'Try a different search term';
export const EMPTY_STATE_MESSAGE = 'The dummy dataset is small right now, so narrower or different item names may help.';
export const RESULTS_REFRESH_MESSAGE = 'Refreshing results...';
export const LOAD_MORE_LABEL = 'Load more';
export const LOAD_MORE_LOADING_LABEL = 'Loading more...';
export const SEARCH_PAGE_TITLE = 'eBay Products';
export const SEARCH_PAGE_DESCRIPTION = "Browse a curated set of products from eBay with quick filters and pricing details inspired by Airbnb's search experience.";
export const SEARCH_PLACEHOLDER = 'Search headphones, consoles, e-readers...';
export const SEARCH_BUTTON_LABEL = 'Search';
export const RESULTS_LABEL = 'Results';
export const LOAD_MORE_STATUS_LABEL = 'More products load automatically as you scroll.';
export const SEARCH_PARAM_KEY = 'q';
export const FILTER_PARAM_KEY = 'sort';

export const FILTER_OPTIONS: Array<{ label: string; value: SearchFilter }> = [
  { label: 'Best match', value: 'relevance' },
  { label: 'Lowest price', value: 'price_asc' },
  { label: 'Highest price', value: 'price_desc' },
];
