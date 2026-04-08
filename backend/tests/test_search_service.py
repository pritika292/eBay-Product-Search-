from app.data.listings import ListingRecord
from app.schemas.listing import SearchFilter, SearchQueryDto
from app.services.search_service import SearchService


def build_search_service() -> SearchService:
    return SearchService(
        listing_records=[
            ListingRecord(
                id="item-1",
                title="Sony WH-1000XM5 Wireless Headphones",
                price_amount=299,
                condition="New",
                image="https://example.com/sony.jpg",
                link="https://example.com/sony",
            ),
            ListingRecord(
                id="item-2",
                title="Apple AirPods Pro 2nd Generation",
                price_amount=189,
                condition="Open box",
                image="https://example.com/airpods.jpg",
                link="https://example.com/airpods",
            ),
            ListingRecord(
                id="item-3",
                title="Lenovo ThinkPad X1 Carbon Gen 12",
                price_amount=1379,
                condition="Certified refurbished",
                image="https://example.com/thinkpad.jpg",
                link="https://example.com/thinkpad",
            ),
        ]
    )


def test_search_service_returns_all_items_for_default_query() -> None:
    service = build_search_service()

    response = service.search_listings(SearchQueryDto())

    assert response.total == 3
    assert [item.id for item in response.items] == ["item-1", "item-2", "item-3"]


def test_search_service_filters_results_case_insensitively() -> None:
    service = build_search_service()

    response = service.search_listings(SearchQueryDto(q="SONY"))

    assert response.total == 1
    assert [item.title for item in response.items] == [
        "Sony WH-1000XM5 Wireless Headphones"
    ]
    assert response.items[0].condition == "New"


def test_search_service_sorts_by_price_ascending() -> None:
    service = build_search_service()

    response = service.search_listings(SearchQueryDto(filter=SearchFilter.PRICE_ASC))

    assert [item.price for item in response.items] == ["$189", "$299", "$1379"]


def test_search_service_sorts_by_price_descending() -> None:
    service = build_search_service()

    response = service.search_listings(SearchQueryDto(filter=SearchFilter.PRICE_DESC))

    assert [item.price for item in response.items] == ["$1379", "$299", "$189"]


def test_search_service_applies_pagination_and_keeps_total_count() -> None:
    service = build_search_service()

    response = service.search_listings(SearchQueryDto(take=1, offset=1))

    assert response.total == 3
    assert len(response.items) == 1
    assert response.items[0].id == "item-2"


def test_search_service_returns_empty_results_when_search_has_no_match() -> None:
    service = build_search_service()

    response = service.search_listings(SearchQueryDto(q="camera"))

    assert response.total == 0
    assert response.items == []


def test_search_service_returns_empty_page_when_offset_exceeds_total() -> None:
    service = build_search_service()

    response = service.search_listings(SearchQueryDto(offset=10))

    assert response.total == 3
    assert response.items == []
