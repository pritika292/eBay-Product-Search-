import { useEffect, useState } from 'react';

import ListingCard from '../../components/ListingCard';
import { fetchSearchResults } from '../../services/search';
import type {
  SearchFilter,
  SearchResponse,
} from '../../types/search';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
const PAGE_SIZE = 2;

const FILTER_OPTIONS: Array<{ label: string; value: SearchFilter }> = [
  { label: 'Best match', value: 'relevance' },
  { label: 'Lowest price', value: 'price_asc' },
  { label: 'Highest price', value: 'price_desc' },
];

function SearchPage() {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [data, setData] = useState<SearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('relevance');
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadResults() {
      setStatus('loading');
      setErrorMessage('');

      try {
        const results = await fetchSearchResults({
          search: activeQuery || undefined,
          filter: activeFilter,
          take: PAGE_SIZE,
          offset: 0,
        });

        if (!ignore) {
          setData(results);
          setStatus('success');
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unexpected request error.',
          );
          setStatus('error');
        }
      }
    }

    loadResults().catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, [activeFilter, activeQuery]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveQuery(searchInput.trim());
  }

  async function handleLoadMore() {
    if (!data || isFetchingMore || data.items.length >= data.total) {
      return;
    }

    setIsFetchingMore(true);

    try {
      const nextPage = await fetchSearchResults({
        search: activeQuery || undefined,
        filter: activeFilter,
        take: PAGE_SIZE,
        offset: data.items.length,
      });

      setData({
        ...nextPage,
        items: [...data.items, ...nextPage.items],
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unexpected request error.',
      );
      setStatus('error');
    } finally {
      setIsFetchingMore(false);
    }
  }

  function renderContent() {
    if (status === 'loading' && !data) {
      return (
        <div className="grid gap-5">
          {[0, 1, 2].map((item) => (
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

    if (status === 'error') {
      return (
        <div className="rounded-[1.75rem] border border-rose-100 bg-rose-50 p-6 text-rose-900">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
            Request failed
          </p>
          <p className="mt-3 text-base">{errorMessage}</p>
        </div>
      );
    }

    if (status === 'success' && data?.items.length === 0) {
      return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            No results
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Try a different search term
          </h2>
          <p className="mt-3 text-slate-600">
            The dummy dataset is small right now, so narrower or different item
            names may help.
          </p>
        </div>
      );
    }

    if (!data) {
      return null;
    }

    return (
      <div className="grid gap-5">
        {status === 'loading' && (
          <p className="text-sm font-medium text-slate-500">
            Refreshing results...
          </p>
        )}
        {data.items.map((item, index) => (
          <ListingCard key={item.id} item={item} position={index + 1} />
        ))}

        {data.items.length < data.total && (
          <div className="flex justify-center pt-2">
            <button
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isFetchingMore}
              onClick={() => {
                handleLoadMore().catch(() => undefined);
              }}
              type="button"
            >
              {isFetchingMore ? 'Loading more...' : 'Show more'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f7f6_0%,#f4f1ec_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-[2rem] bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur sm:p-8 lg:p-10">
        <div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              eBay Products
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Browse a curated set of results with quick filters, spacious cards,
              and pricing details inspired by Airbnb&apos;s search experience.
            </p>
          </div>

          <form
            className="mt-8 rounded-[1.75rem] border border-slate-200 bg-stone-50 p-3 shadow-sm"
            onSubmit={handleSearchSubmit}
          >
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="flex-1">
                <input
                  aria-label="Search items"
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search headphones, consoles, e-readers..."
                  type="search"
                  value={searchInput}
                />
              </div>

              <div className="lg:w-52">
                <select
                  aria-label="Sort items"
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  onChange={(event) => {
                    setActiveFilter(event.target.value as SearchFilter);
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
                Search
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Results
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {data?.items.length ?? 0}
                {' '}
                of
                {' '}
                {data?.total ?? 0}
                {' '}
                stays
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              {activeQuery
                ? `Searching for "${activeQuery}"`
                : 'Showing all available stays'}
            </p>
          </div>

          <div className="mt-6">{renderContent()}</div>
        </div>
      </section>
    </main>
  );
}

export default SearchPage;
