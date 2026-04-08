import type { ListingItem } from '../types/search';

const IMAGE_FALLBACK_URL = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80';

interface ListingCardProps {
  item: ListingItem;
}

const ListingCard = ({ item }: ListingCardProps) => (
  <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)] md:h-[22rem]">
    <div className="flex h-full flex-col md:flex-row">
      <div className="relative h-72 md:h-full md:w-72 md:flex-none">
        <img
          className="h-full w-full object-cover"
          src={item.image}
          alt={item.title}
          onError={(event) => {
            const imageElement = event.currentTarget;
            imageElement.onerror = null;
            imageElement.src = IMAGE_FALLBACK_URL;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              {item.title}
            </h2>
          </div>
          <span className="shrink-0 text-sm font-medium text-slate-500">
            {item.price}
          </span>
        </div>

        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {item.condition}
          </span>
        </div>

        <div className="mt-6 flex flex-1 items-end justify-between gap-4 border-t border-slate-100 pt-6">
          <div>
            <p className="text-sm text-slate-500">Current price</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {item.price}
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

export default ListingCard;
