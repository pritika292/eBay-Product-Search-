from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas.listing import SearchQueryDto, SearchResponseDto
from app.services.search_service import search_service

router = APIRouter()


@router.get("/search", response_model=SearchResponseDto)
def search_listings(
    query: Annotated[SearchQueryDto, Depends()],
) -> SearchResponseDto:
    return search_service.search_listings(query)
