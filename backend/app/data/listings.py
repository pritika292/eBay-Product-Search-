from dataclasses import dataclass

CatalogEntry = tuple[str, int]
CatalogBlueprint = tuple[str, tuple[CatalogEntry, ...]]


@dataclass(frozen=True)
class ListingRecord:
    id: str
    title: str
    price_amount: int
    image: str
    link: str


CATALOG_BLUEPRINTS: tuple[CatalogBlueprint, ...] = (
    (
        "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=1200&q=80",
        (
            ("Refurbished Apple AirPods Pro 2nd Generation", 189),
            ("Apple AirPods 3rd Generation with Lightning Case", 129),
            ("Apple AirPods Max Space Gray Over-Ear Headphones", 429),
            ("Beats Studio Buds + Transparent Wireless Earbuds", 119),
            ("Jabra Elite 10 Advanced Noise Canceling Earbuds", 199),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        (
            ("Sony WH-1000XM5 Wireless Noise Canceling Headphones", 299),
            ("Sony WH-1000XM4 Bluetooth Over-Ear Headphones", 219),
            ("Bose QuietComfort Ultra Wireless Headphones", 349),
            ("Sennheiser Momentum 4 Wireless Headphones", 279),
            ("Marshall Monitor II Active Noise Canceling Headphones", 229),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=80",
        (
            ("Nintendo Switch OLED Console with White Joy-Con", 274),
            ("Nintendo Switch Lite Turquoise Handheld Console", 169),
            ("Nintendo Switch Mario Kart 8 Deluxe Bundle", 309),
            ("PlayStation 5 Slim Disc Console", 469),
            ("Xbox Series X 1TB Gaming Console", 449),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
        (
            ("Kindle Paperwhite Signature Edition 32GB", 149),
            ("Kindle Scribe 16GB with Premium Pen", 269),
            ("Kobo Libra Colour 7 Inch eReader", 219),
            ("Barnes & Noble NOOK GlowLight 4", 129),
            ("Amazon Fire Max 11 Tablet with Stylus Bundle", 244),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        (
            ("Apple MacBook Air 13 Inch M3 256GB", 999),
            ("Apple MacBook Pro 14 Inch M3 512GB", 1599),
            ("Dell XPS 13 Plus OLED Laptop", 1189),
            ("Lenovo ThinkPad X1 Carbon Gen 12", 1379),
            ("ASUS ROG Zephyrus G14 Gaming Laptop", 1299),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
        (
            ("Apple iPad Air 11 Inch M2 128GB Wi-Fi", 559),
            ("Apple iPad Pro 13 Inch M4 256GB Wi-Fi", 1249),
            ("Samsung Galaxy Tab S9 256GB Graphite", 669),
            ("Microsoft Surface Pro 11 Snapdragon X Plus", 999),
            ("Lenovo Tab P12 with Keyboard Pack", 379),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
        (
            ("Keychron Q1 Max Mechanical Keyboard Knob Version", 219),
            ("Logitech MX Mechanical Wireless Keyboard", 139),
            ("NuPhy Air75 V2 Low Profile Mechanical Keyboard", 129),
            ("SteelSeries Apex Pro TKL Wireless Keyboard", 189),
            ("Razer BlackWidow V4 75 Percent Mechanical Keyboard", 169),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
        (
            ("Logitech MX Master 3S Performance Wireless Mouse", 89),
            ("Razer Basilisk V3 Pro Wireless Gaming Mouse", 129),
            ("Logitech G Pro X Superlight 2 Gaming Mouse", 139),
            ("SteelSeries Aerox 5 Wireless Gaming Mouse", 99),
            ("Keychron M6 Ergonomic Wireless Mouse", 54),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
        (
            ("Canon EOS R10 Mirrorless Camera with 18-45mm Lens", 899),
            ("Sony Alpha a6700 Mirrorless Camera Body", 1349),
            ("Fujifilm X-S20 Mirrorless Camera with 15-45mm Lens", 1299),
            ("Nikon Zf Full Frame Mirrorless Camera Body", 1799),
            ("GoPro HERO13 Black Action Camera Bundle", 449),
        ),
    ),
    (
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1200&q=80",
        (
            ("iRobot Roomba Combo j9+ Robot Vacuum and Mop", 799),
            ("Roborock S8 MaxV Ultra Robot Vacuum", 1399),
            ("Dyson V15 Detect Cordless Vacuum", 589),
            ("Shark Detect Pro Self Empty Robot Vacuum", 479),
            ("Eufy X10 Pro Omni Robot Vacuum", 699),
        ),
    ),
)


def _build_listing_records() -> tuple[ListingRecord, ...]:
    listing_records: list[ListingRecord] = []

    for title, price_amount, image in _flatten_blueprints():
        item_number = 101 + len(listing_records)
        listing_records.append(
            ListingRecord(
                id=f"ebay-{item_number}",
                title=title,
                price_amount=price_amount,
                image=image,
                link=f"https://www.ebay.com/itm/{item_number}",
            )
        )

    return tuple(listing_records)


def _flatten_blueprints() -> list[tuple[str, int, str]]:
    entries: list[tuple[str, int, str]] = []

    for image, catalog_entries in CATALOG_BLUEPRINTS:
        for title, price_amount in catalog_entries:
            entries.append((title, price_amount, image))

    return entries


LISTING_RECORDS = _build_listing_records()
