from fastapi import APIRouter, Query

from app.data.listings import LISTING_RECORDS, ListingRecord
from app.schemas.listing import ListingItemDto, SearchFilter, SearchResponseDto

router = APIRouter()


@router.get("/search")
def search_listings(
    search: str | None = Query(default=None, max_length=200),
    filter: SearchFilter | None = Query(default=None),
    take: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> SearchResponseDto:
    normalized_search = search.strip() if search else None

    filtered_items = [
        item
        for item in LISTING_RECORDS
        if not normalized_search
        or normalized_search.lower() in item.title.lower()
    ]

    if filter == SearchFilter.PRICE_ASC:
        filtered_items = sorted(filtered_items, key=lambda item: item.price_amount)
    elif filter == SearchFilter.PRICE_DESC:
        filtered_items = sorted(
            filtered_items,
            key=lambda item: item.price_amount,
            reverse=True,
        )

    paginated_items = filtered_items[offset : offset + take]

    return SearchResponseDto(
        items=[serialize_listing(item) for item in paginated_items],
        total=len(filtered_items),
        search=normalized_search,
        filter=filter,
        take=take,
        offset=offset,
    )


def serialize_listing(item: ListingRecord) -> ListingItemDto:
    return ListingItemDto(
        id=item.id,
        title=item.title,
        price=f"${item.price_amount}",
        image=item.image,
        link=item.link,
    )
