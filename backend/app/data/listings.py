from dataclasses import dataclass


@dataclass(frozen=True)
class ListingRecord:
    id: str
    title: str
    price_amount: int
    image: str
    link: str


LISTING_RECORDS: tuple[ListingRecord, ...] = (
    ListingRecord(
        id="ebay-101",
        title="Refurbished Apple AirPods Pro 2nd Generation",
        price_amount=189,
        image="https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=900&q=80",
        link="https://www.ebay.com/itm/101",
    ),
    ListingRecord(
        id="ebay-102",
        title="Nintendo Switch OLED Console with White Joy-Con",
        price_amount=274,
        image="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
        link="https://www.ebay.com/itm/102",
    ),
    ListingRecord(
        id="ebay-103",
        title="Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        price_amount=299,
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        link="https://www.ebay.com/itm/103",
    ),
    ListingRecord(
        id="ebay-104",
        title="Kindle Paperwhite Signature Edition 32GB",
        price_amount=149,
        image="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
        link="https://www.ebay.com/itm/104",
    ),
)

