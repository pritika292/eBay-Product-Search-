import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import ListingCard from '../../components/ListingCard';
import {
  DEFAULT_PAGE_SIZE,
  EMPTY_STATE_MESSAGE,
  EMPTY_STATE_TITLE,
  FILTER_OPTIONS,
  LOAD_MORE_LABEL,
  LOAD_MORE_LOADING_LABEL,
  LOAD_MORE_STATUS_LABEL,
  RESULTS_LABEL,
  RESULTS_REFRESH_MESSAGE,
  SEARCH_BUTTON_LABEL,
  SEARCH_PAGE_DESCRIPTION,
  SEARCH_PAGE_TITLE,
  SEARCH_PLACEHOLDER,
  SKELETON_CARD_COUNT,
} from '../../constants/search';
import { fetchSearchResults } from '../../services/search';
import type {
  SearchFilter,
  SearchResponse,
} from '../../types/search';
import {
  getInitialSearchPageState,
  syncSearchPageStateToUrl,
} from './searchParams';

const REQUEST_STATUS = {
  Idle: 'idle',
  Loading: 'loading',
  Success: 'success',
  Error: 'error',
} as const;

type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

const initialSearchPageState = getInitialSearchPageState();

const SearchPage = () => {
  const [status, setStatus] = useState<RequestStatus>(REQUEST_STATUS.Idle);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchInput, setSearchInput] = useState(
    initialSearchPageState.searchQuery,
  );
  const [activeQuery, setActiveQuery] = useState(
    initialSearchPageState.searchQuery,
  );
  const [activeFilter, setActiveFilter] = useState<SearchFilter>(
    initialSearchPageState.filter,
  );
  const [page, setPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreProducts = Boolean(data && data.items.length < data.total);

  useEffect(() => {
    syncSearchPageStateToUrl({
      filter: activeFilter,
      searchQuery: activeQuery,
    });
  }, [activeFilter, activeQuery]);

  useEffect(() => {
    let ignore = false;
    const abortController = new AbortController();
    const isFirstPage = page === 0;

    const loadResults = async () => {
      if (isFirstPage) {
        setStatus(REQUEST_STATUS.Loading);
        setErrorMessage('');
        setData(null);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const results = await fetchSearchResults(
          {
            q: activeQuery || undefined,
            filter: activeFilter,
            take: DEFAULT_PAGE_SIZE,
            offset: page * DEFAULT_PAGE_SIZE,
          },
          { signal: abortController.signal },
        );

        if (!ignore) {
          setData((currentData) => {
            if (isFirstPage || !currentData) {
              return results;
            }

            return {
              ...results,
              items: [...currentData.items, ...results.items],
              offset: 0,
              take: currentData.items.length + results.items.length,
            };
          });
          setStatus(REQUEST_STATUS.Success);
          setIsFetchingMore(false);
        }
      } catch (error) {
        if (!ignore && !abortController.signal.aborted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unexpected request error.',
          );
          setStatus(isFirstPage ? REQUEST_STATUS.Error : REQUEST_STATUS.Success);
          setIsFetchingMore(false);
        }
      }
    };

    loadResults().catch(() => undefined);

    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [activeFilter, activeQuery, page]);

  useEffect(() => {
    if (
      !hasMoreProducts
      || isFetchingMore
      || status !== REQUEST_STATUS.Success
      || !loadMoreTriggerRef.current
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setIsFetchingMore(true);
        setPage((currentPage) => currentPage + 1);
      },
      {
        rootMargin: '300px 0px',
      },
    );

    observer.observe(loadMoreTriggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [data, hasMoreProducts, isFetchingMore, status]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextQuery = searchInput.trim();

    setSearchInput(nextQuery);
    setActiveQuery(nextQuery);
    setPage(0);
    setIsFetchingMore(false);
  };

  const handleFilterChange = (nextFilter: SearchFilter) => {
    setActiveFilter(nextFilter);
    setPage(0);
    setIsFetchingMore(false);
  };

  const handleLoadMore = () => {
    if (!hasMoreProducts || isFetchingMore) {
      return;
    }

    setIsFetchingMore(true);
    setPage((currentPage) => currentPage + 1);
  };

  const renderContent = () => {
    if (status === REQUEST_STATUS.Loading && !data) {
      return (
        <div className="grid gap-5">
          {Array.from(
            { length: SKELETON_CARD_COUNT },
            (_, item) => item,
          ).map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white"
            >
              <div className="animate-pulse md:flex">
                <div className="h-64 bg-slate-200 md:w-72 md:flex-none" />
                <div className="flex-1 space-y-4 p-6">
                  <div className="h-4 w-28 rounded-full bg-slate-200" />
                  <div className="h-6 w-3/4 rounded-full bg-slate-200" />
                  <div className="h-6 w-1/2 rounded-full bg-slate-200" />
                  <div className="flex gap-2 pt-4">
                    <div className="h-8 w-24 rounded-full bg-slate-200" />
                    <div className="h-8 w-24 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!data && status === REQUEST_STATUS.Error) {
      return (
        <div className="rounded-[1.75rem] border border-rose-100 bg-rose-50 p-6 text-rose-900">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
            Request failed
          </p>
          <p className="mt-3 text-base">{errorMessage}</p>
        </div>
      );
    }

    if (status === REQUEST_STATUS.Success && data?.items.length === 0) {
      return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            No results
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {EMPTY_STATE_TITLE}
          </h2>
          <p className="mt-3 text-slate-600">
            {EMPTY_STATE_MESSAGE}
          </p>
        </div>
      );
    }

    if (!data) {
      return null;
    }

    return (
      <div className="grid gap-5">
        {status === REQUEST_STATUS.Loading && (
          <p className="text-sm font-medium text-slate-500">
            {RESULTS_REFRESH_MESSAGE}
          </p>
        )}

        {status === REQUEST_STATUS.Error && (
          <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50 p-5 text-sm text-rose-900">
            {errorMessage}
          </div>
        )}

        {data.items.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}

        {hasMoreProducts && (
          <div className="flex flex-col items-center gap-4 pt-2">
            <div
              ref={loadMoreTriggerRef}
              aria-hidden="true"
              className="h-2 w-full"
            />
            <p className="text-sm text-slate-500">
              {LOAD_MORE_STATUS_LABEL}
            </p>
            <button
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isFetchingMore}
              onClick={handleLoadMore}
              type="button"
            >
              {isFetchingMore ? LOAD_MORE_LOADING_LABEL : LOAD_MORE_LABEL}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f7f6_0%,#f4f1ec_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-[2rem] bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur sm:p-8 lg:p-10">
        <div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {SEARCH_PAGE_TITLE}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {SEARCH_PAGE_DESCRIPTION}
            </p>
          </div>

          <form
            className="mt-8 rounded-[1.75rem] border border-slate-200 bg-stone-50 p-3 shadow-sm"
            onSubmit={handleSearchSubmit}
          >
            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="flex-1">
                <input
                  aria-label="Search items"
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={SEARCH_PLACEHOLDER}
                  type="search"
                  value={searchInput}
                />
              </div>

              <div className="xl:w-52">
                <select
                  aria-label="Sort items"
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  onChange={(event) => {
                    handleFilterChange(event.target.value as SearchFilter);
                  }}
                  value={activeFilter}
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                type="submit"
              >
                {SEARCH_BUTTON_LABEL}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              {RESULTS_LABEL}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {data?.total ?? 0}
              {' '}
              items
            </h2>
          </div>

          <div className="mt-6">{renderContent()}</div>
        </div>
      </section>
    </main>
  );
};

export default SearchPage;
