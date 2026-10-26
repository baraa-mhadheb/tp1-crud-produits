import os
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import engine, get_db

# Création automatique de la table "products" si elle n'existe pas
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TP1 - API CRUD Produits", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API Produits opérationnelle", "docs": "/docs"}


# 1. CREATE
@app.post("/products", response_model=schemas.ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(data: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, data)


# 2. READ (liste)
@app.get("/products", response_model=List[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


# 3. READ (détail)
@app.get("/products/{product_id}", response_model=schemas.ProductOut)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    return product


# 4. UPDATE
@app.put("/products/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, data: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    return crud.update_product(db, product, data)


# 5. DELETE
@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    crud.delete_product(db, product)
