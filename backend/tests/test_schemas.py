import pytest
from pydantic import ValidationError

from app.schemas.listing import SearchFilter, SearchQueryDto


def test_search_query_uses_expected_defaults() -> None:
    query = SearchQueryDto()

    assert query.q is None
    assert query.filter is None
    assert query.take == 20
    assert query.offset == 0


def test_search_query_trims_search_value() -> None:
    query = SearchQueryDto(q="  sony headphones  ")

    assert query.q == "sony headphones"


def test_search_query_converts_blank_search_to_none() -> None:
    query = SearchQueryDto(q="   ")

    assert query.q is None


def test_search_query_accepts_valid_filter() -> None:
    query = SearchQueryDto(filter=SearchFilter.PRICE_ASC)

    assert query.filter == SearchFilter.PRICE_ASC


@pytest.mark.parametrize(
    ("payload", "expected_field"),
    [
        ({"take": 0}, "take"),
        ({"take": 101}, "take"),
        ({"offset": -1}, "offset"),
        ({"filter": "newest"}, "filter"),
        ({"q": "x" * 201}, "q"),
    ],
)
def test_search_query_rejects_invalid_values(
    payload: dict[str, int | str],
    expected_field: str,
) -> None:
    with pytest.raises(ValidationError) as exc_info:
        SearchQueryDto(**payload)

    assert expected_field in str(exc_info.value)
