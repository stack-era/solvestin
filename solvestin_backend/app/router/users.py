from fastapi import APIRouter, Depends, HTTPException, status
from .. import models
from ..database import *

router = APIRouter()

def save_key_to_db(key: str, db: Session):
    try:
        check = db.query(models.UsersKey).filter(models.UsersKey.publicKey == key).first()
        if check:
            return {"succeed": False, "message": "Key already exists."}
        insertKey = models.UsersKey(publicKey = key)
        db.add(insertKey)
        db.commit()
        return {"succeed": True, "message": "Key added successfully."}
    except Exception as e:
        print(e)
        return {"succeed": False, "message": "There was an error while saving the key."}


@router.post("/save_userKey")
def save_userKey(key: str, db: Session = Depends(get_db)):
    res = save_key_to_db(key, db)
    return res