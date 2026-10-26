from sqlalchemy.orm import Session
from . import models, schemas


def get_products(db: Session):
    return db.query(models.Product).order_by(models.Product.id).all()


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_product(db: Session, data: schemas.ProductCreate):
    product = models.Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product: models.Product, data: schemas.ProductUpdate):
    for key, value in data.model_dump().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product: models.Product):
    db.delete(product)
    db.commit()
