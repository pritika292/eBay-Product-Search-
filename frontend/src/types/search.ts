export interface ListingItem {
  id: string;
  title: string;
  price: string;
  condition: string;
  image: string;
  link: string;
}

export type SearchFilter = 'relevance' | 'price_asc' | 'price_desc';

export interface SearchRequest {
  q?: string;
  filter?: SearchFilter;
  take?: number;
  offset?: number;
}

export interface SearchResponse {
  items: ListingItem[];
  total: number;
  q: string | null;
  filter: SearchFilter | null;
  take: number;
  offset: number;
}
