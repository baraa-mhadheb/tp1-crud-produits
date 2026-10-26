"""Tests CRUD exécutés contre la vraie base PostgreSQL."""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

PRODUCT = {"name": "Clavier test", "description": "Clavier mécanique", "price": 49.9, "quantity": 10}


def test_crud_complet():
    # CREATE
    r = client.post("/products", json=PRODUCT)
    assert r.status_code == 201
    created = r.json()
    pid = created["id"]
    assert created["name"] == PRODUCT["name"]

    # READ liste
    r = client.get("/products")
    assert r.status_code == 200
    assert any(p["id"] == pid for p in r.json())

    # READ détail
    r = client.get(f"/products/{pid}")
    assert r.status_code == 200
    assert r.json()["price"] == 49.9

    # UPDATE
    updated = {**PRODUCT, "name": "Clavier modifié", "price": 59.0, "quantity": 5}
    r = client.put(f"/products/{pid}", json=updated)
    assert r.status_code == 200
    assert r.json()["name"] == "Clavier modifié"
    assert client.get(f"/products/{pid}").json()["quantity"] == 5

    # DELETE
    r = client.delete(f"/products/{pid}")
    assert r.status_code == 204
    assert client.get(f"/products/{pid}").status_code == 404


def test_validation():
    r = client.post("/products", json={"name": "", "price": -1})
    assert r.status_code == 422


def test_not_found():
    assert client.get("/products/999999").status_code == 404
    assert client.put("/products/999999", json=PRODUCT).status_code == 404
    assert client.delete("/products/999999").status_code == 404
