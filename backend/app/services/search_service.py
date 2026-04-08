from collections.abc import Sequence

from app.data.listings import LISTING_RECORDS, ListingRecord
from app.schemas.listing import (
    ListingItemDto,
    SearchFilter,
    SearchQueryDto,
    SearchResponseDto,
)


class SearchService:
    def __init__(self, listing_records: Sequence[ListingRecord]) -> None:
        self._listing_records = tuple(listing_records)

    def search_listings(self, query: SearchQueryDto) -> SearchResponseDto:
        filtered_items = self._filter_listings(query.q)
        sorted_items = self._sort_listings(filtered_items, query.filter)
        paginated_items = sorted_items[query.offset : query.offset + query.take]

        return SearchResponseDto(
            items=[self._serialize_listing(item) for item in paginated_items],
            total=len(sorted_items),
            q=query.q,
            filter=query.filter,
            take=query.take,
            offset=query.offset,
        )

    def _filter_listings(self, search_term: str | None) -> list[ListingRecord]:
        if search_term is None:
            return list(self._listing_records)

        normalized_search_term = search_term.lower()
        return [
            item
            for item in self._listing_records
            if normalized_search_term in item.title.lower()
        ]

    @staticmethod
    def _sort_listings(
        listing_records: list[ListingRecord],
        sort_filter: SearchFilter | None,
    ) -> list[ListingRecord]:
        if sort_filter == SearchFilter.PRICE_ASC:
            return sorted(listing_records, key=lambda item: item.price_amount)

        if sort_filter == SearchFilter.PRICE_DESC:
            return sorted(
                listing_records,
                key=lambda item: item.price_amount,
                reverse=True,
            )

        return listing_records

    @staticmethod
    def _serialize_listing(item: ListingRecord) -> ListingItemDto:
        return ListingItemDto(
            id=item.id,
            title=item.title,
            price=f"${item.price_amount}",
            condition=item.condition,
            image=item.image,
            link=item.link,
        )


search_service = SearchService(LISTING_RECORDS)
