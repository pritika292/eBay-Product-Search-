from enum import StrEnum

from pydantic import BaseModel, Field, HttpUrl, field_validator


class SearchFilter(StrEnum):
    RELEVANCE = "relevance"
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"


class ListingItemDto(BaseModel):
    id: str
    title: str
    price: str
    condition: str
    image: HttpUrl
    link: HttpUrl


class SearchQueryDto(BaseModel):
    q: str | None = Field(default=None, max_length=200)
    filter: SearchFilter | None = None
    take: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)

    @field_validator("q")
    @classmethod
    def normalize_search(cls, value: str | None) -> str | None:
        if value is None:
            return None

        normalized_value = value.strip()
        return normalized_value or None


class SearchResponseDto(BaseModel):
    items: list[ListingItemDto]
    total: int
    q: str | None = None
    filter: SearchFilter | None = None
    take: int
    offset: int
