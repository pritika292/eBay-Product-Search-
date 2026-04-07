import type { ListingItem } from '../types/search';
import {
  DEFAULT_LISTING_META,
  LISTING_META_BY_ID,
} from '../constants/listing';

interface ListingCardProps {
  item: ListingItem;
  position: number;
}

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 fill-current"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 0 0 .95.69h4.166c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 0 0-.364 1.118l1.287 3.962c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 0 0-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.539-1.118l1.287-3.962a1 1 0 0 0-.364-1.118L2.06 9.389c-.783-.57-.38-1.81.588-1.81h4.166a1 1 0 0 0 .95-.69l1.286-3.962Z" />
  </svg>
);

const HeartIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 stroke-current"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 21s-6.716-4.344-9.193-8.151C.81 9.764 2.27 5.5 6.172 5.5c2.06 0 3.39 1.064 4.178 2.226C11.137 6.564 12.468 5.5 14.527 5.5c3.902 0 5.363 4.264 3.365 7.349C18.716 16.656 12 21 12 21Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  </svg>
);

const DotIcon = () => <span aria-hidden="true" className="text-slate-300">.</span>;

const ListingCard = ({ item, position }: ListingCardProps) => {
  const meta = LISTING_META_BY_ID[item.id] ?? DEFAULT_LISTING_META;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
      <div className="flex h-full flex-col md:flex-row">
        <div className="relative md:w-72 md:flex-none">
          <img
            className="h-64 w-full object-cover md:h-full"
            src={item.image}
            alt={item.title}
          />
          <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm backdrop-blur">
            {meta.badge}
          </span>
          <button
            aria-label={`Save ${item.title}`}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
            type="button"
          >
            <HeartIcon />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                #
                {position}
                {' '}
                in featured picks
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                {item.title}
              </h2>
            </div>
            <span className="shrink-0 text-sm font-medium text-slate-500">
              {item.price}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{meta.seller}</span>
            <DotIcon />
            <span>{meta.condition}</span>
            <DotIcon />
            <span>{meta.shipping}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              <StarIcon />
              {meta.sellerScore}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1">
              {meta.saves}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1">
              Item ID
              {' '}
              {item.id}
            </span>
          </div>

          <div className="mt-6 flex flex-1 items-end justify-between gap-4 border-t border-slate-100 pt-6">
            <div>
              <p className="text-sm text-slate-500">Current price</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {item.price}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Includes current dummy marketplace metadata
              </p>
            </div>

            <a
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
              href={item.link}
              rel="noreferrer"
              target="_blank"
            >
              View listing
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ListingCard;
