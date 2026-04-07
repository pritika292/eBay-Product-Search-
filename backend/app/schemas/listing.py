from enum import StrEnum

from pydantic import BaseModel, HttpUrl


class SearchFilter(StrEnum):
    RELEVANCE = "relevance"
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"


class ListingItemDto(BaseModel):
    id: str
    title: str
    price: str
    image: HttpUrl
    link: HttpUrl


class SearchResponseDto(BaseModel):
    items: list[ListingItemDto]
    total: int
    search: str | None = None
    filter: SearchFilter | None = None
    take: int
    offset: int

