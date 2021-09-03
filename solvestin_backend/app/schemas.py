from pydantic import BaseModel

class StreamCreate(BaseModel):
    publicAddress: str
    interval: int
    totalAmount: float
    startTime: int
    endTime: int
    investPda: str

    class Config:
        orm_mode = True


class SaveTransaction(BaseModel):
    publicKey: str
    tokenId: int
    transactionId: str
    side: str
    quantity: float
    source: str
    destination: str

    class Config:
        orm_mode = True