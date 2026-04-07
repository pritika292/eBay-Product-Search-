interface ListingMeta {
  badge: string;
  seller: string;
  condition: string;
  shipping: string;
  sellerScore: string;
  saves: string;
}

export const LISTING_META_BY_ID: Record<string, ListingMeta> = {
  'ebay-101': {
    badge: 'Trending pick',
    seller: 'Soundscape Direct',
    condition: 'Certified refurbished',
    shipping: 'Free 2-day shipping',
    sellerScore: '4.92 seller score',
    saves: '128 watching',
  },
  'ebay-102': {
    badge: 'Collector favorite',
    seller: 'Pixel Harbor',
    condition: 'Excellent condition',
    shipping: 'Ships tomorrow',
    sellerScore: '4.88 seller score',
    saves: '96 watching',
  },
  'ebay-103': {
    badge: 'Guest favorite',
    seller: 'North Peak Audio',
    condition: 'Brand new',
    shipping: 'Free returns',
    sellerScore: '4.97 seller score',
    saves: '211 watching',
  },
  'ebay-104': {
    badge: 'Quiet luxury pick',
    seller: 'Paper & Pixel',
    condition: 'Like new',
    shipping: 'Free standard shipping',
    sellerScore: '4.85 seller score',
    saves: '73 watching',
  },
};

export const DEFAULT_LISTING_META: ListingMeta = {
  badge: 'Top pick',
  seller: 'Verified seller',
  condition: 'Great condition',
  shipping: 'Fast shipping',
  sellerScore: '4.9 seller score',
  saves: '40 watching',
};
