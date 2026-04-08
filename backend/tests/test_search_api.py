import pytest
from fastapi.testclient import TestClient


def test_search_endpoint_returns_expected_shape(client: TestClient) -> None:
    response = client.get("/search")

    assert response.status_code == 200

    payload = response.json()
    assert set(payload) == {"items", "total", "q", "filter", "take", "offset"}
    assert payload["take"] == 20
    assert payload["offset"] == 0
    assert isinstance(payload["items"], list)
    assert payload["total"] >= len(payload["items"])
    assert "condition" in payload["items"][0]


def test_search_endpoint_filters_results(client: TestClient) -> None:
    response = client.get("/search", params={"q": "Sony"})

    assert response.status_code == 200

    payload = response.json()
    assert payload["q"] == "Sony"
    assert payload["total"] > 0
    assert all("sony" in item["title"].lower() for item in payload["items"])


def test_search_endpoint_applies_sorting(client: TestClient) -> None:
    response = client.get("/search", params={"filter": "price_asc", "take": 3})

    assert response.status_code == 200

    prices = [
        int(item["price"].removeprefix("$")) for item in response.json()["items"]
    ]
    assert prices == sorted(prices)


def test_search_endpoint_applies_pagination(client: TestClient) -> None:
    response = client.get("/search", params={"take": 5, "offset": 5})

    assert response.status_code == 200

    payload = response.json()
    assert payload["take"] == 5
    assert payload["offset"] == 5
    assert len(payload["items"]) == 5


@pytest.mark.parametrize(
    "params",
    [
        {"filter": "newest"},
        {"take": 0},
        {"take": 101},
        {"offset": -1},
        {"q": "x" * 201},
    ],
)
def test_search_endpoint_rejects_invalid_query_params(
    client: TestClient,
    params: dict[str, int | str],
) -> None:
    response = client.get("/search", params=params)

    assert response.status_code == 422


def test_legacy_api_search_route_remains_available(client: TestClient) -> None:
    response = client.get("/api/search", params={"q": "Sony"})

    assert response.status_code == 200
