from db import get_streams, get_last_transaction, add_stream_transaction, get_price_for_stream
from solana.account import Account
from solana.instruction import InstructionLayout, encode_data
from solana.publickey import PublicKey
from solana.rpc.api import Client
from solana.transaction import AccountMeta, Transaction, TransactionInstruction
from spl.token.client import Token
from spl.token.constants import TOKEN_PROGRAM_ID
from datetime import date, datetime
from solana.rpc.types import TxOpts

import os
from dotenv import load_dotenv

# ENV Variables
DOTENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(DOTENV_PATH)

payer_priv_key = os.environ.get('payer_priv_key')
payer_priv_key = [int(item) for item in payer_priv_key.strip('][').split(', ')]

withdraw_payer = Account(payer_priv_key[:32])
programId = os.environ.get('programId')

dev_4_priv = payer_priv_key
transfer_payer = Account(dev_4_priv[:32])

token_pub_key = PublicKey(os.environ.get('token_pub_key'))
token_address_key = os.environ.get('token_address_key')
solana_client = Client("https://api.devnet.solana.com")

# {"DB CODE for interval": "interval in days"}
STREAM_INTERVAL = {
    0: 1,
    1: 7,
    2: 30
}

def fromLamports(amount: int):
    return amount / 1000_000_000

def withdraw(pda: str):
    transfer_layout = InstructionLayout(idx=1, fmt="Q")
    data = encode_data(transfer_layout, 0)

    instruction = TransactionInstruction(keys=[
        AccountMeta(
            pubkey=withdraw_payer.public_key(),
            is_signer=True,
            is_writable=True
        ), AccountMeta(
            pubkey=PublicKey(pda),
            is_signer=False,
            is_writable=True
        ),
    ],
        program_id=PublicKey(programId),
        data=data
    )

    block_data = solana_client.get_recent_blockhash()

    transaction = Transaction(
        fee_payer=withdraw_payer.public_key(),
        recent_blockhash=block_data['result']['value']['blockhash']
    )

    transaction.add(instruction)
    transaction.add_signer(withdraw_payer)

    res = solana_client.send_transaction(
        transaction, withdraw_payer, opts=TxOpts(skip_confirmation=False))

    beforeWithdrawBalance = res["result"]["meta"]["preBalances"][1]
    afterWithdrawBalance = res["result"]["meta"]["postBalances"][1]
    withdrawnSol = beforeWithdrawBalance - afterWithdrawBalance

    return fromLamports(withdrawnSol)


def toLamports(amount: int):
    return int(amount * 1000_000_000)

def getTokenAccountKey(publicKey: PublicKey, token: Token):
    res = token.get_accounts(PublicKey(publicKey))
    if len(res['result']['value']) > 0:
        return res['result']['value'][0]['pubkey']
    else:
        return token.create_associated_token_account(PublicKey(publicKey))

# Transfer sBucks token to User
# args:
#  1. to: str (public address of user)
#  2. amount: int
#      - amount == dollar value of total withdrawn SOL / dollar price of one sBucks token
#      - suppose we've withdrawn 10$ worth of SOL from user's investPda, we must send 10$ worth of sBucks token to user
def transfer(to: str, amount: float):
    token = Token(solana_client, token_pub_key, TOKEN_PROGRAM_ID, transfer_payer)

    dest_key = getTokenAccountKey(PublicKey(to), token)
    res = token.transfer(
        source=token_address_key,
        dest=dest_key,
        owner=transfer_payer,
        amount=toLamports(amount)
    )
    print(res)

def main():
    today_date = date.today()
    streams = get_streams()
    solPrice, sBucksPrice = get_price_for_stream()
    print(solPrice, sBucksPrice)
    for stream in streams:
        db_transaction = None
        # Check for endDate
        endDate = datetime.fromtimestamp(stream.endTime)
        if endDate.date() > today_date and stream.tokenSymbol == "SOLBUCKS":
            # Fetch last transaction date of stream
            transaction = get_last_transaction(stream.id)
            if transaction is None:
                # Make first transaction for stream
                withdrawnSOL = withdraw(stream.investPda)
                sBucks =  (withdrawnSOL * solPrice) / sBucksPrice
                transfer(stream.publicKey, sBucks)
                db_transaction = {
                    "streamId": stream.id,
                    "date": today_date
                }
            else:
                days_since_last_transaction = (today_date - transaction.transactionTime).days
                if STREAM_INTERVAL[stream.interval] == days_since_last_transaction:
                    # Make next transaction for stream
                    withdrawnSOL = withdraw(stream.investPda)
                    sBucks =  (withdrawnSOL * float(solPrice)) / float(sBucksPrice)
                    transfer(stream.publicKey, sBucks)
                    # Add transaction to DB
                    db_transaction = {
                        "streamId": stream.id,
                        "date": today_date
                    }
        if db_transaction:
            print("Adding transaction to DB")
            add_stream_transaction(db_transaction)

if __name__ == '__main__':
    try:
        main()
        exit()
    except Exception as e:
        print(e)
        exit()